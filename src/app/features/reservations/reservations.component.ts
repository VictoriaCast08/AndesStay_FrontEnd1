import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { chipClassForEstado } from '../../core/auth/roles';
import { BffApiService } from '../../core/api/bff-api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <p class="eyebrow">Reservas</p>
    <h1>Gestión de reservas</h1>
    <p>
      Flujo de estados del caso:
      <span class="mono">CREADA → CONFIRMADA → CHECKIN_PENDIENTE → EN_ESTADÍA → CHECKOUT</span>
      · también <span class="mono">CANCELADA</span>. No se puede hacer check-in sin confirmar.
    </p>

    <div class="panel" style="margin-bottom: 1rem">
      <div class="panel-head">
        <div>
          <h2>Nueva reserva</h2>
          <p class="muted" style="margin:0">POST · /api/reservations</p>
        </div>
      </div>

      <form (ngSubmit)="create()" style="display:flex;gap:0.6rem;flex-wrap:wrap;align-items:end">
        <label style="display:flex;flex-direction:column;font-size:0.85rem">
          Código
          <input [(ngModel)]="form.code" name="code" placeholder="RSV-1050" required style="padding:0.45rem;border:1px solid #cbd5e1;border-radius:6px;width:110px" />
        </label>
        <label style="display:flex;flex-direction:column;font-size:0.85rem">
          Unidad (ID)
          <select [(ngModel)]="form.unitId" name="unitId" style="padding:0.45rem;border:1px solid #cbd5e1;border-radius:6px">
            @for (u of units; track u.id) {
              <option [ngValue]="u.id">{{ u.code || u.id }} · {{ u.name }}</option>
            }
            @if (!units.length) {
              <option [ngValue]="1">Unidad #1</option>
            }
          </select>
        </label>
        <label style="display:flex;flex-direction:column;font-size:0.85rem">
          Huésped
          <input [(ngModel)]="form.guestName" name="guestName" placeholder="Nombre del huésped" required style="padding:0.45rem;border:1px solid #cbd5e1;border-radius:6px" />
        </label>
        <label style="display:flex;flex-direction:column;font-size:0.85rem">
          Desde
          <input type="date" [(ngModel)]="form.stayFrom" name="stayFrom" required style="padding:0.45rem;border:1px solid #cbd5e1;border-radius:6px" />
        </label>
        <label style="display:flex;flex-direction:column;font-size:0.85rem">
          Hasta
          <input type="date" [(ngModel)]="form.stayTo" name="stayTo" required style="padding:0.45rem;border:1px solid #cbd5e1;border-radius:6px" />
        </label>
        <button type="submit" class="btn-primary" [disabled]="saving">
          {{ saving ? 'Creando…' : '+ Crear reserva' }}
        </button>
      </form>
    </div>

    <div class="panel">
      <div class="panel-head">
        <div>
          <h2>Listado</h2>
          <p class="muted" style="margin:0">BFF · /api/reservations</p>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rows; track row.id || $index) {
                <tr>
                  <td class="mono">{{ row.code || row.id }}</td>
                  <td>{{ unitLabel(row) }}</td>
                  <td>{{ row.guestName || row.huesped }}</td>
                  <td>
                    <span [class]="chip(row.status || row.estado)">{{ row.status || row.estado }}</span>
                  </td>
                  <td class="mono">{{ row.stayFrom || row.desde }}</td>
                  <td class="mono">{{ row.stayTo || row.hasta }}</td>
                  <td style="display:flex;gap:0.35rem;flex-wrap:wrap">
                    @if ((row.status || row.estado) === 'CREADA') {
                      <button type="button" (click)="changeStatus(row, 'CONFIRMADA')" [disabled]="saving" style="padding:0.25rem 0.55rem;border-radius:6px;border:1px solid #0f766e;background:#0f766e;color:#fff;cursor:pointer">
                        Confirmar
                      </button>
                    }
                    @if ((row.status || row.estado) === 'CONFIRMADA') {
                      <button type="button" (click)="changeStatus(row, 'CHECKIN_PENDIENTE')" [disabled]="saving" style="padding:0.25rem 0.55rem;border-radius:6px;border:1px solid #0369a1;background:#0369a1;color:#fff;cursor:pointer">
                        Check-in Pend.
                      </button>
                    }
                    @if ((row.status || row.estado) === 'CONFIRMADA' || (row.status || row.estado) === 'CHECKIN_PENDIENTE') {
                      <button type="button" (click)="changeStatus(row, 'EN_ESTADÍA')" [disabled]="saving" style="padding:0.25rem 0.55rem;border-radius:6px;border:1px solid #15803d;background:#15803d;color:#fff;cursor:pointer">
                        Check-in
                      </button>
                    }
                    @if ((row.status || row.estado) === 'EN_ESTADÍA') {
                      <button type="button" (click)="changeStatus(row, 'CHECKOUT')" [disabled]="saving" style="padding:0.25rem 0.55rem;border-radius:6px;border:1px solid #4338ca;background:#4338ca;color:#fff;cursor:pointer">
                        Checkout
                      </button>
                    }
                    @if ((row.status || row.estado) !== 'CHECKOUT' && (row.status || row.estado) !== 'CANCELADA') {
                      <button type="button" (click)="changeStatus(row, 'CANCELADA')" [disabled]="saving" style="padding:0.25rem 0.55rem;border-radius:6px;border:1px solid #b91c1c;background:#fff;color:#b91c1c;cursor:pointer">
                        Cancelar
                      </button>
                    }
                  </td>
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
  rows: any[] = [];
  units: any[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  form = {
    code: 'RSV-1050',
    unitId: 1,
    guestName: '',
    stayFrom: '2026-12-01',
    stayTo: '2026-12-05',
  };

  constructor(
    private api: BffApiService,
    private auth: AuthService,
  ) {
    this.load();
    this.api.catalog().subscribe({
      next: (u) => (this.units = u ?? []),
    });
  }

  chip(estado: string): string {
    return chipClassForEstado(estado);
  }

  unitLabel(row: any): string {
    if (row.unidad) return row.unidad;
    const found = this.units.find((u) => u.id === row.unitId);
    return found ? `${found.name} (${found.code})` : row.unitId ? `Unidad #${row.unitId}` : '';
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
        this.error = err?.error?.reason || 'No autorizado o BFF no disponible.';
        this.loading = false;
      },
    });
  }

  create(): void {
    if (!this.form.guestName.trim()) return;
    this.saving = true;
    this.error = null;
    this.api.createReservation(this.form).subscribe({
      next: () => {
        this.saving = false;
        this.form = {
          code: `RSV-${1050 + this.rows.length + 1}`,
          unitId: this.form.unitId,
          guestName: '',
          stayFrom: '2026-12-01',
          stayTo: '2026-12-05',
        };
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.error?.reason || 'Error al crear la reserva.';
        this.saving = false;
      },
    });
  }

  changeStatus(row: any, nextStatus: string): void {
    this.saving = true;
    this.error = null;
    this.api.updateReservationStatus(row.id, nextStatus).subscribe({
      next: () => {
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.error?.reason || `No se pudo cambiar a ${nextStatus}.`;
        this.saving = false;
      },
    });
  }
}