#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');

// Find all HTML files
function findHtmlFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      findHtmlFiles(fullPath, files);
    } else if (item.endsWith('.html')) {
      files.push(path.relative(distDir, fullPath));
    }
  }
  return files;
}

const htmlFiles = findHtmlFiles(distDir);

console.log(`📄 Found ${htmlFiles.length} HTML files to process`);

htmlFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Count how many directory levels deep this file is
  const depth = file.split('/').length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : './';

  // Replace absolute paths with relative paths
  // For root level files (index.html, expansion.html), use ./_astro
  // For nested files, use appropriate ../ prefix
  content = content
    .replace(/href="\/_astro\//g, `href="${prefix}_astro/`)
    .replace(/src="\/_astro\//g, `src="${prefix}_astro/`)
    .replace(/href="\/images\//g, `href="${prefix}images/`)
    .replace(/src="\/images\//g, `src="${prefix}images/`)
    .replace(/href="\/expansion"/g, `href="${prefix}expansion.html"`)
    .replace(/href="\/"/g, `href="${prefix}index.html"`);

  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed paths in ${file}`);
});

console.log('\n🎉 All paths converted to relative for IPFS compatibility!');