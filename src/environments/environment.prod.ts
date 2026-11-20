/**
 * AndesStay — environment (producción)
 *
 * Despliegue en AWS (S3 + CloudFront o EC2 detrás de API Gateway).
 * RELLENA los 4 valores marcados antes de ejecutar `npm run build
 * -- --configuration production`:
 *
 * 1. apiBaseUrl      -> URL de AWS API Gateway que expone el BFF
 *    (ej. https://abc123.execute-api.us-east-1.amazonaws.com/prod/api).
 *    Nunca apuntar directamente a puertos internos 8081-8085.
 * 2. azureClientId   -> Client ID de la App Registration SPA en Entra ID
 *    (debe coincidir con AZURE_CLIENT_ID del BFF).
 * 3. redirectUri     -> URL del frontend en producción
 *    (ej. https://d123.cloudfront.net o https://andesstay.tudominio.com).
 * 4. postLogoutRedirectUri -> misma URL del frontend (logout de Entra ID).
 *
 * azureTenantId = 'common' (multitenant, alineado con NimbusJwtDecoder del BFF).
 * apiClientId   = Application ID de la App Registration API (audiencia 'aud' del JWT).
 */
export const environment = {
  production: true,
  demo: false,

  apiBaseUrl: 'https://<API_GATEWAY_URL>/api',

  azureClientId: 'POR_RELLENAR_AZURE_CLIENT_ID',
  azureTenantId: 'common',
  apiClientId: 'POR_RELLENAR_API_CLIENT_ID',
  apiScope: 'access_as_user',

  redirectUri: 'https://<FRONTEND_PROD_URL>',
  postLogoutRedirectUri: 'https://<FRONTEND_PROD_URL>',
};