export function formatPricedAt(iso) {
  if (!iso || typeof iso !== 'string') return '';
  const match = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})/);
  if (!match) return iso;
  const zone = iso.endsWith('+09:00') || iso.includes('+09:00') ? 'JST' : '';
  return zone ? `${match[1]} ${match[2]} ${zone}` : `${match[1]} ${match[2]}`;
}

export function formatMoney(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '';
  return `$${amount.toFixed(2)}`;
}

export function formatPostDate(iso) {
  if (!iso) return '';
  const match = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return String(iso);
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

const COLOR_NAMES = {
  W: 'White',
  U: 'Blue',
  B: 'Black',
  R: 'Red',
  G: 'Green',
};

export function colorNames(identity) {
  if (!Array.isArray(identity) || identity.length === 0) return '';
  return identity.map((code) => COLOR_NAMES[code] || code).join(' / ');
}

export function socialBlurb(blurb, url) {
  let text = String(blurb || '').replace(/\r\n/g, '\n').trim();
  if (!text) return '';
  if (url) text = text.replaceAll('[link]', url);
  else text = text.replace(/\n*\[link\]\s*$/g, '').trim();
  return text.replace(/\s*\n\s*/g, ' ').trim();
}
