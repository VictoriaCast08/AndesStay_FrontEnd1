import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="shell-header">
        <div class="brand">
          <span class="brand-mark">AndesStay</span>
          <span class="brand-sub">Consola operativa · EP1</span>
        </div>
        <div class="session">
          <span class="session-user">{{ auth.displayName || auth.username }}</span>
          @for (role of auth.roles; track role) {
            <span class="chip chip-role">{{ role }}</span>
          }
          @if (!auth.roles.length) {
            <span class="chip chip-role">sin roles en token</span>
          }
          <button type="button" class="btn-ghost" (click)="auth.logout()">Cerrar sesión</button>
        </div>
      </header>

      <nav class="shell-nav" aria-label="Navegación AndesStay">
        <p class="nav-section">Operación</p>
        <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a class="nav-link" routerLink="/reservations" routerLinkActive="active">Reservas</a>
        <a class="nav-link" routerLink="/catalog" routerLinkActive="active">Catálogo</a>
        <p class="nav-section">Gestión</p>
        <a class="nav-link" routerLink="/reports" routerLinkActive="active">Reportería</a>
        <a class="nav-link" routerLink="/audit" routerLinkActive="active">Auditoría</a>
      </nav>

      <main class="shell-main">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShellComponent {
  constructor(public auth: AuthService) {}
}
