import { InjectionToken } from '@angular/core';
import {
  Configuration,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
  InteractionType,
} from '@azure/msal-browser';
import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

export const apiConfig = {
  baseUrl: environment.api.baseUrl,
  clientId: environment.api.clientId,
  /** Scope completo que el SPA solicita para el BFF AndesStay */
  scopes: [`api://${environment.api.clientId}/${environment.api.scopeName}`],
};

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.azure.clientId,
    authority: `https://login.microsoftonline.com/${environment.azure.tenantId}`,
    redirectUri: environment.azure.redirectUri,
    postLogoutRedirectUri: environment.azure.postLogoutRedirectUri,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        if (level === LogLevel.Error) {
          console.error(message);
        }
      },
      logLevel: LogLevel.Error,
      piiLoggingEnabled: false,
    },
  },
};

export function msalInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      // Usamos scopes estándar de OIDC para hacer el login básico sin bloquear con el scope de API
      scopes: ['openid', 'profile', 'email'],
    },
    loginFailedRoute: '/login',
  };
}

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  // En modo demo no hay Entra: el BFF local responde sin Authorization.
  if (environment.demo) {
    return {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map(),
    };
  }
  const map = new Map<string, Array<string>>();
  const base = apiConfig.baseUrl.replace(/\/$/, '');

  // El Interceptor adjuntará el Token cuando se hagan peticiones al BFF
  map.set(base, apiConfig.scopes);
  map.set(`${base}/*`, apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: map,
  };
}

export const MSAL_INSTANCE = new InjectionToken<IPublicClientApplication>('MSAL_INSTANCE');