import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BffApiService, UnitRow } from '../../core/api/bff-api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="eyebrow">Catálogo</p>
    <h1>Unidades de hospedaje</h1>
    <p>Habitaciones, cabañas y lodges de la red. Roles: Admin y Operador.</p>

    <div class="panel">
      <div class="panel-head">
        <div>
          <h2>Inventario</h2>
          <p class="muted" style="margin:0">Mock del BFF · /api/bff/catalog/units</p>
        </div>
        <button type="button" class="btn-primary" (click)="load()" [disabled]="loading">
          {{ loading ? 'Cargando…' : 'Recargar' }}
        </button>
      </div>

      @if (error) {
        <div class="error-box" role="alert">{{ error }}</div>
      }

      @if (!rows.length && !loading && !error) {
        <div class="empty">Sin unidades. Este módulo requiere rol Admin u Operador.</div>
      }

      @if (rows.length) {
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Tarifa</th>
                <th>Disponible</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rows; track row.id) {
                <tr>
                  <td class="mono">{{ row.id }}</td>
                  <td>{{ row.nombre }}</td>
                  <td>{{ row.tipo }}</td>
                  <td class="mono">{{ row.tarifa | number }}</td>
                  <td>
                    <span [class]="row.disponible ? 'chip chip-checkout' : 'chip chip-cancelada'">
                      {{ row.disponible ? 'Sí' : 'No' }}
                    </span>
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
export class CatalogComponent {
  rows: UnitRow[] = [];
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
    this.api.catalog().subscribe({
      next: (rows) => {
        this.rows = rows ?? [];
        this.loading = false;
      },
      error: (err) => {
        if (this.auth.demoMode && !this.rows.length) {
          this.rows = [
            { id: 'U-01', nombre: 'Cabaña Ñuble', tipo: 'cabaña', tarifa: 62000, disponible: true },
            { id: 'U-02', nombre: 'Hostal Sur', tipo: 'habitación', tarifa: 28000, disponible: true },
            { id: 'U-03', nombre: 'Lodge Pucón', tipo: 'lodge', tarifa: 95000, disponible: false },
            { id: 'U-04', nombre: 'Hostal Valdivia', tipo: 'habitación', tarifa: 31000, disponible: true },
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
