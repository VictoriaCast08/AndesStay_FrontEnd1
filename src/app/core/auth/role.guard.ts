import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { hasAnyRole, readRoles } from './roles';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

/**
 * Guarda por roles AndesStay (Admin, Operador, Cliente, Auditor).
 * Usa route.data['roles']. Si no hay sesión, redirige a MSAL.
 */
export const roleGuard: CanActivateFn = (route) => {
  const msal = inject(MsalService);
  const router = inject(Router);
  const authService = inject(AuthService);
  const allowed = (route.data?.['roles'] as string[] | undefined) ?? [];

  let roles: string[] = [];
  if (environment.demo === true) {
    if (!authService.isAuthenticated) {
      return router.createUrlTree(['/login']);
    }
    roles = authService.roles;
  } else {
    const account =
      msal.instance.getActiveAccount() ?? msal.instance.getAllAccounts()[0] ?? null;
    if (!account) {
      return router.createUrlTree(['/login']);
    }
    roles = readRoles(account);
  }

  if (!allowed.length || hasAnyRole(roles, allowed)) {
    return true;
  }
  return router.createUrlTree(['/unauthorized'], {
    queryParams: { required: allowed.join(',') },
  });
};
