import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const base = environment.api.baseUrl.replace(/\/$/, '');

export interface BffMe {
  user: string;
  roles: string[];
  authorities: string[];
  claims: Record<string, unknown>;
}

export interface ReservationRow {
  id: string;
  unidad: string;
  huesped: string;
  estado: string;
  desde: string;
  hasta: string;
}

export interface UnitRow {
  id: string;
  nombre: string;
  tipo: string;
  tarifa: number;
  disponible: boolean;
}

@Injectable({ providedIn: 'root' })
export class BffApiService {
  constructor(private http: HttpClient) {}

  ping(): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(`${base}/api/bff/ping`);
  }

  me(): Observable<BffMe> {
    return this.http.get<BffMe>(`${base}/api/bff/me`);
  }

  dashboard(): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(`${base}/api/bff/dashboard`);
  }

  reservations(): Observable<ReservationRow[]> {
    return this.http.get<ReservationRow[]>(`${base}/api/bff/reservations`);
  }

  catalog(): Observable<UnitRow[]> {
    return this.http.get<UnitRow[]>(`${base}/api/bff/catalog/units`);
  }

  audit(): Observable<Array<Record<string, unknown>>> {
    return this.http.get<Array<Record<string, unknown>>>(`${base}/api/bff/audit/timeline`);
  }

  reportKpis(): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(`${base}/api/bff/report/kpis`);
  }
}
