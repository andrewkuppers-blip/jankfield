import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const files = walk(dist);
const byName = new Map(files.map((file) => [path.relative(dist, file), fs.readFileSync(file, 'utf8')]));

function page(suffix) {
  const match = [...byName.entries()].find(([name]) => name === suffix);
  if (!match) throw new Error(`Missing built page ${suffix}. Have: ${[...byName.keys()].join(', ')}`);
  return match[1];
}

const forbidden = [
  /jank-o-meter/i,
  /jank_o_meter/i,
  /commitment_to_the_bit/,
  /internal_draft/,
  /held_unverified/,
  /table_spectacle/,
  /public_facing/,
  /75\.6/,
  /72\.8/,
  /89\.0/,
];

const failures = [];
for (const [name, html] of byName) {
  for (const pattern of forbidden) {
    if (pattern.test(html)) failures.push(`${name} contains ${pattern}`);
  }
}

const home = page('index.html');
const deck = page(path.join('posts', 'the-lowdown-moo-tube', 'index.html'));
const about = page(path.join('about', 'index.html'));
const archive = page(path.join('posts', 'index.html'));

const required = [
  [home, 'Jankfield'],
  [home, 'The Lowdown Moo Tube'],
  [home, '$69.44'],
  [home, 'Budget Jank'],
  [deck, 'Licorice Stick'],
  [deck, '$69.44'],
  [deck, '$429.41'],
  [deck, '$552.83'],
  [deck, '2026-10-29 19:20:16 JST'],
  [deck, '2026-10-26 22:48:54 JST'],
  [deck, 'excluding basics, exact listed printings, nonfoil'],
  [deck, 'Got beef?'],
  [deck, 'Send it down the Moo Tube'],
  [deck, 'No playtest'],
  [deck, '$102.72'],
  [deck, '$553.60'],
  [deck, 'Krark'],
  [deck, 'https://moxfield.com/decks/y2FahPnUCUuTRHirl_Qn_g'],
  [deck, 'https://moxfield.com/users/Cute_Balls'],
  [deck, 'Find the horn, blow the horn, bring the beef'],
  [deck, 'Find the horn. Blow the horn. Bring the beef.'],
  [deck, 'Copy Moxfield list'],
  [about, 'Andrew (Cute_Balls on Moxfield)'],
  [archive, 'The Lowdown Moo Tube'],
];

for (const [html, needle] of required) {
  if (!html.includes(needle)) failures.push(`Missing text: ${needle}`);
}

if (!deck.includes('Nothing was sent')) failures.push('Form is missing its unconnected message');
if (deck.includes('<!--')) failures.push('A source HTML comment leaked into the deck page');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`check-site passed (${byName.size} pages)`);
