# Guía AndesStay — Microsoft Entra ID (frontend)

Complementa `https://github.com/DsDekoV02/AndesStay_BackEnd/blob/main/docs/entra-id-setup.md`.

## Qué rellenar en este repo

Archivos: `src/environments/environment.ts` (desarrollo) y
`src/environments/environment.prod.ts` (producción, `npm run build -- --configuration production`).

| Campo | Valor / de dónde sale |
|-------|-----------------------|
| `apiBaseUrl` | BFF vía AWS API Gateway. Dev: `http://<EC2_BACKEND_IP>:8080/api`. Prod: URL del API Gateway. Nunca puertos 8081-8085 directo. |
| `azureClientId` | App Registration **SPA** de Entra ID (Application ID). Debe coincidir con `AZURE_CLIENT_ID` del BFF. |
| `azureTenantId` | `'common'` (login multitenant, alineado con `NimbusJwtDecoder` del BFF). |
| `apiClientId` | App Registration **API** de Entra ID (audiencia `aud` del JWT que espera el BFF). |
| `apiScope` | `access_as_user` |
| `redirectUri` | Dev: `http://localhost:4200`. Prod: URL del frontend (S3/CloudFront/EC2). |
| `postLogoutRedirectUri` | Igual que `redirectUri` (URL de regreso tras el logout de Entra ID). |
| `demo` | `false` en entrega con Entra real. |

Los valores sensibles/IPs viejas NO van en el repositorio: `.env` está en `.gitignore` y se provee `.env.example` como plantilla.

## App Roles

En la aplicación API crear roles con **Value** exacto:

- `Admin`
- `Operador`
- `Cliente`
- `Auditor`

Asignarlos en Enterprise applications → Users and groups. El frontend lee los roles de los claims `roles` / `groups` del `id_token`.

## Redirect URI SPA

Registrar en Entra ID (tipo Single-page application):
- Dev: `http://localhost:4200`
- Prod: URL del frontend en producción (S3/CloudFront o EC2)

## Prueba rápida

```powershell
npm install
npm start
# http://localhost:4200 → Iniciar sesión con Microsoft
```

Con `demo: true` (solo local, sin Entra) el botón simula roles y no llama a Entra.

## Despliegue con Docker

```powershell
docker build -t andesstay-frontend .
docker run -p 80:80 andesstay-frontend
```

Nginx sirve en el puerto 80 y `try_files $uri $uri/ /index.html` permite recargar rutas de la SPA y las redirecciones de Entra ID sin 404.

## Checklist entrega

- [ ] `.env` eliminado y en `.gitignore` (sin credenciales ni IPs quemadas)
- [ ] `src/environments/environment.prod.ts` creado con los 4 valores de producción rellenados
- [ ] `azureTenantId = 'common'` y scopes `api://<apiClientId>/access_as_user`
- [ ] `MsalGuard` protege las rutas privadas; `roleGuard` valida roles
- [ ] `MsalInterceptor` adjunta `Authorization: Bearer` a `apiBaseUrl`
- [ ] `npm run build -- --configuration production` → cero errores de TypeScript
- [ ] `Dockerfile` (node:20-alpine, `npm ci`, `dist/frontend-andesstay/browser`, puerto 80) y `nginx.conf` con `try_files`
- [ ] Login Microsoft funciona; BFF responde 200 con token y 401 sin token
- [ ] Commit y push a `main`
