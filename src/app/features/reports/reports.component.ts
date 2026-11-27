import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BffApiService } from '../../core/api/bff-api.service';

interface HourBar {
  hour: string;
  count: number;
  heightPct: number;
}

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
          <h2>Métricas operativas ({{ rangeLabel }})</h2>
          <p class="muted" style="margin:0">BFF · /api/report/kpis · Solo rol Admin</p>
        </div>
        <button type="button" class="btn-primary" (click)="load()" [disabled]="loading">
          {{ loading ? 'Actualizando…' : 'Recargar' }}
        </button>
      </div>

      @if (error) {
        <div class="error-box" role="alert">{{ error }}</div>
      }

      @if (kpis) {
        <!-- Tarjetas KPI superiores -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1.5rem">
          <div style="padding:1rem 1.25rem;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc">
            <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;letter-spacing:0.04em">Ocupación Activa</div>
            <div style="font-size:2rem;font-weight:700;color:#0f766e;margin:0.25rem 0">{{ ocupacionPct }}%</div>
            <div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden">
              <div [style.width.%]="ocupacionPct" style="height:100%;background:#0f766e;border-radius:999px;transition:width 0.4s ease"></div>
            </div>
          </div>

          <div style="padding:1rem 1.25rem;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc">
            <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;letter-spacing:0.04em">Tiempo de Ciclo</div>
            <div style="font-size:2rem;font-weight:700;color:#0369a1;margin:0.25rem 0">{{ tiempoCiclo }} <span style="font-size:1rem;font-weight:500">hrs</span></div>
            <div style="font-size:0.82rem;color:#64748b">Promedio desde reserva a checkout</div>
          </div>

          <div style="padding:1rem 1.25rem;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc">
            <div style="font-size:0.8rem;color:#64748b;text-transform:uppercase;letter-spacing:0.04em">Total Reservas (Periodo)</div>
            <div style="font-size:2rem;font-weight:700;color:#1e293b;margin:0.25rem 0">{{ totalReservas }}</div>
            <div style="font-size:0.82rem;color:#64748b">Ventana: <span class="mono">{{ rangeLabel }}</span></div>
          </div>
        </div>

        <!-- Gráfico de barras: Reservas por hora + Anillo de ocupación -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem;align-items:stretch">
          <div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:12px;background:#fff">
            <h3 style="margin:0 0 0.25rem 0;font-size:1rem">Reservas por hora</h3>
            <p class="muted" style="margin:0 0 1.25rem 0;font-size:0.82rem">Distribución horaria de actividad</p>

            @if (hourBars.length) {
              <div style="display:flex;align-items:flex-end;justify-content:space-around;height:180px;padding:0.75rem 0.5rem 0;border-bottom:2px solid #cbd5e1;gap:1rem">
                @for (bar of hourBars; track bar.hour) {
                  <div style="display:flex;flex-direction:column;align-items:center;flex:1;max-width:72px;height:100%;justify-content:flex-end">
                    <span class="mono" style="font-size:0.85rem;font-weight:700;color:#0f172a;margin-bottom:0.3rem">
                      {{ bar.count }}
                    </span>
                    <div
                      [style.height.%]="bar.heightPct"
                      style="width:100%;background:linear-gradient(180deg,#0d9488 0%,#0f766e 100%);border-radius:8px 8px 0 0;min-height:12px;transition:height 0.4s ease"
                      [title]="bar.hour + ':00 hrs - ' + bar.count + ' reservas'"
                    ></div>
                  </div>
                }
              </div>
              <div style="display:flex;justify-content:space-around;padding-top:0.5rem;gap:1rem">
                @for (bar of hourBars; track bar.hour) {
                  <span class="mono" style="flex:1;max-width:72px;text-align:center;font-size:0.82rem;color:#475569">
                    {{ bar.hour }}:00
                  </span>
                }
              </div>
            } @else {
              <div class="empty">Sin datos horarios registrados.</div>
            }
          </div>

          <!-- Gráfico Circular SVG (Donut) de Ocupación -->
          <div style="padding:1.25rem;border:1px solid #e2e8f0;border-radius:12px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <h3 style="margin:0 0 0.25rem 0;font-size:1rem;align-self:flex-start">Capacidad utilizada</h3>
            <p class="muted" style="margin:0 0 1rem 0;font-size:0.82rem;align-self:flex-start">Porcentaje de unidades ocupadas vs disponibles</p>

            <div style="position:relative;width:160px;height:160px">
              <svg viewBox="0 0 36 36" style="width:100%;height:100%;transform:rotate(-90deg)">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  stroke-width="3.6"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#0f766e"
                  stroke-width="3.6"
                  [attr.stroke-dasharray]="ocupacionPct + ', 100'"
                  stroke-linecap="round"
                />
              </svg>
              <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
                <span style="font-size:1.65rem;font-weight:700;color:#0f172a">{{ ocupacionPct }}%</span>
                <span style="font-size:0.75rem;color:#64748b">Ocupado</span>
              </div>
            </div>

            <div style="display:flex;gap:1.25rem;margin-top:1rem;font-size:0.82rem;color:#475569">
              <span style="display:flex;align-items:center;gap:0.35rem">
                <span style="width:10px;height:10px;border-radius:50%;background:#0f766e;display:inline-block"></span>
                Ocupado ({{ ocupacionPct }}%)
              </span>
              <span style="display:flex;align-items:center;gap:0.35rem">
                <span style="width:10px;height:10px;border-radius:50%;background:#e2e8f0;display:inline-block"></span>
                Libre ({{ 100 - ocupacionPct }}%)
              </span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ReportsComponent {
  kpis: Record<string, any> | null = null;
  hourBars: HourBar[] = [];
  ocupacionPct = 0;
  tiempoCiclo = 0;
  totalReservas = 0;
  rangeLabel = 'last24h';
  loading = false;
  error: string | null = null;

  constructor(private api: BffApiService) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.api.reportKpis().subscribe({
      next: (data) => {
        this.kpis = data ?? {};
        this.ocupacionPct = Number(this.kpis['ocupacionActivaPct'] ?? 0);
        this.tiempoCiclo = Number(this.kpis['tiempoCicloHoras'] ?? 0);
        this.rangeLabel = String(this.kpis['range'] ?? 'last24h');

        const rawHours = (this.kpis['reservasPorHora'] as Record<string, number>) ?? {};
        const entries = Object.entries(rawHours).map(([hour, count]) => ({
          hour: hour.padStart(2, '0'),
          count: Number(count),
        }));
        const max = Math.max(...entries.map((e) => e.count), 1);
        this.totalReservas = entries.reduce((acc, e) => acc + e.count, 0);
        this.hourBars = entries.map((e) => ({
          ...e,
          heightPct: Math.round((e.count / max) * 100),
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.reason || 'No autorizado o BFF no disponible.';
        this.loading = false;
      },
    });
  }
}