import crypto from 'node:crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'rajvilas_palace_ultra_secret_key_2026_udaipur';

// 1. Salted Password Hashing using native Node.js scrypt (NIST standard)
export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
};

// Constant-time password verification (immune to timing attacks)
export const verifyPassword = (password, storedHash) => {
  if (!storedHash || !storedHash.includes(':')) {
    // Fallback for legacy plaintext passwords during initial migration
    return password === storedHash;
  }
  const [salt, key] = storedHash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
};

// 2. Tamper-Proof HMAC Session Tokens (Native zero-package alternative to JWT)
export const createSignedToken = (payload, expiresInMs = 24 * 60 * 60 * 1000) => {
  const tokenPayload = {
    ...payload,
    exp: Date.now() + expiresInMs
  };
  const base64Data = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(base64Data)
    .digest('base64url');

  return `${base64Data}.${signature}`;
};

// Verify HMAC token & ensure payload wasn't altered
export const verifySignedToken = (token) => {
  if (!token || !token.includes('.')) return null;

  const [base64Data, signature] = token.split('.');
  if (!base64Data || !signature) return null;

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(base64Data)
    .digest('base64url');

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null; // Signature tampered!
  }

  try {
    const payload = JSON.parse(Buffer.from(base64Data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Token expired
    }
    return payload;
  } catch (e) {
    return null;
  }
};

// 3. Indian Identity Number Masking (UIDAI Aadhaar / Passport standard)
export const maskGovtId = (idType, idNumber) => {
  if (!idNumber) return 'Not Provided';
  const clean = idNumber.replace(/\s+/g, '');

  if (idType && idType.toLowerCase().includes('aadhaar')) {
    if (clean.length >= 4) {
      const last4 = clean.slice(-4);
      return `XXXX-XXXX-${last4}`;
    }
  }

  if (idType && idType.toLowerCase().includes('passport')) {
    if (clean.length >= 4) {
      return `${clean[0]}XXXX${clean.slice(-2)}`;
    }
  }

  return clean;
};
