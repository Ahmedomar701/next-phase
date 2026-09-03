import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';

export type Heading = { id: string; text: string };

type RenderEnv = {
  headings?: Heading[];
  usedSlugs?: Set<string>;
  figures?: number;
};

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[`*_~[\]()]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 64) || 'section'
  );
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Separate instance so captions/abstracts can be rendered without re-entering
// the main parser mid-render.
const inlineMd = new MarkdownIt({ html: false, linkify: true, typographer: true });

export function renderInlineMarkdown(input: string): string {
  return inlineMd.renderInline(input);
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
}).use(footnote);

// Stable ids on every heading, plus a table of contents for the section rail.
md.core.ruler.push('anchors_and_toc', (state) => {
  const env = state.env as RenderEnv;
  const headings: Heading[] = (env.headings ??= []);
  const used: Set<string> = (env.usedSlugs ??= new Set());
  const tokens = state.tokens;

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token.type !== 'heading_open') continue;

    const inline = tokens[i + 1];
    const text = inline?.content ?? '';
    const base = slugify(text);
    let id = base;
    let n = 2;
    while (used.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    used.add(id);
    token.attrSet('id', id);

    if (token.tag === 'h2') headings.push({ id, text });
  }
});

function wrapFigure(body: string, caption: string, n: number): string {
  return [
    '<figure class="figure">',
    body,
    caption
      ? `<figcaption><span class="figure-label">Fig. ${n}</span> ${renderInlineMarkdown(caption)}</figcaption>`
      : '',
    '</figure>\n',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * ```bars Caption
 * # month      | error rate
 * 2025-08 95%  | 5.00 | 5.00 %
 * ```
 * Rows are `label | number | printed value`. Bars are drawn in CSS so they
 * stay crisp instead of relying on block glyphs to tile.
 */
function renderBars(source: string): string {
  const lines = source.split('\n').filter((line) => line.trim() !== '');
  const header = lines[0]?.startsWith('#')
    ? lines
        .shift()!
        .slice(1)
        .split('|')
        .map((cell) => cell.trim())
    : null;

  const rows = lines.map((line) => {
    const [label = '', rawValue = '', display] = line.split('|').map((cell) => cell.trim());
    const value = Number.parseFloat(rawValue.replace(/[^0-9.eE+-]/g, ''));
    return {
      label,
      value: Number.isFinite(value) ? Math.abs(value) : 0,
      display: display ?? rawValue,
    };
  });

  const max = Math.max(...rows.map((row) => row.value), 0) || 1;

  const head = header
    ? `<thead><tr><th scope="col">${escapeHtml(header[0] ?? '')}</th><th scope="col">${escapeHtml(
        header[1] ?? '',
      )}</th><th scope="col">${escapeHtml(header[2] ?? '')}</th></tr></thead>`
    : '';

  const body = rows
    .map(
      (row) =>
        `<tr><th scope="row">${escapeHtml(row.label)}</th>` +
        `<td class="barplot-track"><span class="barplot-bar" style="width:${(
          (row.value / max) *
          100
        ).toFixed(3)}%"></span></td>` +
        `<td class="barplot-value">${escapeHtml(row.display)}</td></tr>`,
    )
    .join('');

  return `<div class="figure-frame"><table class="barplot">${head}<tbody>${body}</tbody></table></div>`;
}

// ```figure Caption  →  captioned monospace block. ```bars Caption  →  bar plot.
const defaultFence = md.renderer.rules.fence!;
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const [lang, ...captionWords] = token.info.trim().split(/\s+/);
  const isFigure = lang === 'figure' || lang === 'data';
  const isBars = lang === 'bars';

  if (isFigure || isBars) {
    const renderEnv = env as RenderEnv;
    renderEnv.figures = (renderEnv.figures ?? 0) + 1;
    const content = token.content.replace(/\n+$/, '');
    const body = isBars
      ? renderBars(content)
      : `<pre class="figure-body figure-frame">${escapeHtml(content)}</pre>`;
    return wrapFigure(body, captionWords.join(' '), renderEnv.figures);
  }

  return defaultFence(tokens, idx, options, env, self);
};

// Outbound links open in a new tab and get a small marker.
const defaultLinkOpen =
  md.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = String(tokens[idx].attrGet('href') ?? '');
  if (/^https?:\/\//.test(href)) {
    tokens[idx].attrSet('target', '_blank');
    tokens[idx].attrSet('rel', 'noopener noreferrer');
    tokens[idx].attrJoin('class', 'external');
  }
  return defaultLinkOpen(tokens, idx, options, env, self);
};

export function renderMarkdown(source: string): { html: string; headings: Heading[] } {
  const env: RenderEnv = {};
  const html = md.render(source, env);
  return { html, headings: env.headings ?? [] };
}

export function countWords(source: string): number {
  const plain = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}\[\^[^\]]+\]:/gm, ' ')
    .replace(/[#>*_~|-]/g, ' ');
  const words = plain.match(/[\p{L}\p{N}][\p{L}\p{N}'’./-]*/gu);
  return words ? words.length : 0;
}
