import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('operator SOP covers the main dashboard workflows and privacy boundary', async () => {
  const sop = await read('docs/OPERATOR_DASHBOARD_SOP.md');
  for (const section of [
    'Kabar Masjid / Artikel',
    'Program & Kegiatan',
    'Agenda & Kalender',
    'Keuangan DKM / TPQ - Import Excel',
    'Keuangan DKM / TPQ - Input Manual',
    'Pengaturan Role dan Akses',
    'Peta Integrasi dan Gate Production',
  ]) assert.match(sop, new RegExp(section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(sop, /Data santri, wali, presensi, nilai, raport, dan pembayaran individu tidak boleh tampil di website publik/);
  assert.match(sop, /Hapus akses akun.*suspend/s);
});
