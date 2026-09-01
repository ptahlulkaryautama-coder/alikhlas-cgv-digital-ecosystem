import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { agendaRepository, enrichAgendaRecord, isPublicAgenda } from '../src/repositories/agendaRepository.js';
import { isPublicKabar, kabarRepository } from '../src/repositories/kabarRepository.js';
import { isPublicProgram, programRepository } from '../src/repositories/programRepository.js';
import { tpqRepository } from '../src/repositories/tpqRepository.js';
import { getPublicFinanceSummary } from '../src/services/api.js';
import { publicFinanceSummary } from '../src/data/siteContent.js';

test('Program public and admin projections share normalized repository records', async () => {
  const all = await programRepository.getAll({ dataSourceMode: 'local' });
  const publicRecords = await programRepository.getPublic({ dataSourceMode: 'local' });
  assert.deepEqual(publicRecords, all.filter(isPublicProgram));
  assert.ok(all.every((record) => record.id && record.nama && record.status && record.visibility));
  assert.equal(isPublicProgram({ status: 'Draft', visibility: 'Publik' }), false);
  assert.equal(isPublicProgram({ status: 'Siap publik', visibility: 'Internal' }), false);
});

test('Agenda public and admin projections share normalized repository records', async () => {
  const all = await agendaRepository.getAll({ dataSourceMode: 'local' });
  const publicRecords = await agendaRepository.getPublic({ dataSourceMode: 'local' });
  assert.deepEqual(publicRecords, all.filter(isPublicAgenda));
  assert.ok(all.every((record) => /^\d{4}-\d{2}-\d{2}$/.test(record.isoDate)));
});

test('past Agenda classification does not infer a completed status', () => {
  const record = enrichAgendaRecord({
    id: 'past', nama: 'Agenda lama', tanggal: '2020-01-01',
    status: 'Siap publik', visibility: 'Publik',
  }, 0, new Date('2026-08-01T00:00:00Z'));
  assert.equal(record.temporalGroup, 'archive');
  assert.equal(record.status, 'Siap publik');
  assert.notEqual(record.status, 'Terlaksana');
});

test('Kabar repository enforces public editorial filtering', () => {
  assert.ok(kabarRepository.getPublic().every(isPublicKabar));
  for (const record of [
    { status: 'Draft', visibility: 'Publik' },
    { status: 'Dalam peninjauan', visibility: 'Publik' },
    { status: 'Siap publik', visibility: 'Internal' },
    { status: 'Siap publik', visibility: 'Privat' },
  ]) assert.equal(isPublicKabar(record), false);
});

test('TPQ public projection contains no prohibited fields', () => {
  const serialized = JSON.stringify(tpqRepository.getPublic()).toLowerCase();
  for (const forbidden of [
    'studentname', 'guardian', 'phone', 'address', 'grade', 'evaluationnote',
    'attendance', 'payment', 'spp', 'reportcard', 'honorarium', 'photograph',
    'pengajar',
  ]) assert.equal(serialized.includes(forbidden.toLowerCase()), false, `projection contains ${forbidden}`);
  assert.deepEqual(tpqRepository.getPublic().aggregates, {});
  assert.equal(tpqRepository.getPublic().aggregateStatus.verified, false);
});

async function listFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const full = path.join(root, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  }))).flat();
}

test('public components do not import internal TPQ data', async () => {
  const files = (await listFiles('src')).filter((file) => /(?:pages[\\/](?:Home|Public)|components[\\/](?:website|news))/.test(file) && /\.jsx$/.test(file));
  const source = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
  assert.equal(/(?:tpqData|tpqMockData)\.js/.test(source), false);
});

test('finance read service returns the frozen runtime object unchanged', async () => {
  const result = await getPublicFinanceSummary(publicFinanceSummary);
  assert.strictEqual(result.data, publicFinanceSummary);
  assert.equal(result.source, 'fallback');
});
