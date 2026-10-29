function fieldAfter(text, label) {
  const pattern = new RegExp(`\\*\\*${label}:\\*\\*\\s*\\n?([\\s\\S]*?)(?=\\n\\*\\*|$)`);
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}

function parseField(raw) {
  const optional = /\(optional\)/i.test(raw);
  let label = raw.replace(/\(optional\)/gi, '').replace(/:\s*$/, '').trim();
  let options = null;
  const wrapped = label.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (wrapped && wrapped[2].includes('/')) {
    label = wrapped[1].replace(/:\s*$/, '').trim();
    options = wrapped[2].split('/').map((option) => option.trim()).filter(Boolean);
  }
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 48);
  let kind = 'text';
  if (options && /version/i.test(label)) kind = 'select';
  else if (options) kind = 'radio';
  else if (/what|story|why|how/i.test(label)) kind = 'textarea';
  return { label, optional, options, slug, kind };
}

export function parseReaderPrompt(markdown) {
  const text = String(markdown).replace(/<!--[\s\S]*?-->/g, '').trim();
  const heading = fieldAfter(text, 'Form heading').split('\n')[0].trim();
  const intro = fieldAfter(text, 'Intro text');
  const button = fieldAfter(text, 'Submit button').split('\n')[0].trim();
  const helper = fieldAfter(text, 'Helper text for field 6');
  const fields = fieldAfter(text, 'Suggested fields')
    .split('\n')
    .map((line) => line.match(/^\d+\.\s+(.*)$/))
    .filter(Boolean)
    .map((match) => parseField(match[1].trim()));

  if (!heading || !intro || !button || fields.length === 0) {
    throw new Error('The reader prompt file is missing the form heading, intro, fields, or submit button.');
  }
  return { heading, intro, button, helper, fields };
}
