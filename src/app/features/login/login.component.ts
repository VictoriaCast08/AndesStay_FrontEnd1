import { Component } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { apiConfig } from '../../core/auth/msal.config';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-page">
      <section class="login-card">
        <p class="eyebrow">AndesStay · Azure AD</p>
        <h1>Iniciar sesión</h1>
        @if (auth.demoMode) {
          <p class="info-box">
            <strong>Modo demo visual.</strong> Entra ID aún no está configurado
            (<span class="mono">environment.demo=true</span>). El botón simula una cuenta con roles
            Admin, Operador y Auditor.
          </p>
        } @else {
          <p>
            Acceso corporativo con Microsoft Entra ID. El token Bearer se adjunta a cada llamada al
            BFF de AndesStay.
          </p>
        }
        <button type="button" class="btn-primary" (click)="auth.login()">
          {{ auth.demoMode ? 'Entrar en modo demo' : 'Iniciar sesión con Microsoft' }}
        </button>
        @if (error) {
          <div class="error-box" role="alert">{{ error }}</div>
        }
        <div style="margin-top: 1.25rem">
          <p class="eyebrow">Configuración cargada</p>
          <p class="mono" style="margin: 0">
            tenant={{ tenant }}<br />
            spaClient={{ spaClient }}<br />
            apiScope={{ scope }}<br />
            bff={{ baseUrl }}
          </p>
        </div>
        <div class="flow" style="margin-top: 1rem">
          <span class="flow-step">JWT</span>
          <span>→</span>
          <span class="flow-step">API Gateway</span>
          <span>→</span>
          <span class="flow-step">ms-andesstay-bff</span>
        </div>
      </section>
    </div>
  `,
})
export class LoginComponent {
  error: string | null = null;
  tenant = environment.azure.tenantId;
  spaClient = environment.azure.clientId;
  scope = apiConfig.scopes[0];
  baseUrl = apiConfig.baseUrl;

  constructor(public auth: AuthService) {}
}
