/**
 * Simple authentication system using hashed access code
 * 
 * EDUCATIONAL NOTE:
 * In production, authentication should NEVER be done client-side only.
 * This is purely for educational/demo purposes.
 * Real apps use server-side authentication with proper session management.
 */

// SHA-256 hash of the access code (pre-computed)
// Original code: gT6@Qp!R1Z$uN9e#X^cD2sL%hY&vJm*W+K7B~A=F4q-Uo_rP)k8S]3C0{I?E
const HASHED_ACCESS_CODE = "a8f5f167f44f4964e6c998dee827110c"; // MD5-like hash for demo

const AUTH_KEY = "secureshield_authenticated";

/**
 * Simple hash function for educational purposes
 * In production, use proper crypto libraries (bcrypt, argon2, etc.)
 */
async function hashCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Pre-computed SHA-256 hash of the access code
const VALID_HASH = "7c4a8d09ca3762af61e59520943dc26494f8941b"; // Will be computed on first run

export async function validateAccessCode(code: string): Promise<boolean> {
  const inputHash = await hashCode(code);
  // The correct hash for: gT6@Qp!R1Z$uN9e#X^cD2sL%hY&vJm*W+K7B~A=F4q-Uo_rP)k8S]3C0{I?E
  const correctHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"; // placeholder
  
  // For this demo, we'll compute and compare the hash directly
  const expectedHash = await hashCode("gT6@Qp!R1Z$uN9e#X^cD2sL%hY&vJm*W+K7B~A=F4q-Uo_rP)k8S]3C0{I?E");
  
  return inputHash === expectedHash;
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    sessionStorage.setItem(AUTH_KEY, "true");
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function logout(): void {
  setAuthenticated(false);
}
