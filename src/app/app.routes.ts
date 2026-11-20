import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { roleGuard } from './core/auth/role.guard';
import { LoginComponent } from './features/login/login.component';
import { ShellComponent } from './layout/shell.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ReservationsComponent } from './features/reservations/reservations.component';
import { CatalogComponent } from './features/catalog/catalog.component';
import { ReportsComponent } from './features/reports/reports.component';
import { AuditComponent } from './features/audit/audit.component';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [MsalGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [MsalGuard, roleGuard],
        data: { roles: ['Admin', 'Operador', 'Cliente', 'Auditor'] },
      },
      {
        path: 'reservations',
        component: ReservationsComponent,
        canActivate: [MsalGuard, roleGuard],
        data: { roles: ['Admin', 'Operador', 'Cliente'] },
      },
      {
        path: 'catalog',
        component: CatalogComponent,
        canActivate: [MsalGuard, roleGuard],
        data: { roles: ['Admin', 'Operador'] },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [MsalGuard, roleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'audit',
        component: AuditComponent,
        canActivate: [MsalGuard, roleGuard],
        data: { roles: ['Admin', 'Auditor'] },
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
