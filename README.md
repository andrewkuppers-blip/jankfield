# Jankfield

Jankfield is a small weekly blog for Commander decks that are built to be fun. Each post tells the story of one deck, then shows it three ways: the original list, a Budget Jank list (under $100, not counting basic lands), and a Maximum Jank list.

This is not a deckbuilder, a card search, or a price tracker. Moxfield and Scryfall already do that. The site links out to them.

The first deck is **The Lowdown Moo Tube**, a Sethron, Hurloon General list. Nothing here is published until you approve it.

## Look at the site on your computer

You need [Node.js](https://nodejs.org/) 22. Then, in this folder:

```bash
npm install
npm run dev
```

Open the address the command prints, usually http://localhost:4321. Leave that command running while you read. Stop it with Ctrl+C.

To build the finished pages and look at those instead:

```bash
npm run build
npm run preview
```

`npm run build` also runs the hash check below. If a locked file has been changed, the build stops.

## Add next week's deck

1. Make a new folder under `content/decks/`. Name it with the deck's short name, using lowercase and hyphens. The Lowdown Moo Tube lives in `content/decks/the-lowdown-moo-tube/`.
2. Put that week's release package in the folder. Keep the files exactly as they were handed to you. Do not retype the post or the lists. The folder should contain:
   - `release_manifest.json` and `release_manifest.json.sha256`
   - the editorial files the manifest points at (the post, the short description, the social blurb, the reader form copy, and the editorial JSON)
   - the decklists (the original list, and the Budget and Maximum lists, including the Moxfield import files)
   - the comparison JSON (the file that records the swaps)
3. The folder name should match the slug inside the editorial JSON. For this first deck, both are `the-lowdown-moo-tube`.
4. Run `npm run verify`. It should say `verify passed`.
5. Run `npm run dev` and open the Archive. The new deck should be listed. If its date is the newest, it also becomes the deck on the home page.

The site reads those files when it builds. You do not copy the post into a template.

Card types, Scryfall links, and card images come from a saved lookup in `src/data/scryfall-cards.json`. If a new deck has cards that are not in that file yet, the names still show and still link to a Scryfall search. To fill in images and types, run `npm run cards` while you are online, then build again. That command only reads Scryfall. It does not change the locked deck files.

## The hash check

The first deck was packed with a list of fingerprints (`sha256` hashes) in `release_manifest.json`. `npm run verify` hashes every packed file that is actually in the folder and compares it to that list. If a byte has changed, the command fails and prints both fingerprints.

```bash
npm run verify
```

A few files are named in the manifest but were not included in the package you received (older review notes, for example). Verify mentions them and does not treat that as a failure. `release_summary.md` is in the folder as a readable copy. The manifest does not give it its own hash.

Do not edit a locked file to fix a typo. A changed file needs a new manifest and a new approval. The build runs this check for you, and so does the GitHub check on a pull request.

## The suggestion form

Each deck post ends with a form. The questions come from that deck's reader-prompt file.

Right now the form has nowhere to send answers. If someone presses the button, the page says so, and nothing is sent.

When you want notes to arrive somewhere, pick one address and set it in either place:

- `jankfield.config.json`, in the `feedbackEndpoint` field, or
- an environment variable named `PUBLIC_FEEDBACK_ENDPOINT`

The environment variable wins if both are set. A Formspree address looks like `https://formspree.io/f/xxxxxxxx`. This project does not sign you up for Formspree or any other service. After you change the address, build the site again.

There is an example in `.env.example`. You can also set `PUBLIC_SITE_URL` to your real web address (for example `https://jankfield.com`) so the share tags use that address. Leave it blank until you have one.

## Put it on Vercel later

Do this only when you want the site on the web.

1. Push this repository to GitHub, if it is not there already.
2. In Vercel, choose **Add New… → Project** and import this repository. Vercel recognizes Astro. You do not need a custom build command or output folder.
3. If the form should send notes, add `PUBLIC_FEEDBACK_ENDPOINT` in the project's environment variables. If you have a domain, add `PUBLIC_SITE_URL` too.
4. Deploy. Vercel gives you a `.vercel.app` address. Connecting a domain is a separate step in Vercel's project settings, whenever you want it.

No database, no paid add-on, and no analytics are required. Do not add a tracking script.

## What the pages are

- **Home** explains Jankfield and features the newest deck.
- **A deck post** shows the story, then the three lists side by side on a wide screen (as tabs on a phone), with prices, a Moxfield copy button, and the swaps.
- **Archive** lists every deck post.
- **About** credits Andrew (Cute_Balls on Moxfield) and says what the site is for.

Prices on a post are the ones recorded in that deck's release, with the basis and the date. They are not live prices.
