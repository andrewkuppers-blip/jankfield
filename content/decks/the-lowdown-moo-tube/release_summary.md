# JOB-001 release summary: The Lowdown Moo Tube

**Status:** AWAITING_APPROVAL (staging pending). Not published, and nothing has been approved.  
**Manifest:** `jobs/JOB-001/release_manifest.json` (schema jankfield-release-manifest/1.0, generated 2026-10-29T19:53:05+09:00)  
**Manifest sha256:** `9beb049576c28f67a7e54dff24ca2970f7f93c547eada4eb785ff876a1dcf624`  
This replaces the earlier manifest `a2e493d02c447cec594a43d16fbeba0a39db92465ae2fc7c951ba92aeb84e6fb`, which was never approved. An approval quoting the old hash does not count.

## What approval looks like

Andrew replies **in the Showrunner chat, in his own words**:

> Approve JOB-001 manifest 9beb049576c28f67a7e54dff24ca2970f7f93c547eada4eb785ff876a1dcf624

That approves:
- the three card lists exactly as hashed above (original decklist.txt, budget and maxjank set-coded + Moxfield files)
- the editorial rev5 files exactly as hashed above
- owner sign-off on the bracketed quote edits in the post's origin story: '[a sound]' (for 'a sounds') and '[Minotaurs have rarely gotten the spotlight since the early days of Magic, Sethron aside]' (for 'minotaur's have not received much of a major printing since the early days of magic'), plus spelling/capitalization/punctuation cleanup and added paragraph breaks
- the disclosed prices, timestamps and exceptions

- It does **not** cover Jank-O-Meter scores, which are held, or any file whose hash differs from the manifest. Changing any file means a new manifest and a new approval.
- Text written by an agent never counts as approval. The 2026-10-28 approval reported by the Janksmith is **not counted**.
- **Approval alone does not publish anything.** Publishing also needs a staging site to exist, a staged build from the Groundskeeper, and a check that the staged build matches this manifest. None of those exist yet.

## Deck and source

- **Deck:** The Lowdown Moo Tube. Commander: Sethron, Hurloon General. Colors: B/R. Credit: Andrew (Cute_Balls on Moxfield)
- **Deck ID:** `y2FahPnUCUuTRHirl_Qn_g`. **Source version ID:** `moxfield:v0@2026-10-20T23:06:26.14Z`. Moxfield last updated: 2026-10-21 08:06 JST
- **Source:** https://moxfield.com/decks/y2FahPnUCUuTRHirl_Qn_g. Locked 2026-10-29 18:40:34 JST from the Moxfield public v3 JSON, read only.
- **Content hash:** `99408f321505b64c06aace03ab0878b6d24fb079f9c6b5055a509a1ac79d8e29` (sha256 of decklist.txt, normalization described in showrunner/NORMALIZATION.md)

## Variants (100 cards each, commander included)

| Variant | File | Cards | sha256 |
|---|---|---|---|
| Original (Andrew's Moxfield list, unchanged) | `jobs/JOB-001/decklist.txt` | 100 | `99408f321505b64c06aace03ab0878b6d24fb079f9c6b5055a509a1ac79d8e29` |
| Budget Jank | `jobs/JOB-001/artifacts/janksmith/the-lowdown-moo-tube-budget.txt` | 100 | `084d92f17762ca963d0694751fa34ce8dd2449ec6f91041696875e9e7a3b69e1` |
| Budget Jank | `jobs/JOB-001/artifacts/janksmith/the-lowdown-moo-tube-budget-moxfield.txt` | 100 | `d4494ead4de44fd165aef87e6b008f88d2166ccd85cc2f2c972e12bf0fdf9eb5` |
| Maximum Jank | `jobs/JOB-001/artifacts/janksmith/the-lowdown-moo-tube-maxjank.txt` | 100 | `81880b310b71c0d5ab995aedc25b8f1df47ec26790f1f5f385d1289fe679f8a6` |
| Maximum Jank | `jobs/JOB-001/artifacts/janksmith/the-lowdown-moo-tube-maxjank-moxfield.txt` | 100 | `53ee68f82cf93fc7346b82993da127be34a97f26414b64caa5cda67b3149ade2` |

Deck package: Janksmith rev2. Its changes are text only, and no cards have changed since the variants were built.
- `jobs/JOB-001/artifacts/janksmith/rev2/the-lowdown-moo-tube-comparison.json`: `0b128095bd6ca76b5b633b2394d98a44d5df2306c976de4636ca676af78c0c2f`
- `jobs/JOB-001/artifacts/janksmith/rev2/validation.json`: `97f093a97b31266b618d426602e0c3b54b605879074e6b2a22a9a0d888dc8c09`
- `jobs/JOB-001/artifacts/janksmith/rev2/CHANGELOG.md`: `cc44ef062282d011d5aa1f1e5ad9a1d306fe21a47cd0d9f54581e0be6bf097b0`
- `jobs/JOB-001/artifacts/janksmith/rev2/README_janksmith.md`: `cccec1096b88617923321ddce5f5314eac7c49830f2dd37e65e1b4c8588d65af`
- rev0 and rev1 are superseded. rev0 is marked NOT APPROVED in REV0_SUPERSEDED.md, which points to rev2.

## Validation

- **Showrunner deterministic check** (validation.json, Scryfall 2026-10-29 18:43 JST): Original PASS, Budget PASS, Max PASS.
- **Janksmith rev2** (2026-10-29 19:22 JST): PASS for every tier.
- **Rules Lawyer:**
  1. T4, 18:58: 0 CRITICAL / 4 MAJOR / 17 MINOR. The release was blocked until the MAJOR issues were fixed, and all four were resolved.
  2. T7, 19:20: **CLEAR_FOR_EDITORIAL**.
  3. T10, 19:38: **CLEAR_FOR_STAGING**. It covered rev2 and editorial rev3, with 9 MINOR findings (F-01 to F-09).
  4. T13, 19:50: delta review of editorial rev4, **CLEAR_FOR_STAGING**. It found 0 CRITICAL and 0 MAJOR, plus MINOR findings N-01 to N-03, all fixed in rev5.
- **Editorial QA chain is complete:** rev3 was reviewed in T10, the rev4 changes in T13, and rev5 is rev4 plus the N-01 and N-03 fixes (and the N-02 metadata fix). I verified that by comparing rev4 and rev5 line by line, and nothing else changed.
- **Game Changers:** Original 3, Budget 0, Max 3 (Bracket 3 allows up to 3). **Didgeridoo tutors:** Original 5, Budget 2 (Reckless Handling, Diabolic Tutor), Max 5.
- **Full validation:** NOT_FULLY_VALIDATED for all three, because of the open items below (no playtest, no rubric, the Thumb ruling).

## Jank scoring

HELD / UNVERIFIED. There is no owner-approved rubric, so no scores appear anywhere in this release. The Janksmith's internal drafts are kept inside comparison.json with public_facing:false, and staging must not show them.

## Substitutions

Reasons and price changes for each swap are in `artifacts/janksmith/rev2/the-lowdown-moo-tube-comparison.json`, under tiers.<tier>.change_records. The Original has no swaps.

**Budget: 28 swaps** (26 new cards, 28 removed; some swaps go to or from basic lands)

1. Demonic Tutor → Diabolic Tutor
2. Vampiric Tutor → Pyre of Heroes
3. Gamble → Reckless Handling
4. Roaming Throne → Universal Automaton
5. Adaptive Automaton → Three Tree Mascot
6. Urza's Incubator → Heraldic Banner
7. Vanquisher's Banner → Read the Bones
8. Panharmonicon → Anaba Bodyguard
9. Molten Echoes → Hurloon Minotaur
10. Lightning Greaves → Hammer of Purphoros
11. Neheb, the Eternal → Gorehorn Minotaurs
12. Glint-Horn Buccaneer → Ox of Agonas
13. Mogis, God of Slaughter → Warmonger
14. Gornog, the Red Reaper → Tahngarth, Talruum Hero
15. Kindred Dominance → Infernal Grasp
16. Vandalblast → Tragic Slip
17. Raise the Draugr → Bake into a Pie
18. Dreamshaper Shaman → Anaba Shaman
19. Ferocity of the Wilds → Hurloon Shaman
20. Bloodstained Mire → Bloodfell Caves
21. Blood Crypt → Temple of Malice
22. Blazemire Verge → Canyon Slough
23. Luxury Suite → Unclaimed Territory
24. Haunted Ridge → Secluded Courtyard
25. Urza's Saga → Mountain
26. Inventors' Fair → Mountain
27. Tainted Peak → Mountain
28. Bojuka Bog → Swamp

**Maximum Jank: 25 swaps** (25 new cards, 23 removed; some swaps go to or from basic lands)

1. Vampiric Tutor → Citanul Flute
2. Adaptive Automaton → Conspiracy
3. Taurean Mauler → Hurloon Minotaur
4. Lightning Greaves → Rings of Brighthearth
5. Vanquisher's Banner → Coat of Arms
6. Descendants' Fury → Kindred Charge
7. Ferocity of the Wilds → Mana Echoes
8. Sign in Blood → Necropotence
9. Soulreaper of Mogis → Ox of Agonas
10. Blasphemous Act → Hecatomb
11. Crippling Fear → Soul Burn
12. Vandalblast → Infernal Grasp
13. Deathbellow Raider → Anaba Bodyguard
14. Oracle of Bones → Anaba Shaman
15. Labyrinth Adversary → Karplusan Minotaur
16. Sandstorm Crasher → Warmonger
17. Felhide Spiritbinder → Cryptic Gateway
18. Labyrinth Raptor → Krark's Thumb
19. Dreamshaper Shaman → Game of Chaos
20. Raise the Draugr → Pyre of Heroes
21. Bojuka Bog → Cavern of Souls
22. Mountain → Reckless Handling
23. Mountain → Unclaimed Territory
24. Swamp → Secluded Courtyard
25. Swamp → Canyon Slough

## Prices (Scryfall USD, from TCGplayer)

| Variant | Official price | Basis | Priced at | Cap |
|---|---|---|---|---|
| Budget | $69.44 | without basic lands, the exact printings listed | 2026-10-29 19:20 JST | under $100 without basics: PASS |
| Original | $429.41 | without basic lands, Andrew's locked printings | 2026-10-29 19:20 JST | none |
| Max | $552.83 | with basic lands, cheapest listed printings | 2026-10-26 22:48 JST | under $1,000 with basics: PASS |

Exceptions:
- Budget: at Scryfall's default printings the same cards came to $102.72 (2026-10-26), which is over the cap. Buyers need to use the listed printings.
- Original: Blood Crypt TRK 278 has no USD price, so it is priced at PECL 262p ($9.04). Adaptive Automaton FDN 723 is priced as a foil.
- Max: not re-priced since 2026-10-26. My live check on 2026-10-29 at 18:43 JST came to $553.60 with basics.

## Editorial (rev5, DRAFT)

- `jobs/JOB-001/editorial/the-lowdown-moo-tube_post_rev5.md` (post): `dc6d3d7bac1368ddf6a2b28f25218233452cb1da9bff76cb71ca5a102d6a1047`
- `jobs/JOB-001/editorial/meta_description_rev5.txt` (meta description): `bc601e727b57ee1aba96ec7fcbd3c7aae820706633642fba6f6deaf6a9d5e6d0`
- `jobs/JOB-001/editorial/social_blurb_rev5.txt` (social blurb): `13cea7b128cc4043c28857d74cec9cd5fcefa0a84d4f6fd4699a60b5e672ac90`
- `jobs/JOB-001/editorial/reader_prompt_rev5.md` (reader feedback form copy): `ab953943d3010b0ca654e814aa3652a6d3cdf3caf712614610c03806b2c09b82`
- `jobs/JOB-001/editorial/editorial_rev5.json` (structured editorial): `fa945d76f7b906f08a8d703045b125daf52a49ff2f09484705a1c505aad58dc3`
- `jobs/JOB-001/editorial/CURRENT.md` (revision pointer): `9ef4f6d1fb6f2d584f93dd58ad947ccc631da4cf1691ae9437b85c8291ab2e61`
- `jobs/JOB-001/editorial/MANIFEST.sha256` (editorial hash list): `41d72b755206bc56e7b772924f5d739ede1b2f225ca1695769803cbd365697b6`
- `jobs/JOB-001/editorial/rev4_to_rev5.diff` (Writer-supplied rev4->rev5 diff): `1272604566e0e1ac46dab957a49dab34d6f81d4038d58700ccc4279a1bc12b16`
- Backstory source: `jobs/JOB-001/origin_story_owner.md`: `ddd2463ce179add584f1803ca4e32c62b34b63253964879682914f453fab8181`
- `sha256sum -c MANIFEST.sha256` passes for all 6 files. House style: more levity, built for fun, and the journey matters as much as the win (owner, 19:22).
- **Quote edits that need Andrew's sign-off.** The origin story quotes Andrew's own words with spelling, capitalization and punctuation cleaned up and paragraph breaks added. It also has two bracketed edits:
  - "[a sound]" replaces "a sounds".
  - "[Minotaurs have rarely gotten the spotlight since the early days of Magic, Sethron aside]" replaces "minotaur's have not received much of a major printing since the early days of magic". He asked for this line to be softened.

## Staging

**BLOCKED.** There is no site, repository or host yet, and the Groundskeeper has not been engaged. See showrunner/PUBLISHING_PLAN.md.

## Unresolved issues

- **ISS-011** (ACCEPTED_OPEN): Reckless Handling (Budget, Max) and Gamble (Max) discard at random and can discard the Didgeridoo they found. Owner swap decision pending; default keep. Disclosed in post.
- **ISS-015** (ACCEPTED_OPEN): Max is at 3/3 Game Changers; any swap must re-check.
- **ISS-017** (ACCEPTED_OPEN): Two-card infinites one card away (e.g. Rings of Brighthearth + Basalt Monolith, Molten Echoes + Changeling Berserker); re-check on any swap.
- **ISS-020** (ACCEPTED_OPEN): Competitive staples (Necropotence, Cavern of Souls, fetch/shock lands) sit beside the 1995 theme; editorial note only.
- **KRARKS-THUMB** (CONDITIONAL): Krark's Thumb with Karplusan Minotaur / Game of Chaos: no explicit official ruling that the ignored coin is neither won nor lost. Labelled conditional in post.
- **PLAYTEST** (UNVERIFIED): No playtest. Bracket turn-speed expectations (Budget ~8+ turns, Max >=6 turns) unverified.
- **JANK-RUBRIC** (OPEN): No approved Jank-O-Meter rubric; scores withheld.
- **F-05** (ACCEPTED_AS_DOCUMENTED): Janksmith rev2 still says the basics exclusion is 'not separately confirmed'; superseded by owner_decisions.budget_cap (confirmed 19:18 JST). Not in publication copy.
- **F-07-RECORD** (OPEN (record only)): Owner may confirm or deny the 2026-10-28 'Approved. Both are great.' message in the Janksmith chat; that approval is not counted either way.

## Closed since the previous manifest

- **EDITORIAL-REV4-QA** (CLOSED): rev4 delta-reviewed (T13, CLEAR_FOR_STAGING); rev5 = rev4 + N-01/N-03 (+N-02 metadata), Showrunner-verified by diff.
- **F-07** (FIXED): REV0_SUPERSEDED.md points to rev2 (sha256 253764ad...); Rules Lawyer T13 note was stale. Owner record question tracked separately as F-07-RECORD.
- **F-09** (FIXED): owner_decisions reconciled in job.json (house style 19:22, timestamps).
- **N-01..N-03** (FIXED): Editorial rev5.

## Owner decisions log (JST)

- 2026-10-28 17:17: Janksmith-reported approval of rev0 ('Approved. Both are great.') (NOT COUNTED (not given in Showrunner chat against a manifest))
- 2026-10-29 18:47: Homelands Anaba cards are part of the theme
- 2026-10-29 18:48: Bracket 3 or lower for both builds
- 2026-10-29 18:59: Remove unsourced deck-name origin note; card lists NOT approved yet; Jank-O-Meter on HOLD until a rubric is approved
- 2026-10-29 19:00: Budget cap changed to under $100
- 2026-10-29 19:11: Owner origin story provided (origin_story_owner.md); ISS-011 unanswered (default keep)
- 2026-10-29 19:18: Budget cap excludes basic lands
- 2026-10-29 19:22: House style: more levity; built for fun; the journey matters as much as the win
- 2026-10-29 19:29: Soften the Minotaur printing line
- 2026-10-29 19:32: Credit 'Andrew (Cute_Balls on Moxfield)'; Cute_Balls is Andrew's account
- n/a: Dingus Staff mention (Not answered; kept as owner's own words (default))

_Generated by the Showrunner 2026-10-29T19:53:43+09:00. The manifest is authoritative; this summary is a readable copy._
