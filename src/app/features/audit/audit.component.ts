import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BffApiService } from '../../core/api/bff-api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="eyebrow">Auditoría</p>
    <h1>Timeline de eventos</h1>
    <p>Solo lectura. Roles: Admin y Auditor. Eventos de hospedaje del caso.</p>

    <div class="panel">
      <div class="panel-head">
        <div>
          <h2>Trazabilidad</h2>
          <p class="muted" style="margin:0">Mock del BFF · /api/bff/audit/timeline</p>
        </div>
        <button type="button" class="btn-primary" (click)="load()" [disabled]="loading">
          {{ loading ? 'Cargando…' : 'Recargar' }}
        </button>
      </div>

      @if (error) {
        <div class="error-box" role="alert">{{ error }}</div>
      }

      @if (!events.length && !loading && !error) {
        <div class="empty">Sin eventos. Se requiere rol Admin o Auditor.</div>
      }

      @if (events.length) {
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Reserva</th>
                <th>Tipo</th>
                <th>Actor</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              @for (ev of events; track ev['eventId']) {
                <tr>
                  <td class="mono">{{ ev['eventId'] }}</td>
                  <td class="mono">{{ ev['reserva'] }}</td>
                  <td>{{ ev['tipo'] }}</td>
                  <td>{{ ev['actor'] }}</td>
                  <td class="mono">{{ ev['ts'] }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class AuditComponent {
  events: Array<Record<string, unknown>> = [];
  loading = false;
  error: string | null = null;

  constructor(
    private api: BffApiService,
    private auth: AuthService,
  ) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.api.audit().subscribe({
      next: (events) => {
        this.events = events ?? [];
        this.loading = false;
      },
      error: (err) => {
        if (this.auth.demoMode && !this.events.length) {
          this.events = [
            { eventId: 'EV-9', reserva: 'RSV-1042', tipo: 'RESERVA_CREADA', actor: 'cliente@duoc.cl', ts: '2026-04-10T15:02:00Z' },
            { eventId: 'EV-8', reserva: 'RSV-1041', tipo: 'RESERVA_CONFIRMADA', actor: 'operador@duoc.cl', ts: '2026-04-10T11:40:00Z' },
            { eventId: 'EV-7', reserva: 'RSV-1038', tipo: 'CHECK_IN', actor: 'operador@duoc.cl', ts: '2026-04-09T16:10:00Z' },
            { eventId: 'EV-6', reserva: 'RSV-1029', tipo: 'CHECK_OUT', actor: 'operador@duoc.cl', ts: '2026-04-04T11:05:00Z' },
          ];
          this.error = null;
        } else {
          this.error = err?.error?.reason || 'Auditoría requiere rol Admin o Auditor.';
        }
        this.loading = false;
      },
    });
  }
}
