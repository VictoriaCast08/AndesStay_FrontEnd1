import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="login-page">
      <section class="login-card">
        <p class="eyebrow">Acceso denegado</p>
        <h1>Rol insuficiente</h1>
        <p>
          Tu token no incluye el rol necesario para esta pantalla.
          @if (required) {
            Se requiere: <strong class="mono">{{ required }}</strong>
          }
        </p>
        <a routerLink="/dashboard" class="btn-primary" style="display:inline-block;text-decoration:none;line-height:40px;padding:0 1rem">
          Volver al dashboard
        </a>
      </section>
    </div>
  `,
})
export class UnauthorizedComponent {
  required = '';

  constructor(route: ActivatedRoute) {
    this.required = route.snapshot.queryParamMap.get('required') ?? '';
  }
}
