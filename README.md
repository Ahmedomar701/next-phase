# next-phase

A text-only writing site. One markdown file in `content/` becomes one page, and
the index, RSS feed, sitemap, entry numbering, word counts, and prev/next links
all follow from the files that exist.

No images, no analytics, no CSS framework, no client-side rendering. The only
JavaScript that ships to the reader is a light/dark theme toggle.

Live at **<https://ahmedomar701.github.io/next-phase/>**.

```
content/            one markdown file per entry — the only thing you edit day to day
app/                pages: index, /writing/[slug], /colophon, feed.xml, sitemap
lib/site.ts         name, tagline, description, site URL, footer links
lib/markdown.ts     markdown → HTML: footnotes, anchors, figures, bar plots
lib/posts.ts        frontmatter parsing, entry serials, word counts
app/globals.css     the entire design system
scripts/            new-post scaffolder, publish step
```

The built site is also committed at the repository root — `index.html`, `writing/`,
`colophon/`, `_next/`, `feed.xml` and friends. Those are generated files; see
[Publishing](#publishing) before touching them.

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

## Publishing

GitHub Pages serves this repo in "deploy from a branch" mode, which publishes
committed files from `main` and cannot run a build. So the built site is
committed alongside the source:

```bash
npm run publish:site    # builds with the /next-phase prefix, syncs out/ to the root
git add -A
git commit -m "Publish: some entry"
git push
```

Pushing to `main` is the deploy. GitHub's own `pages-build-deployment` picks up
the commit and the site is live within a minute or so.

Two supporting pieces make this safe:

- `.pages-manifest` records which root paths came from the last build, so the
  next publish clears exactly those and nothing else. The publish script also
  refuses to overwrite any source path.
- `public/.nojekyll` stops Pages from hiding `_next/`, which Jekyll would
  otherwise skip for starting with an underscore.

`.github/workflows/publish.yml` runs the same command on any push to `main`
that touches `content/`, `app/`, `lib/`, or `public/`, and commits the result.
That covers edits made in the GitHub web UI, where no local build has run.

### If you'd rather not commit build output

Set *Settings → Pages → Source* to **GitHub Actions**, then delete the
committed output (everything in `.pages-manifest`), `.pages-manifest` itself,
and `publish.yml`, and replace it with a workflow that runs
`actions/configure-pages`, `npm run build`, `actions/upload-pages-artifact` on
`./out`, and `actions/deploy-pages`. That keeps the repo to source only. It
needs the one-time settings change because a workflow's `GITHUB_TOKEN` cannot
switch the Pages build type itself.

**Vercel / Netlify / Cloudflare Pages** also work with no configuration: import
the repo, set `NEXT_PUBLIC_SITE_URL` to the final domain, and leave
`NEXT_PUBLIC_BASE_PATH` unset.

Site-wide text (name, tagline, footer links, words-per-minute) lives in
`lib/site.ts`.
