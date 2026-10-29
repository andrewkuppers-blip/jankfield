import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const decksDir = path.join(root, 'content', 'decks');

function sha256(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function walkFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function collectFileHashes(value, out = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectFileHashes(item, out);
    return out;
  }
  if (!value || typeof value !== 'object') return out;

  const digest = typeof value.sha256 === 'string' && /^[a-f0-9]{64}$/.test(value.sha256) ? value.sha256 : null;
  const filePath = typeof value.path === 'string' ? value.path : typeof value.of === 'string' ? value.of : null;
  if (digest && filePath) out.push({ filePath, sha256: digest });

  for (const child of Object.values(value)) collectFileHashes(child, out);
  return out;
}

function resolveInDeck(deckDir, manifestPath) {
  const parts = manifestPath.split('/').filter(Boolean);
  for (let i = 0; i < parts.length; i += 1) {
    const candidate = path.join(deckDir, ...parts.slice(i));
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function checkSidecar(deckDir, failures) {
  const manifestPath = path.join(deckDir, 'release_manifest.json');
  const sidecarPath = path.join(deckDir, 'release_manifest.json.sha256');
  if (!fs.existsSync(sidecarPath)) {
    failures.push(`${path.relative(root, manifestPath)} has no release_manifest.json.sha256 sidecar`);
    return null;
  }
  const expected = fs.readFileSync(sidecarPath, 'utf8').trim().split(/\s+/)[0].toLowerCase();
  const actual = sha256(manifestPath);
  const label = path.relative(root, manifestPath);
  if (expected !== actual) {
    failures.push(`${label} sidecar mismatch\n  expected ${expected}\n  actual   ${actual}`);
    return null;
  }
  console.log(`OK  ${label}`);
  console.log(`    sidecar ${expected}`);
  return expected;
}

function verifyDeck(deckDir) {
  const failures = [];
  const missing = [];
  const checked = [];
  const manifestPath = path.join(deckDir, 'release_manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return { failures: [`${path.relative(root, deckDir)} has no release_manifest.json`], missing, checked };
  }

  checkSidecar(deckDir, failures);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const entries = collectFileHashes(manifest);

  const byPath = new Map();
  for (const entry of entries) {
    const previous = byPath.get(entry.filePath);
    if (previous && previous !== entry.sha256) {
      failures.push(`${entry.filePath} is listed twice with different hashes`);
    }
    byPath.set(entry.filePath, entry.sha256);
  }

  const seenFiles = new Set();
  for (const [filePath, expected] of byPath) {
    const absolute = resolveInDeck(deckDir, filePath);
    if (!absolute) {
      missing.push(filePath);
      continue;
    }
    seenFiles.add(absolute);
    const actual = sha256(absolute);
    const label = path.relative(root, absolute);
    if (actual !== expected) {
      failures.push(`${label} hash mismatch\n  expected ${expected}\n  actual   ${actual}`);
    } else {
      checked.push({ label, sha256: actual });
      console.log(`OK  ${label}`);
      console.log(`    ${actual}`);
    }
  }

  const editorialManifest = path.join(deckDir, 'editorial', 'MANIFEST.sha256');
  if (fs.existsSync(editorialManifest)) {
    const lines = fs.readFileSync(editorialManifest, 'utf8').split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      const match = line.match(/^([a-f0-9]{64})\s+(.+)$/i);
      if (!match) continue;
      const expected = match[1].toLowerCase();
      const name = match[2].trim();
      const absolute = path.join(deckDir, 'editorial', name);
      if (!fs.existsSync(absolute)) {
        missing.push(`editorial/${name} (from editorial/MANIFEST.sha256)`);
        continue;
      }
      const actual = sha256(absolute);
      if (actual !== expected) {
        failures.push(`editorial/${name} does not match editorial/MANIFEST.sha256\n  expected ${expected}\n  actual   ${actual}`);
      }
    }
  }

  const unlisted = walkFiles(deckDir)
    .filter((file) => !seenFiles.has(file) && path.basename(file) !== 'release_manifest.json' && path.basename(file) !== 'release_manifest.json.sha256')
    .map((file) => path.relative(deckDir, file));

  return { failures, missing, checked, unlisted };
}

function main() {
  if (!fs.existsSync(decksDir)) {
    console.error(`No content directory at ${path.relative(root, decksDir)}`);
    process.exit(1);
  }

  const decks = fs
    .readdirSync(decksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  if (decks.length === 0) {
    console.error('No deck folders in content/decks.');
    process.exit(1);
  }

  let failureCount = 0;
  for (const slug of decks) {
    console.log(`\n${slug}`);
    const { failures, missing, checked, unlisted } = verifyDeck(path.join(decksDir, slug));
    console.log(`checked ${checked.length} file${checked.length === 1 ? '' : 's'}`);
    if (unlisted?.length) {
      console.log('present, not hashed in the manifest:');
      for (const file of unlisted) console.log(`  - ${file}`);
    }
    if (missing.length) {
      console.log('listed in the manifest, not in this package (left out of the release bundle; not a hash mismatch):');
      for (const file of missing) console.log(`  - ${file}`);
    }
    if (failures.length) {
      failureCount += failures.length;
      console.error('FAILURES:');
      for (const failure of failures) console.error(`  - ${failure}`);
    }
  }

  if (failureCount > 0) {
    console.error(`\nverify failed: ${failureCount} problem${failureCount === 1 ? '' : 's'}`);
    process.exit(1);
  }
  console.log('\nverify passed');
}

main();
