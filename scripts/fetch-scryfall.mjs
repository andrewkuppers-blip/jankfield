import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const decksDir = path.join(root, 'content', 'decks');
const outPath = path.join(root, 'src', 'data', 'scryfall-cards.json');
const USER_AGENT = 'JankfieldStaticBot/1.0 (commander deck blog; build-time card types and images)';

function collectIds() {
  const ids = new Set();
  if (!fs.existsSync(decksDir)) return [];
  for (const slug of fs.readdirSync(decksDir)) {
    const deckDir = path.join(decksDir, slug);
    if (!fs.statSync(deckDir).isDirectory()) continue;
    const files = walk(deckDir).filter((file) => file.endsWith('comparison.json'));
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8');
      for (const match of text.matchAll(/"scryfall_id"\s*:\s*"([0-9a-f-]{36})"/g)) ids.add(match[1]);
    }
  }
  return [...ids];
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function imageOf(card) {
  const uris = card.image_uris || card.card_faces?.find((face) => face.image_uris)?.image_uris;
  if (!uris) return { image_small: null, image_normal: null };
  return {
    image_small: uris.small || null,
    image_normal: uris.normal || null,
  };
}

async function fetchCollection(ids) {
  const response = await fetch('https://api.scryfall.com/cards/collection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify({ identifiers: ids.map((id) => ({ id })) }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Scryfall collection failed (${response.status}): ${body.slice(0, 300)}`);
  }
  return response.json();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const ids = collectIds();
  if (ids.length === 0) {
    console.error('No scryfall ids found in content/decks.');
    process.exit(1);
  }
  console.log(`Fetching ${ids.length} cards from Scryfall`);
  const cards = {};
  const notFound = [];
  for (let i = 0; i < ids.length; i += 75) {
    if (i > 0) await sleep(150);
    const chunk = ids.slice(i, i + 75);
    const payload = await fetchCollection(chunk);
    for (const card of payload.data || []) {
      const images = imageOf(card);
      cards[card.id] = {
        name: card.name,
        type_line: card.type_line,
        set: card.set,
        collector_number: card.collector_number,
        scryfall_uri: card.scryfall_uri,
        mana_cost: card.mana_cost || card.card_faces?.[0]?.mana_cost || '',
        ...images,
      };
    }
    for (const missing of payload.not_found || []) notFound.push(missing);
    console.log(`  got ${payload.data?.length || 0} (chunk ${i / 75 + 1})`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const document = {
    source: 'Scryfall API /cards/collection',
    guidelines: 'https://scryfall.com/docs/api/images',
    note: 'Derived lookup for type lines, links, and image URLs. Not part of a locked deck release. Refresh with npm run cards. Image URLs are the ones Scryfall returned.',
    fetched_at: new Date().toISOString(),
    cards,
  };
  fs.writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Wrote ${Object.keys(cards).length} cards to ${path.relative(root, outPath)}`);
  if (notFound.length) {
    console.warn('Not found:', JSON.stringify(notFound, null, 2));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
