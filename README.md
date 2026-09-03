# next-phase

A text-only writing site. One markdown file in `content/` becomes one page, and
the index, RSS feed, sitemap, entry numbering, word counts, and prev/next links
all follow from the files that exist.

No images, no analytics, no CSS framework, no client-side rendering. The only
JavaScript that ships to the reader is a light/dark theme toggle.

```
content/            one markdown file per entry — the only thing you edit day to day
app/                pages: index, /writing/[slug], /colophon, feed.xml, sitemap
lib/site.ts         name, tagline, description, site URL, footer links
lib/markdown.ts     markdown → HTML: footnotes, anchors, figures, bar plots
lib/posts.ts        frontmatter parsing, entry serials, word counts
app/globals.css     the entire design system
```

## Publishing a new entry

```bash
npm run new -- "The Title Of The Entry"   # writes content/the-title-of-the-entry.md
```

Then paste the write-up into that file below the frontmatter block. Or write
the file by hand — nothing is magic about the generator:

```markdown
---
title: The Autonomous Era
date: 2026-02-20
abstract: >-
  One or two sentences. Appears on the index, in the RSS feed, and above the
  entry itself.
tags: [autonomy, agents]
draft: false
---

Opening paragraph.

## First section
```

| Field      | Required | Notes                                                        |
| ---------- | -------- | ------------------------------------------------------------ |
| `title`    | yes      | Page title and index entry                                   |
| `date`     | yes      | `YYYY-MM-DD`; sets order and the entry serial                |
| `abstract` | no       | Recommended; shown on index, in metadata, and in the feed    |
| `tags`     | no       | Listed as "subjects" in the entry frontmatter block          |
| `updated`  | no       | Renders a "revised" line                                     |
| `draft`    | no       | `true` hides the entry from the built site (visible in dev)  |

Entry serials are assigned oldest-first, so `001` stays `001` forever.

## Writing conventions

Standard markdown, plus three things.

**Footnotes** collect under a "Notes" heading at the foot of the entry:

```markdown
Reliability is measured in the residual.[^1]

[^1]: A move from 95% to 99% is a five-fold reduction in failures.
```

**Figures** are monospace blocks with a numbered caption. Use them for tables,
derivations, or anything that wants a fixed grid:

````markdown
```figure Reliability target, expressed as permitted annual downtime.
            availability    downtime / year
today            99.95%     ≈ 4 h 23 min
target         99.9999%     ≈ 32 s
```
````

**Bar plots** draw real bars in CSS. Rows are `label | number | printed value`,
and an optional first line starting with `#` is a header:

````markdown
```bars Weekly platform stability. Bars are the residual error rate.
# month · stability | residual error rate
2025-08   95.00% | 5.00 | 5.00 %
2025-12   99.12% | 0.88 | 0.88 %
```
````

Bars are scaled against the largest value in the block. Labels keep their
whitespace, so pad them to line up.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000, drafts visible
npm run build      # static site into ./out
npm run typecheck
```

## Deploying

`npm run build` writes a plain static site to `out/`, so anything that serves
files will do.

- **GitHub Pages** — `.github/workflows/deploy.yml` builds and publishes on
  every push to `main`. Set *Settings → Pages → Source* to **GitHub Actions**
  once; the workflow handles the `/next-phase` path prefix automatically.
- **Vercel / Netlify / Cloudflare Pages** — import the repo, no configuration
  needed. Set `NEXT_PUBLIC_SITE_URL` to the final domain so the feed and
  canonical URLs are absolute, and leave `NEXT_PUBLIC_BASE_PATH` unset.

Site-wide text (name, tagline, footer links, words-per-minute) lives in
`lib/site.ts`.
