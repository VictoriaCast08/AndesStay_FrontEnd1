import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus, EventType } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { readRoles } from './roles';
import { apiConfig } from './msal.config';
import { environment } from '../../../environments/environment';

export const DEMO_ROLES = ['Admin', 'Operador', 'Auditor'];

@Injectable({ providedIn: 'root' })
export class AuthService {
  ready = false;
  roles: string[] = [];
  displayName = '';
  username = '';
  demoMode = environment.demo === true;

  constructor(
    private msal: MsalService,
    private broadcast: MsalBroadcastService,
    private router: Router,
  ) {
    if (this.demoMode) {
      this.applyDemoIdentity();
      this.ready = true;
      return;
    }
    this.syncAccount();
    this.broadcast.inProgress$
      .pipe(filter((status) => status === InteractionStatus.None))
      .subscribe(() => this.syncAccount());

    this.msal.instance.addEventCallback((event) => {
      if (
        event.eventType === EventType.LOGIN_SUCCESS ||
        event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
      ) {
        this.syncAccount();
      }
    });
  }

  private applyDemoIdentity(): void {
    this.roles = [...DEMO_ROLES];
    this.displayName = 'Demo AndesStay';
    this.username = 'demo.andesstay@andesstay.local';
  }

  private syncAccount(): void {
    const account =
      this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0] ?? null;
    if (account) {
      this.msal.instance.setActiveAccount(account);
      this.roles = readRoles(account);
      this.displayName = account.name || account.username || 'Usuario';
      this.username = account.username || '';
      this.ready = true;
    } else {
      this.roles = [];
      this.displayName = '';
      this.username = '';
      this.ready = true;
    }
  }

  get isAuthenticated(): boolean {
    if (this.demoMode) {
      const flag = sessionStorage.getItem('andesstay.demo.auth');
      return flag === '1';
    }
    return !!this.msal.instance.getActiveAccount() || this.msal.instance.getAllAccounts().length > 0;
  }

  async login(): Promise<void> {
    if (this.demoMode) {
      this.applyDemoIdentity();
      sessionStorage.setItem('andesstay.demo.auth', '1');
      await this.router.navigate(['/dashboard']);
      return;
    }
    await this.msal.instance.loginRedirect({
      scopes: apiConfig.scopes,
    });
  }

  async logout(): Promise<void> {
    if (this.demoMode) {
      sessionStorage.removeItem('andesstay.demo.auth');
      this.roles = [];
      this.displayName = '';
      this.username = '';
      await this.router.navigate(['/login']);
      return;
    }
    await this.msal.instance.logoutRedirect({
      postLogoutRedirectUri: '/',
    });
  }

  async acquireToken(): Promise<string> {
    if (this.demoMode) {
      return 'demo-token';
    }
    const account =
      this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0];
    if (!account) {
      throw new Error('No hay cuenta activa en MSAL');
    }
    const result = await this.msal.instance.acquireTokenSilent({
      account,
      scopes: apiConfig.scopes,
    });
    return result.accessToken;
  }

  navigateHome(): void {
    void this.router.navigate(['/dashboard']);
  }
}
