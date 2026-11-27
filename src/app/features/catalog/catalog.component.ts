import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BffApiService } from '../../core/api/bff-api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <p class="eyebrow">Catálogo</p>
    <h1>Unidades de hospedaje</h1>
    <p>Habitaciones, cabañas y lodges de la red. Roles: Admin y Operador.</p>

    <div class="panel" style="margin-bottom: 1rem">
      <div class="panel-head">
        <div>
          <h2>Nueva unidad</h2>
          <p class="muted" style="margin:0">POST · /api/catalog/units</p>
        </div>
      </div>

      <form (ngSubmit)="create()" style="display:flex;gap:0.6rem;flex-wrap:wrap;align-items:end">
        <label style="display:flex;flex-direction:column;font-size:0.85rem">
          Código
          <input [(ngModel)]="form.code" name="code" placeholder="U-05" required style="padding:0.45rem;border:1px solid #cbd5e1;border-radius:6px" />
        </label>
        <label style="display:flex;flex-direction:column;font-size:0.85rem">
          Nombre
          <input [(ngModel)]="form.name" name="name" placeholder="Cabaña Patagonia" required style="padding:0.45rem;border:1px solid #cbd5e1;border-radius:6px" />
        </label>
        <label style="display:flex;flex-direction:column;font-size:0.85rem">
          Tipo
          <select [(ngModel)]="form.type" name="type" style="padding:0.45rem;border:1px solid #cbd5e1;border-radius:6px">
            <option value="cabana">cabana</option>
            <option value="habitacion">habitacion</option>
            <option value="lodge">lodge</option>
          </select>
        </label>
        <label style="display:flex;flex-direction:column;font-size:0.85rem">
          Tarifa
          <input type="number" [(ngModel)]="form.rate" name="rate" required style="padding:0.45rem;border:1px solid #cbd5e1;border-radius:6px;width:110px" />
        </label>
        <button type="submit" class="btn-primary" [disabled]="saving">
          {{ saving ? 'Guardando…' : '+ Crear unidad' }}
        </button>
      </form>
    </div>

    <div class="panel">
      <div class="panel-head">
        <div>
          <h2>Inventario</h2>
          <p class="muted" style="margin:0">BFF · /api/catalog/units</p>
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rows; track row.id || $index) {
                <tr>
                  <td class="mono">{{ row.code || row.id }}</td>
                  <td>{{ row.name || row.nombre }}</td>
                  <td>{{ row.type || row.tipo }}</td>
                  <td class="mono">{{ (row.rate ?? row.tarifa) | number }}</td>
                  <td>
                    <span [class]="(row.available ?? row.disponible) ? 'chip chip-checkout' : 'chip chip-cancelada'">
                      {{ (row.available ?? row.disponible) ? 'Sí' : 'No' }}
                    </span>
                  </td>
                  <td>
                    <button type="button" (click)="toggleAvailable(row)" [disabled]="saving" style="padding:0.3rem 0.6rem;border-radius:6px;border:1px solid #cbd5e1;cursor:pointer;background:#fff">
                      {{ (row.available ?? row.disponible) ? 'Desactivar' : 'Activar' }}
                    </button>
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
  rows: any[] = [];
  loading = false;
  saving = false;
  error: string | null = null;
  form = { code: 'U-05', name: '', type: 'cabana', rate: 55000, available: true };

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
        this.error = err?.error?.reason || 'No autorizado o BFF no disponible.';
        this.loading = false;
      },
    });
  }

  create(): void {
    if (!this.form.name.trim()) return;
    this.saving = true;
    this.error = null;
    this.api.createUnit(this.form).subscribe({
      next: () => {
        this.saving = false;
        this.form = { code: `U-0${this.rows.length + 2}`, name: '', type: 'cabana', rate: 55000, available: true };
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.error?.reason || 'Error al crear la unidad.';
        this.saving = false;
      },
    });
  }

  toggleAvailable(row: any): void {
    this.saving = true;
    const updated = {
      code: row.code,
      name: row.name,
      type: row.type,
      rate: row.rate,
      available: !(row.available ?? row.disponible),
    };
    this.api.updateUnit(row.id, updated).subscribe({
      next: () => {
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.error?.reason || 'Error al actualizar disponibilidad.';
        this.saving = false;
      },
    });
  }
}