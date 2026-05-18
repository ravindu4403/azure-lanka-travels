import { promises as fs } from 'fs';
import path from 'path';

// Vercel preview version: no external database and no file-write persistence.
// Public pages read curated starter JSON content. Form submissions return success
// during preview, but real persistence should be connected later to a DB/email/CRM.
const dbDir = path.join(process.cwd(), 'data', 'db');

function isReadOnlyPreview() {
  return process.env.VERCEL === '1' || String(process.env.READ_ONLY_CMS || '').toLowerCase() === 'true';
}

export async function readCollection(name) {
  const filePath = path.join(dbDir, `${name}.json`);
  try {
    const file = await fs.readFile(filePath, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

export async function writeCollection(name, records) {
  if (isReadOnlyPreview()) {
    return records;
  }

  const filePath = path.join(dbDir, `${name}.json`);
  await fs.mkdir(dbDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(records, null, 2), 'utf8');
  return records;
}

export function makeId(prefix) {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timePart}-${randomPart}`;
}

export function cleanText(value, fallback = '') {
  return String(value ?? fallback).trim().replace(/[<>]/g, '');
}
