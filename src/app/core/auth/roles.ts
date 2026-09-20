import type { AccountInfo } from '@azure/msal-browser';

export const ANDRES_ROLES = ['Admin', 'Operador', 'Cliente', 'Auditor'] as const;
export type AndesRole = (typeof ANDRES_ROLES)[number];

/** Roles por defecto que el caso asigna en Entra ID App Roles */
export const DEFAULT_ROUTE_ROLES: Record<string, AndesRole[]> = {
  '/dashboard': ['Admin', 'Operador', 'Cliente', 'Auditor'],
  '/reservations': ['Admin', 'Operador', 'Cliente'],
  '/catalog': ['Admin', 'Operador'],
  '/reports': ['Admin'],
  '/audit': ['Admin', 'Auditor'],
};

export function readRoles(account: AccountInfo | null | undefined): string[] {
  if (!account) {
    return [];
  }
  const claims = account.idTokenClaims as Record<string, unknown> | null | undefined;
  if (!claims) {
    return [];
  }
  const sources: unknown[] = [claims['roles'], claims['groups'], claims['extension_Roles']];
  const roles: string[] = [];
  for (const source of sources) {
    if (Array.isArray(source)) {
      for (const item of source) {
        if (typeof item === 'string' && item.trim()) {
          roles.push(item.trim());
        }
      }
    } else if (typeof source === 'string' && source.trim()) {
      roles
        .push(
          ...source
            .split(/[,\s]+/)
            .map((r) => r.trim())
            .filter(Boolean),
        );
    }
  }
  return [...new Set(roles)];
}

export function hasAnyRole(roles: string[], allowed: string[]): boolean {
  if (!allowed.length) {
    return true;
  }
  return allowed.some((r) => roles.includes(r));
}

export function chipClassForEstado(estado: string): string {
  const map: Record<string, string> = {
    CREADA: 'chip-creada',
    CONFIRMADA: 'chip-confirmada',
    CHECKIN_PENDIENTE: 'chip-checkin',
    EN_ESTADÍA: 'chip-estadia',
    'EN_ESTADIA': 'chip-estadia',
    CHECKOUT: 'chip-checkout',
    CANCELADA: 'chip-cancelada',
  };
  return `chip ${map[estado] ?? 'chip-creada'}`;
}
