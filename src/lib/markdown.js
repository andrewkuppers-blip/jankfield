import { marked } from 'marked';

const parser = marked.use({ gfm: true, breaks: true });

export function renderMarkdown(markdown) {
  const withoutComments = String(markdown).replace(/<!--[\s\S]*?-->/g, '').trim();
  const html = parser.parse(withoutComments);
  return String(html)
    .replace(/<table>/g, '<div class="table-scroll" tabindex="0"><table>')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<a href="(https?:\/\/[^"]+)">/g, '<a href="$1" rel="noopener noreferrer">');
}
