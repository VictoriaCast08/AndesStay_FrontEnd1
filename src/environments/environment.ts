/**
 * AndesStay — environment (desarrollo local)
 *
 * Valores de referencia para entorno local. En producción se usa
 * src/environments/environment.prod.ts (build --configuration production).
 *
 * Reglas:
 * - apiBaseUrl apunta al BFF a través de AWS API Gateway (producción) o al
 *   EC2 del BFF en el puerto 8080 (desarrollo). Nunca a puertos internos
 *   8081-8085 de los microservicios.
 * - azureTenantId = 'common' (login multitenant de Microsoft Entra ID).
 * - clientId/tenantId no son secretos; el client_secret del BFF nunca viaja
 *   al frontend.
 */
export const environment = {
  production: false,
  /** false = login real con Microsoft Entra ID. true = demo visual sin Entra (solo local). */
  demo: false,

  // BFF / AWS API Gateway — todo el tráfico de API pasa por aquí
  apiBaseUrl: 'http://localhost:8080/api',

  // Microsoft Entra ID (App Registration de tipo Single-page application)
  azureClientId: 'POR_RELLENAR_AZURE_CLIENT_ID',          // Application (client) ID de la app SPA
  azureTenantId: 'common',                                // multitenant: cualquier tenant de Entra ID
  apiClientId: 'POR_RELLENAR_API_CLIENT_ID',              // Application ID de la app API (audience del JWT)
  apiScope: 'access_as_user',

  // Redirecciones de Entra ID
  redirectUri: 'http://localhost:4200',
  postLogoutRedirectUri: 'http://localhost:4200',
};