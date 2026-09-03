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

// ```figure Caption goes here  →  a captioned, monospaced data block.
const defaultFence = md.renderer.rules.fence!;
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const [lang, ...captionWords] = token.info.trim().split(/\s+/);

  if (lang === 'figure' || lang === 'data') {
    const renderEnv = env as RenderEnv;
    renderEnv.figures = (renderEnv.figures ?? 0) + 1;
    const caption = captionWords.join(' ');
    const body = escapeHtml(token.content.replace(/\n+$/, ''));
    return [
      '<figure class="figure">',
      `<pre class="figure-body">${body}</pre>`,
      caption
        ? `<figcaption><span class="figure-label">Fig. ${renderEnv.figures}</span> ${renderInlineMarkdown(caption)}</figcaption>`
        : '',
      '</figure>\n',
    ]
      .filter(Boolean)
      .join('\n');
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
