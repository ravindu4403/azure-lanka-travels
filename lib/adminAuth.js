export const ADMIN_COOKIE_NAME = 'azure_admin_session';

export function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN || 'change-this-token-before-production';
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || 'admin@azurelankatravels.com',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe@2026',
  };
}

export function isAdminSessionValid(token) {
  return Boolean(token && token === getAdminSessionToken());
}
