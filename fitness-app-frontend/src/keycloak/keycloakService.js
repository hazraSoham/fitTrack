import Keycloak from 'keycloak-js';
import { keycloakConfig } from './keycloakConfig';

const keycloak = new Keycloak(keycloakConfig);
let initialized = false;

export const initKeycloak = (onAuthSuccess, onAuthError) => {
  if (initialized) {
    if (keycloak.authenticated) {
      onAuthSuccess();
    }
    return Promise.resolve(keycloak.authenticated);
  }

  initialized = true;
  return keycloak
    .init({
      onLoad: 'check-sso',
      flow: 'standard',  // Using standard flow
      pkceMethod: 'S256',
      checkLoginIframe: false  // Disable iframe checking to avoid CSP issues
    })
    .then((authenticated) => {
      if (authenticated) {
        onAuthSuccess();
      }
      return authenticated;
    })
    .catch((error) => {
      console.error("Keycloak initialization error:", error);
      onAuthError(error);
      return false;
    });
};

export const login = () => {
    keycloak.login({
        redirectUri: window.location.origin + '/'
    });
};
export const logout = () => keycloak.logout();
export const getToken = () => keycloak.token;
export const isAuthenticated = () => !!keycloak.token;
export const updateToken = (minValidity) => keycloak.updateToken(minValidity);
export const getUserInfo = () => {
  return {
    username: keycloak.tokenParsed?.preferred_username || '',
    firstName: keycloak.tokenParsed?.given_name || '',
    lastName: keycloak.tokenParsed?.family_name || '',
    email: keycloak.tokenParsed?.email || '',
    id: keycloak.tokenParsed?.sub || '',
  };
};
export const register = () => {
  const redirectUri = window.location.origin + '/';
  keycloak.register({
    redirectUri: redirectUri
  });
};
export const refreshTokenIfNeeded = async () => {
  if (keycloak.isTokenExpired()) {
    try {
      await keycloak.updateToken(30); // tries to refresh if token will expire in next 30 seconds
      console.log('Token refreshed');
    } catch (error) {
      console.error('Failed to refresh token', error);
      keycloak.logout();
    }
  }
};

export const getValidToken = async () => {
  await refreshTokenIfNeeded();
  return getToken();
};

export { keycloak };