// Minimal, dependency-free JWT payload decoder (client-side, non-verifying).
// Used only to read non-sensitive claims (e.g. the logged-in user's id) that
// the server already trusts via the Authorization header on every request.
export default function decodeJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}
