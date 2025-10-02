# Deployment Guide

This site uses automated GitHub Actions to deploy to IPFS on every push to `main`.

## Initial Setup

### 1. Get API Keys

**Pinata:**
1. Go to https://app.pinata.cloud
2. Create account or log in
3. Go to API Keys → Generate New Key
4. Enable "Admin" permissions
5. Save the API Key and Secret Key

**Web3.Storage:**
1. Go to https://web3.storage
2. Create account or log in
3. Go to Account → Create API Token
4. Save the token

### 2. Configure GitHub Secrets

Go to your GitHub repo: https://github.com/rexkirshner/personal-website/settings/secrets/actions

Add these secrets:
- `PINATA_API_KEY` - Your Pinata API key
- `PINATA_SECRET_KEY` - Your Pinata secret key
- `WEB3_STORAGE_TOKEN` - Your Web3.Storage token

### 3. Push to GitHub

```bash
git add .github/workflows/deploy.yml
git commit -m "Add automated IPFS deployment"
git push
```

The GitHub Action will automatically:
1. Build your site
2. Pin to Pinata
3. Pin to Web3.Storage
4. Output the CID in the Actions log

## Deployment Workflow

Every time you push to `main`:

1. **Automatic build and deploy** via GitHub Actions
2. **Get the CID** from the Actions summary page
3. **Update ENS** contenthash with the new CID (see below)
4. **Update DNS** if needed (first time only)

## ENS Configuration

### Update ENS Contenthash

After each deployment, update your ENS names:

**For logrex.eth and rexkirshner.eth:**

1. Go to https://app.ens.domains
2. Connect your wallet
3. Search for your ENS name
4. Click "Records" tab
5. Under "Content Hash", click "Edit"
6. Enter: `ipfs://[YOUR_CID_HERE]`
7. Save and confirm transaction

**ENS Names to Update:**
- logrex.eth → https://logrex.eth.limo
- rexkirshner.eth → https://rexkirshner.eth.limo

## DNS Configuration (GoDaddy)

### First-Time Setup for rexkirshner.com

**Option 1: Direct IPFS Gateway (Recommended)**

Use a public IPFS gateway with your domain:

1. Go to GoDaddy DNS settings
2. Add `CNAME` record:
   - Type: `CNAME`
   - Name: `@`
   - Value: `cloudflare-ipfs.com`
   - TTL: `600`
3. Add `TXT` record:
   - Type: `TXT`
   - Name: `_dnslink`
   - Value: `dnslink=/ipfs/[YOUR_CID_HERE]`
   - TTL: `600`

**Update Process:**
- Each deployment: Update the `TXT` record with new CID

**Option 2: Cloudflare Pages (Better Performance)**

For better performance and automatic IPFS gateway:

1. Sign up for Cloudflare (free)
2. Add your domain to Cloudflare
3. Update nameservers at GoDaddy to Cloudflare's
4. In Cloudflare Pages:
   - Create new project
   - Connect to GitHub repo
   - Build command: `npm run build`
   - Output directory: `dist`
5. Domain auto-configured

**Option 3: Traditional Hosting with IPFS Sync**

Deploy to Vercel/Netlify and use IPFS as backup:

1. Connect GitHub repo to Vercel/Netlify
2. Auto-deploys on push
3. IPFS serves as decentralized backup

## Checking Deployment Status

**View GitHub Actions:**
https://github.com/rexkirshner/personal-website/actions

**Check IPFS Pinning:**
- Pinata: https://app.pinata.cloud/pinmanager
- Web3.Storage: https://web3.storage/account

**Test Your Site:**
- Via IPFS: `https://ipfs.io/ipfs/[CID]`
- Via ENS: `https://logrex.eth.limo`
- Via domain: `https://rexkirshner.com`

## Troubleshooting

**Build fails:**
- Check GitHub Actions logs
- Test locally: `npm run build`

**ENS not updating:**
- Wait 5-10 minutes for propagation
- Clear browser cache
- Try different .eth.limo gateway

**DNS not working:**
- Wait 24-48 hours for DNS propagation
- Check DNS with: `dig rexkirshner.com`
- Verify TXT record: `dig _dnslink.rexkirshner.com TXT`

## Manual Deployment (Backup Method)

If GitHub Actions fails, deploy manually:

```bash
# Build
npm run build

# Install Pinata CLI
npm install -g pinata-upload-cli

# Pin to Pinata
pinata-upload dist/

# Or use web interface:
# 1. Zip the dist folder
# 2. Upload at https://app.pinata.cloud
```

## Cost

- **GitHub Actions**: Free (2000 minutes/month)
- **Pinata**: Free tier (1GB storage, 100GB bandwidth)
- **Web3.Storage**: Free (unlimited storage)
- **IPFS Hosting**: Free (decentralized)
- **Total**: $0/month

## Security Notes

- Never commit API keys to git
- All secrets stored in GitHub Secrets
- `.env` file is gitignored
- R2 credentials never exposed in build
