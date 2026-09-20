import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { chipClassForEstado } from '../../core/auth/roles';
import { BffApiService, ReservationRow } from '../../core/api/bff-api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="eyebrow">Reservas</p>
    <h1>Gestión de reservas</h1>
    <p>
      Flujo de estados del caso:
      <span class="mono">CREADA → CONFIRMADA → CHECKIN_PENDIENTE → EN_ESTADÍA → CHECKOUT</span>
      · también <span class="mono">CANCELADA</span>. No se puede hacer check-in sin confirmar.
    </p>

    <div class="panel">
      <div class="panel-head">
        <div>
          <h2>Listado</h2>
          <p class="muted" style="margin:0">Mock del BFF · /api/bff/reservations</p>
        </div>
        <button type="button" class="btn-primary" (click)="load()" [disabled]="loading">
          {{ loading ? 'Cargando…' : 'Recargar' }}
        </button>
      </div>

      @if (error) {
        <div class="error-box" role="alert">{{ error }}</div>
      }

      @if (!rows.length && !loading && !error) {
        <div class="empty">No hay reservas para mostrar. Recarga o revisa los roles del token.</div>
      }

      @if (rows.length) {
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Unidad</th>
                <th>Huésped</th>
                <th>Estado</th>
                <th>Desde</th>
                <th>Hasta</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rows; track row.id) {
                <tr>
                  <td class="mono">{{ row.id }}</td>
                  <td>{{ row.unidad }}</td>
                  <td>{{ row.huesped }}</td>
                  <td>
                    <span [class]="chip(row.estado)">{{ row.estado }}</span>
                  </td>
                  <td class="mono">{{ row.desde }}</td>
                  <td class="mono">{{ row.hasta }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class ReservationsComponent {
  rows: ReservationRow[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private api: BffApiService,
    private auth: AuthService,
  ) {
    this.load();
  }

  chip(estado: string): string {
    return chipClassForEstado(estado);
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.api.reservations().subscribe({
      next: (rows) => {
        this.rows = rows ?? [];
        this.loading = false;
      },
      error: (err) => {
        if (this.auth.demoMode && !this.rows.length) {
          this.rows = [
            { id: 'RSV-1042', unidad: 'Cabaña Ñuble', huesped: 'Camila Rojas', estado: 'CREADA', desde: '2026-04-12', hasta: '2026-04-15' },
            { id: 'RSV-1041', unidad: 'Hostal Sur', huesped: 'Diego Paredes', estado: 'CONFIRMADA', desde: '2026-04-11', hasta: '2026-04-13' },
            { id: 'RSV-1038', unidad: 'Lodge Pucón', huesped: 'Ana Beltrán', estado: 'EN_ESTADÍA', desde: '2026-04-09', hasta: '2026-04-12' },
            { id: 'RSV-1029', unidad: 'Hostal Valdivia', huesped: 'Luis Soto', estado: 'CHECKOUT', desde: '2026-04-01', hasta: '2026-04-04' },
            { id: 'RSV-1021', unidad: 'Cabaña Ñuble', huesped: 'María Fuentes', estado: 'CHECKIN_PENDIENTE', desde: '2026-04-10', hasta: '2026-04-14' },
            { id: 'RSV-1015', unidad: 'Hostal Sur', huesped: 'Pedro Lagos', estado: 'CANCELADA', desde: '2026-04-05', hasta: '2026-04-07' },
          ];
          this.error = null;
        } else {
          this.error = err?.error?.reason || 'No autorizado o BFF no disponible.';
        }
        this.loading = false;
      },
    });
  }
}
