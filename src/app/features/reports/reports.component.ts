import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BffApiService } from '../../core/api/bff-api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="eyebrow">Reportería</p>
    <h1>KPIs de operación</h1>
    <p>Panel Admin. En el caso completo los datos llegan por Kafka sin bloquear el core.</p>

    <div class="panel">
      <div class="panel-head">
        <div>
          <h2>/api/bff/report/kpis</h2>
          <p class="muted" style="margin:0">Solo rol Admin</p>
        </div>
        <button type="button" class="btn-primary" (click)="load()" [disabled]="loading">
          {{ loading ? 'Cargando…' : 'Cargar KPIs' }}
        </button>
      </div>

      @if (error) {
        <div class="error-box" role="alert">{{ error }}</div>
      }

      @if (data) {
        <pre class="token">{{ json }}</pre>
      }

      @if (!data && !loading && !error) {
        <div class="empty">Aún no se han cargado indicadores.</div>
      }
    </div>
  `,
})
export class ReportsComponent {
  data: Record<string, unknown> | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private api: BffApiService,
    private auth: AuthService,
  ) {}

  get json(): string {
    return JSON.stringify(this.data, null, 2);
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.api.reportKpis().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (err) => {
        if (this.auth.demoMode) {
          this.data = {
            range: 'last24h',
            reservasPorHora: { '10': 2, '11': 3, '12': 1, '15': 4, '18': 2 },
            tiempoCicloHoras: 36,
            ocupacionActivaPct: 72,
            topUnidades: [
              { unidad: 'Cabaña Ñuble', reservas: 6 },
              { unidad: 'Hostal Sur', reservas: 4 },
            ],
            demo: true,
          };
          this.error = null;
        } else {
          this.error = err?.error?.reason || 'Reportería requiere rol Admin.';
        }
        this.loading = false;
      },
    });
  }
}
