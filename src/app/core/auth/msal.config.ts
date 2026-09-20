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
    navigateToLoginRequestUrl: true,
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
      scopes: apiConfig.scopes,
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
  map.set(base, apiConfig.scopes);
  map.set(`${base}/api`, apiConfig.scopes);
  map.set(`${base}/api/`, apiConfig.scopes);
  // Cubre /api/bff/**
  map.set(`${base}/api/bff`, apiConfig.scopes);
  map.set(`${base}/api/bff/`, apiConfig.scopes);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: map,
  };
}

export const MSAL_INSTANCE = new InjectionToken<IPublicClientApplication>('MSAL_INSTANCE');
