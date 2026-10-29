import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { loadDecks } from '../src/lib/decks.js';
import { parseReaderPrompt } from '../src/lib/readerPrompt.js';

const deckDir = path.join(process.cwd(), 'content', 'decks', 'the-lowdown-moo-tube');

test('the public deck is built from the locked files and hides scores', () => {
  const decks = loadDecks();
  assert.equal(decks.length, 1);
  const deck = decks[0];
  assert.equal(deck.slug, 'the-lowdown-moo-tube');
  assert.equal(deck.commander, 'Sethron, Hurloon General');
  assert.equal(deck.versions.length, 3);
  assert.equal(deck.metaDescription.startsWith('Find the horn, blow the horn, bring the beef'), true);
  assert.match(deck.postHtml, /Licorice Stick/);
  assert.doesNotMatch(deck.postHtml, /jank-o-meter/i);
  assert.equal(deck.readerPrompt.heading, 'Got beef? Help us tune the Moo Tube.');
  assert.equal(deck.readerPrompt.button, 'Send it down the Moo Tube');
  assert.equal(deck.feedbackEndpoint, '');

  const dumped = JSON.stringify(deck);
  for (const needle of ['jank_o_meter', 'internal_draft', 'commitment_to_the_bit', '75.6', 'public_facing', 'Jank-O-Meter']) {
    assert.equal(dumped.includes(needle), false, needle);
  }

  const budget = deck.versions.find((version) => version.id === 'budget');
  const original = deck.versions.find((version) => version.id === 'original');
  const maximum = deck.versions.find((version) => version.id === 'maximum');
  assert.equal(budget.price.usd, '$69.44');
  assert.equal(original.price.usd, '$429.41');
  assert.equal(maximum.price.usd, '$552.83');
  assert.equal(budget.price.pricedAtLabel, '2026-10-29 19:20:16 JST');
  assert.equal(maximum.price.pricedAtLabel, '2026-10-26 22:48:54 JST');
  assert.equal(budget.changes.length, 28);
  assert.equal(original.changes.length, 0);
  assert.equal(maximum.changes.length, 25);
  for (const version of deck.versions) {
    const count = version.groups.reduce((sum, group) => sum + group.count, 0);
    assert.equal(count, 100, version.id);
  }

  const automaton = original.groups
    .flatMap((group) => group.cards)
    .find((card) => card.name === 'Adaptive Automaton');
  assert.equal(automaton.foil, true);
  assert.equal(automaton.set, 'FDN');

  const crypt = original.groups.flatMap((group) => group.cards).find((card) => card.name === 'Blood Crypt');
  assert.equal(crypt.set, 'TRK');
  assert.equal(crypt.collectorNumber, '278');

  const budgetFile = fs.readFileSync(
    path.join(deckDir, 'artifacts', 'janksmith', 'the-lowdown-moo-tube-budget-moxfield.txt'),
    'utf8',
  );
  assert.equal(budget.moxfieldText, budgetFile);
  assert.match(original.moxfieldText, /^Commander\n1 Sethron, Hurloon General\n\nDeck\n/);
  assert.equal(original.moxfieldText.includes('(JMP)'), false);
  assert.match(original.moxfieldText, /10 Mountain/);
  assert.match(original.moxfieldText, /8 Swamp/);
});

test('reader prompt fields stay tied to the source copy', () => {
  const prompt = parseReaderPrompt(
    fs.readFileSync(path.join(deckDir, 'editorial', 'reader_prompt_rev5.md'), 'utf8'),
  );
  assert.deepEqual(
    prompt.fields.map((field) => field.kind),
    ['select', 'text', 'text', 'textarea', 'textarea', 'radio'],
  );
  assert.deepEqual(prompt.fields[0].options, ['Budget Jank', 'Original Jank', 'Maximum Jank']);
  assert.equal(prompt.fields[2].optional, true);
  assert.equal(prompt.fields[5].optional, false);
  assert.match(prompt.helper, /tested ideas from dreams/);
});
