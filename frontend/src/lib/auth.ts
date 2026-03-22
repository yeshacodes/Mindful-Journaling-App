export const AUTH_ROUTES = ['/login', '/signup'] as const;
export const PROTECTED_ROUTE_PREFIXES = ['/dashboard', '/journal'] as const;

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number]);
}

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function getAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid login credentials')) {
    return 'The email or password is incorrect. Please try again.';
  }

  if (normalized.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.';
  }

  if (normalized.includes('user already registered')) {
    return 'This email is already registered. Please log in instead.';
  }

  if (normalized.includes('password should be at least')) {
    return 'Your password is too short. Please choose a stronger password.';
  }

  return 'Something went wrong. Please try again.';
}

