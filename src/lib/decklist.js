const BASIC_LANDS = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes'];
const SNOW_BASICS = BASIC_LANDS.map((name) => `Snow-Covered ${name}`);

const GROUP_ORDER = [
  'Commander',
  'Creatures',
  'Artifacts',
  'Enchantments',
  'Instants',
  'Sorceries',
  'Planeswalkers',
  'Battles',
  'Lands',
  'Other',
];

export function parseSetCodedList(text, commanderName) {
  const cards = [];
  let section = null;
  for (const rawLine of String(text).split(/\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('#')) {
      const heading = line.match(/^#\s*([A-Za-z]+)/);
      section = heading ? heading[1].toLowerCase() : null;
      continue;
    }
    const match = line.match(/^(\d+)\s+(.+)$/);
    if (!match) continue;
    const quantity = Number(match[1]);
    const body = match[2].trim();
    const printing = body.match(/^(.*\S)\s+\(([A-Za-z0-9]+)\)\s+(\S+)$/);
    const card = printing
      ? { quantity, name: printing[1], set: printing[2], collectorNumber: printing[3] }
      : { quantity, name: body, set: null, collectorNumber: null };
    if (section === 'commanders') card.section = 'commander';
    else if (section === 'mainboard') card.section = 'main';
    cards.push(card);
  }

  for (const card of cards) {
    card.isCommander = card.section === 'commander' || card.name === commanderName;
  }
  if (!cards.some((card) => card.isCommander) && cards[0]) cards[0].isCommander = true;
  if (cards.filter((card) => card.isCommander).length > 1) {
    let kept = false;
    for (const card of cards) {
      if (!card.isCommander) continue;
      if (!kept && (card.section === 'commander' || card.name === commanderName)) {
        kept = true;
        continue;
      }
      card.isCommander = false;
    }
  }
  return cards;
}

export function toMoxfieldList(cards) {
  const commander = cards.filter((card) => card.isCommander);
  const main = cards.filter((card) => !card.isCommander);
  const lines = ['Commander'];
  for (const card of commander) lines.push(`${card.quantity} ${card.name}`);
  lines.push('', 'Deck');
  for (const card of main) lines.push(`${card.quantity} ${card.name}`);
  lines.push('');
  return lines.join('\n');
}

export function totalCards(cards) {
  return cards.reduce((sum, card) => sum + card.quantity, 0);
}

function isBasicLandName(name) {
  return BASIC_LANDS.includes(name) || SNOW_BASICS.includes(name);
}

export function groupForCard(card, typeLine) {
  if (card.isCommander) return 'Commander';
  const type = typeLine || '';
  if (type.includes('Creature')) return 'Creatures';
  if (type.includes('Land') || isBasicLandName(card.name)) return 'Lands';
  if (type.includes('Planeswalker')) return 'Planeswalkers';
  if (type.includes('Battle')) return 'Battles';
  if (type.includes('Instant')) return 'Instants';
  if (type.includes('Sorcery')) return 'Sorceries';
  if (type.includes('Artifact')) return 'Artifacts';
  if (type.includes('Enchantment')) return 'Enchantments';
  if (isBasicLandName(card.name)) return 'Lands';
  return 'Other';
}

function landRank(name) {
  const basicIndex = BASIC_LANDS.indexOf(name);
  if (basicIndex >= 0) return 100 + basicIndex;
  const snowIndex = SNOW_BASICS.indexOf(name);
  if (snowIndex >= 0) return 200 + snowIndex;
  return 0;
}

export function groupCards(cards) {
  const buckets = new Map();
  for (const card of cards) {
    const group = card.group || 'Other';
    if (!buckets.has(group)) buckets.set(group, []);
    buckets.get(group).push(card);
  }
  return GROUP_ORDER.filter((group) => buckets.has(group)).map((group) => {
    const items = buckets.get(group).slice().sort((a, b) => {
      if (group === 'Lands') {
        const rank = landRank(a.name) - landRank(b.name);
        if (rank !== 0) return rank;
      }
      return a.name.localeCompare(b.name, 'en');
    });
    const count = items.reduce((sum, card) => sum + card.quantity, 0);
    return { group, count, cards: items };
  });
}

export function scryfallSearchUrl(name) {
  return `https://scryfall.com/search?q=${encodeURIComponent(`!"${name}"`)}&unique=cards`;
}
