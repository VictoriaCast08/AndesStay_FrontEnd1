import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const base = environment.apiBaseUrl.replace(/\/$/, '');

export interface BffMe {
  user: string;
  roles: string[];
  authorities: string[];
  claims: Record<string, unknown>;
}

export interface ReservationRow {
  id: number | string;
  code?: string;
  unitId?: number;
  guestName?: string;
  status?: string;
  stayFrom?: string;
  stayTo?: string;
  unidad?: string;
  huesped?: string;
  estado?: string;
  desde?: string;
  hasta?: string;
}

export interface UnitRow {
  id: number | string;
  code?: string;
  name?: string;
  type?: string;
  rate?: number;
  available?: boolean;
  nombre?: string;
  tipo?: string;
  tarifa?: number;
  disponible?: boolean;
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
    return this.http.get<ReservationRow[]>(`${base}/api/reservations`);
  }

  createReservation(payload: Record<string, unknown>): Observable<ReservationRow> {
    return this.http.post<ReservationRow>(`${base}/api/reservations`, payload);
  }

  updateReservationStatus(id: number | string, status: string): Observable<ReservationRow> {
    return this.http.put<ReservationRow>(`${base}/api/reservations/${id}/status`, { status });
  }

  catalog(): Observable<UnitRow[]> {
    return this.http.get<UnitRow[]>(`${base}/api/catalog/units`);
  }

  createUnit(payload: Record<string, unknown>): Observable<UnitRow> {
    return this.http.post<UnitRow>(`${base}/api/catalog/units`, payload);
  }

  updateUnit(id: number | string, payload: Record<string, unknown>): Observable<UnitRow> {
    return this.http.put<UnitRow>(`${base}/api/catalog/units/${id}`, payload);
  }

  audit(): Observable<Array<Record<string, unknown>>> {
    return this.http.get<Array<Record<string, unknown>>>(`${base}/api/audit/timeline`);
  }

  reportKpis(): Observable<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(`${base}/api/report/kpis`);
  }
}