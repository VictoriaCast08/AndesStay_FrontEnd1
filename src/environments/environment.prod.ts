/**
 * AndesStay — environment (producción)
 */
export const environment = {
  production: true,
  demo: false,

  apiBaseUrl: 'https://pwwdpbx3n8.execute-api.us-east-1.amazonaws.com/api',

  azureClientId: '5bf59bf1-a4c7-4169-975d-8976a17e9b60',
  azureTenantId: '35442bb9-6147-4555-8ac7-7aea33ca4c73',
  apiClientId: '5bf59bf1-a4c7-4169-975d-8976a17e9b60',
  apiScope: 'access_as_user',

  redirectUri: 'http://localhost:4200',
  postLogoutRedirectUri: 'http://localhost:4200',
};