# frontend-andesstay

Frontend **Angular + MSAL** del caso semestral **AndesStay** (EP1 DSY1107).

Repositorio: https://github.com/VictoriaCast08/AndesStay_FrontEnd1
Backend (BFF + microservicios): https://github.com/VictoriaCast08/AndesStay_BackEnd1

## Cumplimiento EP1 (rubro MSAL 60%)

- Angular 19 standalone
- `@azure/msal-angular` + `@azure/msal-browser`
- Login / logout con Microsoft Entra ID
- `MsalInterceptor` adjunta `Authorization: Bearer` al BFF
- Guards de sesión (`auth.guard`) y por rol (`role.guard`)
- Roles desde claims del token: `Admin`, `Operador`, `Cliente`, `Auditor`
- Scopes de la API: `api://<API_CLIENT_ID>/access_as_user`
- Pantallas del caso: Login, Dashboard, Reservas, Catálogo, Reportería, Auditoría

## Configuración Entra ID

Guía completa: [docs/entra-id-setup.md](docs/entra-id-setup.md)

Edita `src/environments/environment.ts`:

```ts
demo: false, // entrega con Entra real
azure.clientId   // App Registration SPA
azure.tenantId   // Directory tenant ID
api.clientId     // App Registration API (audience)
api.baseUrl      // http://localhost:8080 o URL del API Gateway
```

## Ejecutar

```powershell
npm install
npm start
```

Abre `http://localhost:4200`.

### Modo demo (solo sin Entra)

En `environment.ts` pon `demo: true`. El botón de login simula una cuenta con roles y no llama a Entra. **No uses demo=true en la entrega si el docente evalúa el flujo MSAL real.**

## Flujo seguro

```text
Usuario → MSAL Entra ID → access_token (audience api://<API>)
       → MsalInterceptor → API Gateway (JWT Authorizer)
       → ms-andesstay-bff → microservicios de dominio
```

## Pantallas y roles

| Ruta | Roles |
|------|--------|
| `/login` | público |
| `/dashboard` | autenticados |
| `/reservations` | Admin, Operador, Cliente |
| `/catalog` | Admin, Operador |
| `/reports` | Admin |
| `/audit` | Admin, Auditor |

