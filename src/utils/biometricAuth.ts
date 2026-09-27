/**
 * Biometric Authentication & Secure Token Utility
 * Manages mock secure tokens stored in localStorage for enhanced scholarship data security.
 */

export const STORAGE_KEY_BIOMETRIC_ENABLED = 'mota_use_biometric_auth';
export const STORAGE_KEY_BIOMETRIC_TOKEN = 'mota_biometric_secure_token';
export const STORAGE_KEY_CONFIRMATION_TOKEN = 'mota_biometric_confirmation_token';
export const FALLBACK_KEY_TOKEN = 'biometric_auth_token';

export interface MockBiometricToken {
  token: string;
  studentId: string;
  issuedAt: string;
  expiresAt: string;
  algorithm: string;
  deviceId: string;
  scope: string;
  authMethod: 'face' | 'fingerprint' | 'fido2_key';
  status: 'active' | 'revoked' | 'expired';
  assuranceLevel: 'AAL3' | 'AAL2';
  fingerprintHash: string;
}

export interface BiometricConfirmationRecord {
  confirmationToken: string;
  handshakeSessionId: string;
  hardwareDeviceModel: string;
  handshakeLatencyMs: number;
  deviceThumbprint: string;
  enrolledAt: string;
  authMethod: 'face' | 'fingerprint' | 'fido2_key';
  status: 'confirmed';
  studentId: string;
  firmwareVersion: string;
  rdServiceVersion: string;
  livenessConfidenceScore: number;
}

/**
 * Generates a mock cryptographic secure token representing an authenticated WebAuthn / FIDO2 session.
 */
export function generateMockSecureToken(
  studentId: string = 'STU-2026-JH-89104',
  authMethod: 'face' | 'fingerprint' | 'fido2_key' = 'face'
): MockBiometricToken {
  const now = Date.now();
  const randomBytes = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  const randomHash = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  const tokenPayload = {
    iss: 'https://scholarships.gov.in/auth/biometric',
    sub: studentId,
    aud: 'mota-scholarship-portal',
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + 24 * 60 * 60 * 1000) / 1000), // 24-hour validity
    jti: `bio_jwt_${randomBytes}`,
    method: authMethod,
    assurance: 'AAL3',
    scope: 'SCHOLARSHIP_SENSITIVE_DATA_READ'
  };

  const encodedPayload = btoa(JSON.stringify(tokenPayload));
  const fullToken = `MOTA_SECURE_BIO.v2.${encodedPayload}.${randomHash.slice(0, 24)}`;

  return {
    token: fullToken,
    studentId,
    issuedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
    algorithm: 'Ed25519-FIDO2-UIDAI-RD2.0',
    deviceId: 'SECURE_ENCLAVE_DEVICE_01',
    scope: 'SCHOLARSHIP_SENSITIVE_DATA_READ',
    authMethod,
    status: 'active',
    assuranceLevel: 'AAL3',
    fingerprintHash: `SHA256:${randomHash.slice(0, 16)}`
  };
}

/**
 * Check if Biometric Authentication is enabled in localStorage
 */
export function isBiometricAuthEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const pref = localStorage.getItem(STORAGE_KEY_BIOMETRIC_ENABLED);
    // If explicitly set, return boolean value
    if (pref !== null) {
      return pref === 'true';
    }
    // Check if a token already exists
    const token = localStorage.getItem(STORAGE_KEY_BIOMETRIC_TOKEN) || localStorage.getItem(FALLBACK_KEY_TOKEN);
    return Boolean(token);
  } catch {
    return false;
  }
}

/**
 * Get stored mock secure token from localStorage
 */
export function getStoredBiometricToken(): MockBiometricToken | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BIOMETRIC_TOKEN) || localStorage.getItem(FALLBACK_KEY_TOKEN);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.token) {
        return parsed as MockBiometricToken;
      }
    } catch {
      // If raw is a plain string token
      return {
        token: raw,
        studentId: 'STU-2026-JH-89104',
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        algorithm: 'Ed25519-FIDO2-UIDAI',
        deviceId: 'SECURE_ENCLAVE_01',
        scope: 'SCHOLARSHIP_SENSITIVE_DATA_READ',
        authMethod: 'face',
        status: 'active',
        assuranceLevel: 'AAL3',
        fingerprintHash: 'SHA256:0b84f3c81e9'
      };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Save mock secure token to localStorage and enable biometric auth
 */
export function saveBiometricToken(tokenObj: MockBiometricToken): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_BIOMETRIC_ENABLED, 'true');
    localStorage.setItem(STORAGE_KEY_BIOMETRIC_TOKEN, JSON.stringify(tokenObj));
    localStorage.setItem(FALLBACK_KEY_TOKEN, tokenObj.token);
  } catch (err) {
    console.error('Failed to save biometric secure token to localStorage', err);
  }
}

/**
 * Remove mock secure token from localStorage and disable biometric auth
 */
export function removeBiometricToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_BIOMETRIC_ENABLED, 'false');
    localStorage.removeItem(STORAGE_KEY_BIOMETRIC_TOKEN);
    localStorage.removeItem(FALLBACK_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_CONFIRMATION_TOKEN);
  } catch (err) {
    console.error('Failed to remove biometric secure token from localStorage', err);
  }
}

/**
 * Generate a confirmation token resulting from a successful biometric hardware handshake
 */
export function generateBiometricConfirmationRecord(
  studentId: string = 'STU-2026-JH-89104',
  authMethod: 'face' | 'fingerprint' | 'fido2_key' = 'fingerprint',
  hardwareDeviceModel: string = 'Integrated Biometric Sensor (UIDAI RD 2.0)'
): BiometricConfirmationRecord {
  const now = Date.now();
  const hex32 = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');

  const randomSession = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('').toUpperCase();

  const confirmationToken = `MOTA_CONF_TOKEN_2026_AAL3_${studentId.replace(/[^a-zA-Z0-9]/g, '')}_${hex32}`;

  return {
    confirmationToken,
    handshakeSessionId: `HS-SES-${randomSession}`,
    hardwareDeviceModel,
    handshakeLatencyMs: Math.floor(Math.random() * 45) + 38, // 38-83ms realistic hardware latency
    deviceThumbprint: `FIDO2-DEV-${hex32.slice(0, 12).toUpperCase()}`,
    enrolledAt: new Date(now).toISOString(),
    authMethod,
    status: 'confirmed',
    studentId,
    firmwareVersion: 'v3.8.4-secure-build',
    rdServiceVersion: 'UIDAI-RD-2.0.1',
    livenessConfidenceScore: 98.4
  };
}

/**
 * Save confirmation token record to localStorage
 */
export function saveConfirmationToken(record: BiometricConfirmationRecord): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CONFIRMATION_TOKEN, JSON.stringify(record));
  } catch (err) {
    console.error('Failed to save biometric confirmation token to localStorage', err);
  }
}

/**
 * Retrieve confirmation token record from localStorage
 */
export function getStoredConfirmationToken(): BiometricConfirmationRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIRMATION_TOKEN);
    if (!raw) return null;
    return JSON.parse(raw) as BiometricConfirmationRecord;
  } catch {
    return null;
  }
}

/**
 * Remove confirmation token record from localStorage
 */
export function removeConfirmationToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_CONFIRMATION_TOKEN);
  } catch (err) {
    console.error('Failed to remove biometric confirmation token from localStorage', err);
  }
}
