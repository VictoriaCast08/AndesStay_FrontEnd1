import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

/** Sustituye a MsalGuard cuando environment.demo=true o ya hay sesión. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const msal = inject(MsalService);
  const router = inject(Router);

  if (environment.demo === true) {
    return auth.isAuthenticated ? true : router.createUrlTree(['/login']);
  }

  const account =
    msal.instance.getActiveAccount() ?? msal.instance.getAllAccounts()[0] ?? null;
  if (account) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
