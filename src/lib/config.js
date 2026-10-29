import fs from 'node:fs';
import path from 'node:path';
import { repoRoot } from './paths.js';

function asHttpUrl(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  try {
    const url = new URL(text);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    return url.toString();
  } catch {
    return '';
  }
}

export function feedbackEndpoint() {
  const fromEnv = asHttpUrl(process.env.PUBLIC_FEEDBACK_ENDPOINT || process.env.FEEDBACK_ENDPOINT || '');
  if (fromEnv) return fromEnv;
  const configPath = path.join(repoRoot, 'jankfield.config.json');
  if (!fs.existsSync(configPath)) return '';
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return asHttpUrl(config.feedbackEndpoint || '');
  } catch {
    return '';
  }
}

export function siteUrl() {
  return (process.env.PUBLIC_SITE_URL || '').trim().replace(/\/$/, '');
}
