import fs from 'node:fs';
import path from 'node:path';
import { feedbackEndpoint } from './config.js';
import { decksDir, repoRoot } from './paths.js';
import { colorNames, formatMoney, formatPricedAt, formatPostDate } from './format.js';
import { groupCards, groupForCard, parseSetCodedList, scryfallSearchUrl, toMoxfieldList, totalCards } from './decklist.js';
import { renderMarkdown } from './markdown.js';
import { parseReaderPrompt } from './readerPrompt.js';

const VERSIONS = [
  {
    id: 'budget',
    manifestKey: 'budget',
    tierKey: 'budget',
    editorialKey: 'budget',
    priceKey: 'budget',
    gameChangerKey: 'budget',
  },
  {
    id: 'original',
    manifestKey: 'original',
    tierKey: 'refined',
    editorialKey: 'original',
    priceKey: 'original',
    gameChangerKey: 'original',
  },
  {
    id: 'maximum',
    manifestKey: 'maxjank',
    tierKey: 'maximum',
    editorialKey: 'maximum',
    priceKey: 'maxjank',
    gameChangerKey: 'maxjank',
  },
];

const READER_NOTE_IDS = new Set(['ISS-011', 'KRARKS-THUMB', 'PLAYTEST']);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function resolveManifestPath(deckDir, manifestPath) {
  if (!manifestPath || typeof manifestPath !== 'string') return null;
  const parts = manifestPath.split('/').filter(Boolean);
  for (let i = 0; i < parts.length; i += 1) {
    const candidate = path.join(deckDir, ...parts.slice(i));
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function manifestFile(manifest, deckDir, predicate) {
  const files = manifest?.editorial?.files;
  if (!Array.isArray(files)) return null;
  const match = files.find(predicate);
  if (!match?.path) return null;
  return resolveManifestPath(deckDir, match.path);
}

function variantFile(variant, deckDir, roleTest) {
  const match = (variant?.files || []).find((file) => roleTest(file.role || ''));
  if (!match?.path) return null;
  return resolveManifestPath(deckDir, match.path);
}

function loadCardIndex() {
  const indexPath = path.join(repoRoot, 'src', 'data', 'scryfall-cards.json');
  if (!fs.existsSync(indexPath)) return {};
  const document = readJson(indexPath);
  return document.cards || {};
}

function comparisonPath(manifest, deckDir) {
  const files = manifest?.variants?.deck_package?.files || [];
  const match = files.find((file) => String(file.path || '').endsWith('comparison.json'));
  if (match?.path) {
    const resolved = resolveManifestPath(deckDir, match.path);
    if (resolved) return resolved;
  }
  const fallback = path.join(deckDir, 'artifacts', 'janksmith', 'rev2', 'the-lowdown-moo-tube-comparison.json');
  return fs.existsSync(fallback) ? fallback : null;
}

function priceNotes(versionId, manifestPrice, editorialPrice, tierPrice) {
  const notes = [];
  if (versionId === 'budget' && tierPrice?.secondary_note_default_printings) {
    notes.push(tierPrice.secondary_note_default_printings);
  } else if (editorialPrice?.secondary_caveat) {
    notes.push(editorialPrice.secondary_caveat);
  }
  if (Array.isArray(editorialPrice?.exceptions) && editorialPrice.exceptions.length) {
    notes.push(...editorialPrice.exceptions);
  } else if (Array.isArray(manifestPrice?.exceptions)) {
    notes.push(...manifestPrice.exceptions);
  }
  if (versionId !== 'maximum' && editorialPrice?.note) notes.push(editorialPrice.note);
  if (versionId === 'maximum' && manifestPrice?.exception) notes.push(manifestPrice.exception);
  return [...new Set(notes.filter(Boolean))];
}

function enrichCards(parsed, tier, cardIndex) {
  const listedByName = new Map((tier?.decklist || []).map((card) => [card.name, card]));
  const pricedByName = new Map((tier?.pricing?.per_card || []).map((card) => [card.name, card]));
  return parsed.map((card) => {
    const listed = listedByName.get(card.name);
    const priced = pricedByName.get(card.name);
    const scryfallId = listed?.scryfall_id || priced?.scryfall_id || null;
    const info = scryfallId ? cardIndex[scryfallId] : null;
    const typeLine = info?.type_line || '';
    const enriched = {
      name: card.name,
      quantity: card.quantity,
      set: card.set,
      collectorNumber: card.collectorNumber,
      isCommander: card.isCommander,
      foil: String(priced?.finish || '').toLowerCase() === 'foil',
      typeLine,
      manaCost: info?.mana_cost || '',
      scryfallUrl: info?.scryfall_uri || scryfallSearchUrl(card.name),
      imageSmall: info?.image_small || null,
      imageNormal: info?.image_normal || null,
    };
    enriched.group = groupForCard(enriched, typeLine);
    return enriched;
  });
}

function publicChanges(records) {
  return (records || []).map((record) => ({
    removed: record.removed,
    added: record.added,
    reason: record.reason || '',
    themeImpact: record.theme_impact || '',
    rulesNote: record.rules_review_notes || '',
    priceDeltaUsd: typeof record.price_delta_usd === 'number' ? record.price_delta_usd : null,
  }));
}

function loadDeck(slug, cardIndex) {
  const deckDir = path.join(decksDir, slug);
  const manifestPath = path.join(deckDir, 'release_manifest.json');
  if (!fs.existsSync(manifestPath)) return null;
  const manifest = readJson(manifestPath);

  const editorialPath = manifestFile(manifest, deckDir, (file) => file.role === 'structured editorial');
  const postPath = manifestFile(manifest, deckDir, (file) => file.role === 'post');
  const metaPath = manifestFile(manifest, deckDir, (file) => file.role === 'meta description');
  const socialPath = manifestFile(manifest, deckDir, (file) => file.role === 'social blurb');
  const promptPath = manifestFile(manifest, deckDir, (file) => file.role === 'reader feedback form copy');
  if (!editorialPath || !postPath || !metaPath || !socialPath || !promptPath) {
    throw new Error(`${slug} is missing an editorial file named in release_manifest.json`);
  }

  const editorial = readJson(editorialPath);
  const comparisonFile = comparisonPath(manifest, deckDir);
  if (!comparisonFile) throw new Error(`${slug} is missing comparison.json`);
  const comparison = readJson(comparisonFile);

  const postMarkdown = readText(postPath);
  const metaDescription = readText(metaPath).trim();
  const social = readText(socialPath).trim();
  const readerPrompt = parseReaderPrompt(readText(promptPath));

  const swapPriceBasis = String(manifest?.substitutions?.source || '');
  const versions = VERSIONS.map((spec) => {
    const variant = manifest.variants?.[spec.manifestKey];
    const tier = comparison.tiers?.[spec.tierKey];
    const editorialVersion = editorial.variant_comparison?.[spec.editorialKey];
    const manifestPrice = manifest.prices?.[spec.priceKey];
    if (!variant || !tier || !editorialVersion || !manifestPrice) {
      throw new Error(`${slug} is missing version data for ${spec.id}`);
    }
    if (tier.jank_o_meter && tier.jank_o_meter.public_facing !== false) {
      throw new Error(`${slug} ${spec.id} has a public jank meter. Refusing to build until that is removed from the page data.`);
    }

    const setCodedPath = variantFile(variant, deckDir, (role) => /set-coded|canonical/i.test(role));
    if (!setCodedPath) throw new Error(`${slug} ${spec.id} has no set-coded list`);
    const parsed = parseSetCodedList(readText(setCodedPath), manifest.deck.commander);
    const count = totalCards(parsed);
    if (count !== variant.card_count) {
      throw new Error(`${slug} ${spec.id} list has ${count} cards, manifest says ${variant.card_count}`);
    }
    const cards = enrichCards(parsed, tier, cardIndex);
    const moxfieldPath = variantFile(variant, deckDir, (role) => /moxfield/i.test(role));
    const moxfieldText = moxfieldPath ? readText(moxfieldPath) : toMoxfieldList(parsed);

    return {
      id: spec.id,
      label: editorialVersion.label,
      manifestLabel: variant.label,
      cardCount: variant.card_count,
      philosophy: editorialVersion.philosophy,
      bracket: editorialVersion.bracket,
      creatures: editorialVersion.creatures,
      tutors: editorialVersion.didgeridoo_tutors || [],
      gameChangers: manifest.validation?.game_changers?.[spec.gameChangerKey] || [],
      price: {
        usd: formatMoney(manifestPrice.official_usd),
        amount: manifestPrice.official_usd,
        basis: manifestPrice.basis,
        pricedAt: manifestPrice.priced_at,
        pricedAtLabel: formatPricedAt(manifestPrice.priced_at),
        source: manifest.prices.source,
        cap: editorialVersion.price?.cap || manifestPrice.cap || null,
        capResult: manifestPrice.result || null,
        display: editorialVersion.price?.display || '',
        notes: priceNotes(spec.id, manifestPrice, editorialVersion.price, tier.pricing),
      },
      groups: groupCards(cards),
      changes: publicChanges(tier.change_records),
      moxfieldText,
    };
  });

  const readerNotes = (manifest.unresolved_issues || [])
    .filter((issue) => READER_NOTE_IDS.has(issue.id))
    .map((issue) => issue.detail);

  const generatedAt = editorial.generated_at || manifest.manifest_generated_at;

  return {
    slug,
    title: editorial.title,
    deckName: manifest.deck.name,
    commander: manifest.deck.commander,
    colors: manifest.deck.color_identity || [],
    colorLabel: colorNames(manifest.deck.color_identity),
    format: manifest.deck.format || 'commander',
    shortDescription: editorial.short_description,
    metaDescription,
    social,
    credit: editorial.credit?.display || manifest.deck.credit,
    creditUrl: editorial.credit?.url || 'https://moxfield.com/users/Cute_Balls',
    moxfieldUrl: manifest.deck.source_url,
    moxfieldUser: editorial.credit?.moxfield_user || manifest.deck.credit,
    dateIso: generatedAt,
    dateLabel: formatPostDate(generatedAt),
    sortKey: generatedAt || '',
    postHtml: renderMarkdown(postMarkdown),
    versions,
    readerNotes,
    swapPriceBasis,
    readerPrompt,
    feedbackEndpoint: feedbackEndpoint(),
    priceSource: manifest.prices.source,
  };
}

export function loadDecks() {
  if (!fs.existsSync(decksDir)) return [];
  const cardIndex = loadCardIndex();
  const slugs = fs
    .readdirSync(decksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const decks = slugs.map((slug) => loadDeck(slug, cardIndex)).filter(Boolean);
  decks.sort((a, b) => (a.sortKey < b.sortKey ? 1 : a.sortKey > b.sortKey ? -1 : a.slug.localeCompare(b.slug)));
  return decks;
}

export function loadDeckBySlug(slug) {
  return loadDecks().find((deck) => deck.slug === slug) || null;
}
