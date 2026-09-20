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
      clientId: '6a84e40b-9b22-40e4-b05a-16b64df43827',
      tenantId: '35442bb9-6147-4555-8ac7-7aea33ca4c73',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200',
    },
    api: {
      baseUrl: 'http://localhost:8080',
      clientId: '6a84e40b-9b22-40e4-b05a-16b64df43827',
      scopeName: 'access_as_user',
  },
};