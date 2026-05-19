import { promises as fs } from 'fs';
import path from 'path';
import pg from 'pg';

const { Pool } = pg;
const dbDir = path.join(process.cwd(), 'data', 'db');
const databaseUrl = process.env.DATABASE_URL;

function isReadOnlyPreview() {
  return String(process.env.READ_ONLY_CMS || '').toLowerCase() === 'true';
}

function hasDatabase() {
  return Boolean(databaseUrl);
}

function getPool() {
  if (!hasDatabase()) return null;
  if (!globalThis.__azureLankaPgPool) {
    globalThis.__azureLankaPgPool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
      max: 1,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return globalThis.__azureLankaPgPool;
}

let tableReadyPromise;
async function ensureTable() {
  const pool = getPool();
  if (!pool) return;
  if (!tableReadyPromise) {
    tableReadyPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS cms_collections (
        name TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  }
  await tableReadyPromise;
}

async function readLocalJson(name, fallback) {
  const filePath = path.join(dbDir, `${name}.json`);
  try {
    const file = await fs.readFile(filePath, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

async function writeLocalJson(name, data) {
  const filePath = path.join(dbDir, `${name}.json`);
  await fs.mkdir(dbDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

export async function readJson(name, fallback = null) {
  if (hasDatabase()) {
    await ensureTable();
    const pool = getPool();
    const existing = await pool.query('SELECT data FROM cms_collections WHERE name = $1 LIMIT 1', [name]);
    if (existing.rows[0]) return existing.rows[0].data;

    const seedData = await readLocalJson(name, fallback);
    await pool.query(
      `INSERT INTO cms_collections (name, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (name) DO NOTHING`,
      [name, JSON.stringify(seedData)]
    );
    return seedData;
  }

  return readLocalJson(name, fallback);
}

export async function writeJson(name, data) {
  // In production/full-test mode a DATABASE_URL means writes must go to Netlify Postgres.
  // READ_ONLY_CMS only protects pure static preview deployments without a database.
  if (isReadOnlyPreview() && !hasDatabase()) return data;

  if (hasDatabase()) {
    await ensureTable();
    const pool = getPool();
    await pool.query(
      `INSERT INTO cms_collections (name, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (name)
       DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
      [name, JSON.stringify(data)]
    );
    return data;
  }

  return writeLocalJson(name, data);
}

export async function readCollection(name) {
  const data = await readJson(name, []);
  return Array.isArray(data) ? data : [];
}

export async function writeCollection(name, records) {
  return writeJson(name, Array.isArray(records) ? records : []);
}

export function makeId(prefix) {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timePart}-${randomPart}`;
}

export function cleanText(value, fallback = '') {
  return String(value ?? fallback).trim().replace(/[<>]/g, '');
}
