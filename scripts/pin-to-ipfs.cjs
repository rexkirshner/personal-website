#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');

async function pinDirectoryToIPFS(dirPath) {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  const form = new FormData();

  // Add all files from dist directory
  function addFiles(currentPath, basePath = '') {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        addFiles(filePath, path.join(basePath, file));
      } else {
        const relativePath = path.join(basePath, file);
        form.append('file', fs.createReadStream(filePath), {
          filepath: relativePath
        });
      }
    }
  }

  addFiles(dirPath);

  // Add metadata
  const metadata = JSON.stringify({
    name: `rexkirshner.com-${new Date().toISOString()}`,
  });
  form.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  form.append('pinataOptions', options);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.pinata.cloud',
      path: '/pinning/pinFileToIPFS',
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        'pinata_api_key': process.env.PINATA_API_KEY,
        'pinata_secret_api_key': process.env.PINATA_SECRET_KEY,
      },
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Pinata API error: ${res.statusCode} - ${data}`));
        }
      });
    });

    req.on('error', reject);

    form.pipe(req);
  });
}

async function main() {
  const distPath = path.join(__dirname, '..', 'dist');

  if (!fs.existsSync(distPath)) {
    console.error('Error: dist directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  console.log('📦 Pinning to Pinata IPFS...');

  try {
    const result = await pinDirectoryToIPFS(distPath);

    console.log('\n✅ Successfully pinned to IPFS!');
    console.log('\n📋 CID:', result.IpfsHash);
    console.log('\n🌐 Access URLs:');
    console.log(`   - https://ipfs.io/ipfs/${result.IpfsHash}`);
    console.log(`   - https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    console.log(`   - https://${result.IpfsHash}.ipfs.dweb.link`);
    console.log('\n🔗 ENS contenthash:', `ipfs://${result.IpfsHash}`);
    console.log('🔗 DNS _dnslink:', `dnslink=/ipfs/${result.IpfsHash}`);

    // Save CID to file
    fs.writeFileSync(
      path.join(__dirname, '..', 'LATEST_CID.txt'),
      result.IpfsHash
    );

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
