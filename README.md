# ATOLL

The AI Tools for Ovarian Lesion Localisation (ATOLL) project — a patient-researcher's living notebook on ovarian cancer and machine learning: history, literature, models & datasets, a journal, community resources, and charities.

The site is a static site built with [Eleventy](https://www.11ty.dev/). All copy and structured content (papers, models, datasets, journal entries, timeline milestones, community links, charities) lives in JSON files under `src/_data/` — edit those, not the HTML, to update content.

## Structure

```
src/
  _data/         content — edit these to change what's on the site
    site.json      nav, site-wide stats, Formspree ID
    papers.json     literature table + paper network graph
    models.json      models cards
    datasets.json    dataset cards
    journal.json     journal entries (reverse chronological)
    eraTimeline.json clinical/scientific history timeline
    milestones.json  personal research milestones (History page)
    community.json   community/advocacy links
    charities.json   charity listings + giving note
    about.json       About page bio + facts
  _includes/
    layouts/base.njk    shared page shell (nav rail, topline, footer, widget)
    partials/widget.njk feedback/ask floating widget
  assets/
    css/           design-system.css (shared components) + design.css (visual flourishes)
    js/            main.js (nav/theme/feedback), lit-graph.js, paper-table.js
  *.njk            one template per page
```

## Local development

```bash
npm install
npm start        # serves the site at http://localhost:8080 with live reload
```

```bash
npm run build     # builds the static site into _site/
```

## Editing content

- **Add a journal entry**: prepend an object to `src/_data/journal.json`.
- **Add a paper**: append an object to `src/_data/papers.json` — it automatically appears in both the paper network graph and the sortable table on the Literature page.
- **Add a personal research milestone**: append an object to `src/_data/milestones.json` — it appears in the "Milestones from my research" timeline on the History page.
- **Update site-wide counts** (e.g. "142 papers logged" on the homepage): edit `src/_data/site.json` → `stats`. These are separate from the itemized lists above so you can track a running total ahead of entering every individual record.

## Feedback form

The floating feedback widget posts to [Formspree](https://formspree.io) (a free, no-backend form service). To wire it up:

1. Create a free Formspree account and form, and copy its form ID (the part after `/f/` in your endpoint URL).
2. Put it in `src/_data/site.json` → `formspreeId`.

Until a `formspreeId` is set, submitting the form just shows a local "thank you" — nothing is actually sent anywhere (a console warning notes this).

The "Ask" tab of the widget is a visual placeholder — it isn't wired up to anything yet.

## Deploying

The build output (`_site/`) is a plain static site — deploy it to Netlify, Vercel, GitHub Pages, or any static host. For GitHub Pages, run `npm run build` and publish the `_site/` directory (e.g. via a GitHub Action or the `gh-pages` package).

## Design mockup

`mockup/` contains the original static HTML mockup this site was built from. It's kept for reference and is not part of the deployed site.
