import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Supabase errors are translated into operator-friendly recovery copy', async () => {
  const helper = await readFile('src/services/supabaseClient.js', 'utf8');
  assert.match(helper, /export function formatSupabaseError/);
  for (const phrase of [
    'Akun ini belum punya otoritas',
    'Mode aman masih aktif',
    'Refresh halaman',
    'Data serupa sudah pernah tersimpan',
    'Akses data ditolak',
  ]) {
    assert.match(helper, new RegExp(phrase));
  }
});

test('primary operator mutation panels do not display raw database messages directly', async () => {
  const files = [
    'src/components/newsAdmin/ArticleEditor.jsx',
    'src/components/newsAdmin/ArticleWorkflowActions.jsx',
    'src/components/program/ProgramEditor.jsx',
    'src/components/program/ProgramWorkflowPanel.jsx',
    'src/components/agenda/AgendaEditor.jsx',
    'src/components/agenda/AgendaWorkflowPanel.jsx',
    'src/components/finance/FinanceImportPanel.jsx',
    'src/components/finance/FinanceManualEntryPanel.jsx',
    'src/components/finance/FinanceApprovalPanel.jsx',
    'src/components/settings/OperationalRoleAdminPanel.jsx',
    'src/components/settings/ContentProductionReleasePanel.jsx',
    'src/components/settings/ContentPermissionAdminPanel.jsx',
    'src/components/settings/FinancePermissionAdminPanel.jsx',
    'src/hooks/useIntegrationReadiness.js',
    'src/hooks/useProductionReadiness.js',
  ];
  const entries = await Promise.all(files.map(async (file) => [file, await readFile(file, 'utf8')]));
  for (const [file, source] of entries) {
    assert.match(source, /formatSupabaseError/, `${file} should use the shared error formatter`);
    assert.doesNotMatch(source, /`\$?\{?[^`]*error\.message[^`]*`/, `${file} should not template raw error.message`);
  }
});
