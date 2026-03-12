/**
 * Update ENS contenthash for rexkirshner.eth, logrex.eth, and logarithmicrex.eth after IPFS deployment.
 *
 * Usage:
 *   npm run update-ens                  # Fetches latest CID from GitHub Actions
 *   npm run update-ens -- <CID>         # Uses the provided CID directly
 *   npm run update-ens -- --dry-run     # Shows what would happen without sending transactions
 *
 * Prerequisites:
 *   1. Create a dedicated EOA wallet for deployments
 *   2. From your main wallet, approve the deploy wallet as an operator:
 *      Call setApprovalForAll(deployerAddress, true) on each name's resolver contract.
 *      (Find the resolver address in the ENS Manager app or via this script's output.)
 *      This lets the deploy wallet update records without being the manager.
 *      Your main wallet retains full ownership and can revoke anytime.
 *   3. Fund the deploy wallet with a small amount of ETH for gas
 *   4. Create ~/coding/admin/cloud-accounts/ens-deployer.json:
 *      {
 *        "privateKey": "0x...",
 *        "names": ["rexkirshner.eth", "logrex.eth", "logarithmicrex.eth"],
 *        "rpcUrl": "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"
 *      }
 *   5. Ensure `gh` CLI is installed and authenticated (for auto-fetching CID)
 *
 * How it works:
 *   1. Reads config from ~/coding/admin/cloud-accounts/ens-deployer.json
 *   2. Gets the IPFS CID (from argument or latest GitHub Actions run)
 *   3. Encodes the CID as an EIP-1577 contenthash
 *   4. For each ENS name:
 *      a. Looks up the resolver address from the ENS Registry
 *      b. Calls setContenthash() on the resolver
 *      c. Waits for transaction confirmation
 */

import { ethers } from 'ethers';
import { CID } from 'multiformats/cid';
import { base58btc } from 'multiformats/bases/base58';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

// --- Constants ---

const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
const CONFIG_PATH = join(homedir(), 'coding/admin/cloud-accounts/ens-deployer.json');

const REGISTRY_ABI = ['function resolver(bytes32 node) view returns (address)'];
const RESOLVER_ABI = [
  'function setContenthash(bytes32 node, bytes calldata hash) external',
  'function contenthash(bytes32 node) view returns (bytes)',
];

// --- Contenthash Encoding (EIP-1577) ---

/**
 * Encode an IPFS CID as an EIP-1577 contenthash.
 *
 * The format is: varint(0xe3) + CIDv1 bytes
 * Where 0xe3 is the IPFS namespace in the multicodec table,
 * encoded as an unsigned varint (two bytes: 0xe3, 0x01).
 */
function encodeContenthash(cidStr) {
  // Strip ipfs:// prefix and ANSI escape codes (from CI log output)
  const cleaned = cidStr.replace(/^ipfs:\/\//, '').replace(/\x1b\[[0-9;]*m/g, '').trim();

  let cid;
  try {
    if (cleaned.startsWith('Qm')) {
      // CIDv0 (base58btc) → parse and upgrade to CIDv1
      cid = CID.parse(cleaned, base58btc).toV1();
    } else {
      // CIDv1 (base32, base58btc, etc.) — let multiformats detect the encoding
      cid = CID.parse(cleaned);
    }
  } catch (err) {
    throw new Error(`Invalid IPFS CID "${cleaned}": ${err.message}`);
  }

  // IPFS namespace 0xe3 as unsigned varint = [0xe3, 0x01]
  const ipfsPrefix = new Uint8Array([0xe3, 0x01]);
  const cidBytes = cid.bytes;

  const contenthash = new Uint8Array(ipfsPrefix.length + cidBytes.length);
  contenthash.set(ipfsPrefix);
  contenthash.set(cidBytes, ipfsPrefix.length);

  return '0x' + Buffer.from(contenthash).toString('hex');
}

// --- GitHub Actions CID Fetching ---

/**
 * Fetch the IPFS CID from the most recent successful GitHub Actions run.
 * Uses the `gh` CLI to query the workflow run and extract the CID from the summary.
 */
function fetchLatestCID() {
  console.log('Fetching latest CID from GitHub Actions...\n');

  try {
    // Get the latest successful run of the IPFS deploy workflow
    const runsJson = execSync(
      'gh run list --workflow=deploy.yml --status=success --limit=1 --json databaseId,headSha,createdAt',
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    const runs = JSON.parse(runsJson);

    if (runs.length === 0) {
      throw new Error('No successful deploy workflow runs found');
    }

    const run = runs[0];
    console.log(`  Latest run: ${run.databaseId} (${run.headSha.slice(0, 7)}, ${run.createdAt})`);

    // Get the jobs for this run and extract CID from logs
    const logsRaw = execSync(
      `gh run view ${run.databaseId} --log`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 10 * 1024 * 1024 }
    );

    // Look for the CID in the "Output CID" step
    // CIDs are alphanumeric — stop at quotes, ANSI codes, or other non-CID chars
    const cidMatch = logsRaw.match(/IPFS CID:\s+([A-Za-z0-9]+)/);
    if (!cidMatch) {
      throw new Error('Could not find IPFS CID in workflow logs');
    }

    const cid = cidMatch[1];
    console.log(`  Found CID: ${cid}\n`);
    return cid;
  } catch (err) {
    if (err.message.includes('gh: command not found') || err.message.includes('ENOENT')) {
      throw new Error(
        'GitHub CLI (gh) not found. Install it or provide the CID manually:\n' +
        '  npm run update-ens -- <CID>'
      );
    }
    throw err;
  }
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const cidArg = args.find((a) => !a.startsWith('--'));

  // Load config
  let config;
  try {
    config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
  } catch {
    console.error(`\nConfig not found at: ${CONFIG_PATH}`);
    console.error('\nCreate it with:');
    console.error(JSON.stringify({
      privateKey: '0x...',
      names: ['logrex.eth', 'rexkirshner.eth'],
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY',
    }, null, 2));
    process.exit(1);
  }

  const { privateKey, names, rpcUrl } = config;
  if (!privateKey || !names?.length || !rpcUrl) {
    console.error('Config must include: privateKey, names (array), rpcUrl');
    process.exit(1);
  }

  // Get CID
  const cid = cidArg || fetchLatestCID();

  // Encode contenthash
  const contenthash = encodeContenthash(cid);
  console.log(`CID:          ${cid}`);
  console.log(`Contenthash:  ${contenthash}`);
  console.log(`Names:        ${names.join(', ')}`);
  console.log(`Dry run:      ${dryRun}\n`);

  // Connect to Ethereum
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const registry = new ethers.Contract(ENS_REGISTRY, REGISTRY_ABI, provider);

  // Show wallet info
  const balance = await provider.getBalance(wallet.address);
  console.log(`Wallet:       ${wallet.address}`);
  console.log(`Balance:      ${ethers.formatEther(balance)} ETH\n`);

  if (balance === 0n) {
    console.error('Wallet has no ETH for gas. Fund it before running.');
    process.exit(1);
  }

  // Update each ENS name
  for (const name of names) {
    console.log(`--- ${name} ---`);

    const node = ethers.namehash(name);
    console.log(`  Namehash:   ${node}`);

    // Look up resolver
    const resolverAddr = await registry.resolver(node);
    if (resolverAddr === ethers.ZeroAddress) {
      console.error(`  No resolver set for ${name}. Skipping.`);
      continue;
    }
    console.log(`  Resolver:   ${resolverAddr}`);

    const resolver = new ethers.Contract(resolverAddr, RESOLVER_ABI, wallet);

    // Check current contenthash
    try {
      const current = await resolver.contenthash(node);
      if (current === contenthash) {
        console.log('  Already up to date. Skipping.\n');
        continue;
      }
      if (current && current !== '0x') {
        console.log(`  Current:    ${current}`);
      }
    } catch {
      // Resolver might not support contenthash read — continue anyway
    }

    if (dryRun) {
      console.log('  [DRY RUN] Would send setContenthash transaction\n');
      continue;
    }

    // Send transaction
    console.log('  Sending transaction...');
    try {
      const tx = await resolver.setContenthash(node, contenthash);
      console.log(`  TX hash:    ${tx.hash}`);
      console.log('  Waiting for confirmation (timeout: 5 min)...');

      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Transaction not confirmed within 5 minutes — it may have been dropped')), 5 * 60 * 1000)
        ),
      ]);
      console.log(`  Confirmed in block ${receipt.blockNumber} (gas: ${receipt.gasUsed.toString()})\n`);
    } catch (err) {
      console.error(`  Transaction failed: ${err.message}`);
      if (err.message.includes('not authorised') || err.message.includes('not authorized')) {
        console.error(`  → The wallet may not be approved as an operator on the resolver (${resolverAddr}).`);
        console.error('    From your main wallet, call setApprovalForAll(deployerAddress, true) on it.');
      }
      console.error();
    }
  }

  console.log('Done. ENS updates may take 5–15 minutes to propagate to .eth.limo gateways.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
