import { verifySignedToken } from '../utils/cryptoSecurity.js';

// In-Memory Rate Limiter for Login (Zero packages needed)
const loginAttempts = new Map(); // IP -> { count, firstAttemptTime, blockedUntil }

export const loginRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes window
  const maxAttempts = 5;

  const record = loginAttempts.get(ip);

  if (record) {
    if (record.blockedUntil && now < record.blockedUntil) {
      const waitMinutes = Math.ceil((record.blockedUntil - now) / 60000);
      return res.status(429).json({
        success: false,
        message: `Too many failed login attempts. Terminal temporarily locked for security. Please try again in ${waitMinutes} minute(s).`
      });
    }

    if (now - record.firstAttemptTime > windowMs) {
      // Reset window after 15 min
      loginAttempts.set(ip, { count: 1, firstAttemptTime: now, blockedUntil: null });
    }
  }

  next();
};

export const recordFailedLogin = (ip) => {
  const clientIp = ip || '127.0.0.1';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  const record = loginAttempts.get(clientIp);
  if (!record || now - record.firstAttemptTime > windowMs) {
    loginAttempts.set(clientIp, { count: 1, firstAttemptTime: now, blockedUntil: null });
  } else {
    record.count += 1;
    if (record.count >= maxAttempts) {
      record.blockedUntil = now + windowMs; // Lock for 15 minutes
      console.warn(`🚨 Security Alert: IP ${clientIp} exceeded max failed login attempts. Locked for 15 mins.`);
    }
    loginAttempts.set(clientIp, record);
  }
};

export const resetLoginAttempts = (ip) => {
  loginAttempts.delete(ip || '127.0.0.1');
};

// Native HTTP Security Headers (Zero packages needed)
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

// Authentication Guard: verifies signed HMAC token
export const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Missing or invalid staff authorization token.'
    });
  }

  const token = authHeader.split(' ')[1];
  const verifiedUser = verifySignedToken(token);

  if (!verifiedUser) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Session token is expired or has been tampered with.'
    });
  }

  req.user = verifiedUser;
  next();
};

// Role-Based Access Control (RBAC) Guard
export const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Staff member (${req.user?.designation || 'Unknown'}) does not hold authorization for this palace module.`
      });
    }
    next();
  };
};
