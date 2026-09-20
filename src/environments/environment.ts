/**
 * AndesStay — environment (EP1)
 * Rellena los IDs de tu App Registration (ver docs/entra-id-setup.md).
 * clientId/tenantId no son secretos; el client_secret nunca va en el frontend.
 * En entrega con Entra real: demo = false.
 */
export const environment = {
  production: false,
  /** false = login real Microsoft Entra ID (entrega). true = demo visual sin Entra. */
  demo: false,
  azure: {
    clientId: '<spa-client-id>',
    tenantId: '<tenant-id>',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
  },
  api: {
    /** BFF AndesStay (API Gateway o localhost en desarrollo) */
    baseUrl: 'http://localhost:8080',
    /** Application ID URI de AndesStay-API en Entra */
    clientId: '<api-client-id>',
    /** Scope expuesto en Expose an API */
    scopeName: 'access_as_user',
  },
};
