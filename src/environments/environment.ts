/**
 * AndesStay — environment (EP1)
 * Rellena los IDs de tu App Registration (ver docs/entra-id-setup.md).
 * clientId/tenantId no son secretos; el client_secret nunca va en el frontend.
 * En entrega con Entra real: demo = false.
 */
export const environment = {
  production: true,
  /** false = login real Microsoft Entra ID (entrega). true = demo visual sin Entra. */
  demo: false,
  azure: {
      clientId: '6a84e40b-9b22-40e4-b05a-16b64df43827',
      tenantId: '35442bb9-6147-4555-8ac7-7aea33ca4c73',
      redirectUri: 'http://18.208.98.65',
      postLogoutRedirectUri: 'http://18.208.98.65',
    },
    api: {
      baseUrl: 'https://uyrahshg11.execute-api.us-east-1.amazonaws.com',
      clientId: '6a84e40b-9b22-40e4-b05a-16b64df43827',
      scopeName: 'access_as_user',
  },
};