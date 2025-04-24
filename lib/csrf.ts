import { generateToken, verifyToken } from 'csrf-protection';

export async function getCsrfToken() {
  return generateToken();
}

export async function verifyCsrfToken(token: string) {
  return verifyToken(token);
}

// In API routes:
export default async function handler(req, res) {
  // Verify CSRF token
  const isValidCsrfToken = await verifyCsrfToken(req.headers['x-csrf-token']);
  
  if (!isValidCsrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  
  // Process the request
  // ... existing code ...
}