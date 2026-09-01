export const ROUTE_PERMISSIONS = Object.freeze({
  '/app/keuangan': 'finance:read',
  '/app/laporan': 'content:read',
  '/app/program': 'content:read',
  '/app/agenda': 'content:read',
  '/app/kabar': 'content:read',
  '/app/tpq': 'tpq:read',
  '/app/tpq/pengampu': 'tpq:read',
  '/app/tpq/app': 'tpq:read',
  '/app/donasi': 'finance:read',
  '/app/inventaris': 'content:read',
  '/app/dokumen': 'content:read',
  '/app/pengaturan': 'users:read',
});

export function hasPermission(permissions, requiredPermission) {
  if (!requiredPermission) return true;
  return Array.isArray(permissions) && permissions.includes(requiredPermission);
}
