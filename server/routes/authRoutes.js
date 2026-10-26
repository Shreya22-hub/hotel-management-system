import express from 'express';
import { User } from '../models/User.js';
import { verifyPassword, createSignedToken } from '../utils/cryptoSecurity.js';
import { 
  loginRateLimiter, 
  recordFailedLogin, 
  resetLoginAttempts, 
  authGuard 
} from '../middleware/securityMiddleware.js';

const router = express.Router();

// Secure Staff Login with Rate Limiting & Native Salted Password Hash Verification
router.post('/login', loginRateLimiter, async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';

  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({ 
      username: username.trim().toLowerCase()
    });

    if (!user) {
      recordFailedLogin(ip);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid staff username or password. Please use the demo credentials.' 
      });
    }

    // Verify cryptographic salted hash
    const isPasswordValid = verifyPassword(password, user.password);
    if (!isPasswordValid) {
      recordFailedLogin(ip);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid staff username or password. Please use the demo credentials.' 
      });
    }

    // Login successful: reset rate limiter for this IP
    resetLoginAttempts(ip);

    // Create tamper-proof HMAC signed token
    const token = createSignedToken({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      designation: user.designation
    });

    const { password: _, ...userSafe } = user.toObject();
    res.json({ 
      success: true, 
      token,
      user: userSafe 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify active session & return current staff profile
router.get('/me', authGuard, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
