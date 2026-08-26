# Project custody

- Canonical code: `ssh://git@rbk-archive.local:2222/lab/personal-website.git`
- Canonical project data: `/volume1/auto-rex-source-vault/manual/projects/personal-website/data`
- Data manifest SHA-256: `5cd4c2ac3a9860c0d557be9e9267424663121f53bf47231af08502a00882349a`
- Custody record: `lab/auto-rex-ops` → `custody/projects/personal-website.json`
- The Vault holds original and exported media plus an authenticated snapshot and inventory of the production `rexkirshner-com` R2 bucket. Versioned site content and deployment assets remain in Forgejo.
- Lifecycle: active; retain this local checkout and the live Cloudflare Pages and IPFS/ENS deployments, and keep Forgejo unarchived.
