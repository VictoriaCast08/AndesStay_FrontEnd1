import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { BffApiService } from '../../core/api/bff-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="eyebrow">Dashboard</p>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>

    <div class="panel">
      <div class="panel-head">
        <div>
          <h2>Identidad en el token</h2>
          <p class="muted" style="margin:0">Claims y autoridades leídas por MSAL / BFF</p>
        </div>
        <button type="button" class="btn-primary" (click)="loadBff()" [disabled]="loading">
          {{ loading ? 'Consultando BFF…' : 'Consultar BFF /me' }}
        </button>
      </div>
      <div class="flow">
        <span class="flow-step">Entra ID</span><span>→</span>
        <span class="flow-step">access_token</span><span>→</span>
        <span class="flow-step">MsalInterceptor</span><span>→</span>
        <span class="flow-step">ms-andesstay-bff</span>
      </div>
      @if (bffMe) {
        <pre class="token" style="margin-top:0.75rem">{{ bffMeJson }}</pre>
      }
      @if (bffError) {
        <div class="error-box" role="alert">{{ bffError }}</div>
      }
      @if (localRoles.length) {
        <p class="info-box" style="margin-top:0.75rem">
          Roles desde el id_token (frontend): <strong>{{ localRoles.join(', ') }}</strong>
        </p>
      }
    </div>

    @if (kpiKeys.length) {
      <div class="grid-4">
        @for (key of kpiKeys; track key) {
          <div class="kpi">
            <div class="kpi-value">{{ kpis[key] }}</div>
            <div class="kpi-label">{{ key }}</div>
          </div>
        }
      </div>
    }

    @if (lists.length) {
      <div class="grid-2" style="margin-top:1rem">
        @for (list of lists; track list.title) {
          <div class="panel">
            <h2>{{ list.title }}</h2>
            <ul style="margin:0;padding-left:1.1rem">
              @for (item of list.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </div>
        }
      </div>
    }

    @if (loadingDash) {
      <p class="info-box">Cargando panel según rol…</p>
    }
  `,
})
export class DashboardComponent {
  title = 'Panel de operaciones';
  message = 'Cargando…';
  loading = false;
  loadingDash = false;
  bffMe: unknown = null;
  bffError: string | null = null;
  kpis: Record<string, unknown> = {};
  kpiKeys: string[] = [];
  lists: Array<{ title: string; items: string[] }> = [];

  constructor(
    public auth: AuthService,
    private api: BffApiService,
  ) {
    this.localRoles = auth.roles;
    this.loadDashboard();
  }

  localRoles: string[] = [];

  get bffMeJson(): string {
    return JSON.stringify(this.bffMe, null, 2);
  }

  loadDashboard(): void {
    this.loadingDash = true;
    this.api.dashboard().subscribe({
      next: (data) => {
        this.title = String(data['title'] ?? this.title);
        this.message = String(data['message'] ?? '');
        const kpi = data['kpis'];
        if (kpi && typeof kpi === 'object') {
          this.kpis = kpi as Record<string, unknown>;
          this.kpiKeys = Object.keys(this.kpis);
        }
        this.lists = [];
        const llegadas = data['llegadas'];
        if (Array.isArray(llegadas)) {
          this.lists.push({
            title: 'Llegadas',
            items: llegadas.map((r) => this.fmtStay(r)),
          });
        }
        const salidas = data['salidas'];
        if (Array.isArray(salidas)) {
          this.lists.push({
            title: 'Salidas',
            items: salidas.map((r) => this.fmtStay(r)),
          });
        }
        const activas = data['activas'];
        if (Array.isArray(activas)) {
          this.lists.push({
            title: 'Reservas activas',
            items: activas.map((r) => this.fmtStay(r)),
          });
        }
        this.loadingDash = false;
      },
      error: (err) => {
        if (this.auth.demoMode) {
          this.title = 'Panel de operaciones';
          this.message = 'Vista demo — datos mock del caso AndesStay.';
          this.kpis = {
            ocupacionActiva: 72,
            reservasHoy: 18,
            checkinsPendientes: 5,
            checkoutsHoy: 7,
          };
          this.kpiKeys = Object.keys(this.kpis);
          this.lists = [
            {
              title: 'Llegadas',
              items: [
                'RSV-1042 · Cabaña Ñuble · Camila Rojas · CONFIRMADA',
                'RSV-1041 · Hostal Sur · Diego Paredes · CHECKIN_PENDIENTE',
              ],
            },
            {
              title: 'Salidas',
              items: ['RSV-1038 · Lodge Pucón · Ana Beltrán · EN_ESTADÍA'],
            },
          ];
        } else {
          this.message = 'No se pudo cargar el panel. Verifica el BFF y el token.';
        }
        this.loadingDash = false;
        console.error(err);
      },
    });
  }

  loadBff(): void {
    this.loading = true;
    this.bffError = null;
    this.api.me().subscribe({
      next: (data) => {
        this.bffMe = data;
        this.loading = false;
      },
      error: (err) => {
        if (this.auth.demoMode) {
          this.bffMe = {
            user: this.auth.username,
            roles: this.auth.roles,
            authorities: this.auth.roles.map((r) => `ROLE_${r}`),
            claims: { profile: 'demo-visual', note: 'BFF no conectado o perfil no local' },
            demo: true,
          };
        } else {
          this.bffError =
            err?.error?.reason || err?.message || 'Error al consultar ms-andesstay-bff /me';
        }
        this.loading = false;
      },
    });
  }

  private fmtStay(row: unknown): string {
    const r = row as Record<string, unknown>;
    const parts = [r['id'], r['unidad'], r['huesped'], r['estado']].filter(Boolean);
    return parts.join(' · ');
  }
}
