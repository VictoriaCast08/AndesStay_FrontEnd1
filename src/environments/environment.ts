/**
 * AndesStay — environment (desarrollo local)
 */
export const environment = {
  production: false,
  /** false = login real con Microsoft Entra ID. true = demo visual sin Entra (solo local). */
  demo: false,

  // BFF / AWS API Gateway — todo el tráfico de API pasa por aquí
  apiBaseUrl: 'https://c09kr0kozf.execute-api.us-east-1.amazonaws.com/api',

  // Microsoft Entra ID (App Registration de tipo Single-page application)
  azureClientId: '5bf59bf1-a4c7-4169-975d-8976a17e9b60', // Application (client) ID de la app SPA
  azureTenantId: '35442bb9-6147-4555-8ac7-7aea33ca4c73', // Tenant ID de tu organización en Entra ID
  apiClientId: '5bf59bf1-a4c7-4169-975d-8976a17e9b60',   // Application ID de la app API (audience del JWT)
  apiScope: 'access_as_user',

  // Redirecciones de Entra ID
  redirectUri: 'http://localhost:4200',
  postLogoutRedirectUri: 'http://localhost:4200',
};