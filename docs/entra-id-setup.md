# Guía AndesStay — Microsoft Entra ID (frontend)

Complementa `https://github.com/DsDekoV02/AndesStay_BackEnd/blob/main/docs/entra-id-setup.md`.

## Qué rellenar en este repo

Archivo: `src/environments/environment.ts`

| Campo | De dónde sale |
|-------|----------------|
| `azure.clientId` | App Registration **SPA** (Application ID) |
| `azure.tenantId` | Directory (tenant) ID |
| `api.clientId` | App Registration **API** (Application ID) |
| `api.baseUrl` | URL del BFF (`http://localhost:8080` o API Gateway) |
| `demo` | `false` en entrega con Entra real |

## App Roles

En la aplicación API crear roles con **Value** exacto:

- `Admin`
- `Operador`
- `Cliente`
- `Auditor`

Asignarlos en Enterprise applications → Users and groups.

## Redirect URI SPA

`http://localhost:4200` (tipo Single-page application).

## Prueba rápida

```powershell
npm install
npm start
# http://localhost:4200 → Iniciar sesión con Microsoft
```

Con `demo: true` (solo local, sin Entra) el botón simula roles y no llama a Entra.

## Checklist entrega

- [ ] `demo: false`
- [ ] clientId/tenantId/api-clientId reales
- [ ] Login Microsoft funciona
- [ ] Header muestra roles
- [ ] BFF responde 200 con token y 401 sin token
- [ ] Commit y push a `AndesStay_FrontEnd`
