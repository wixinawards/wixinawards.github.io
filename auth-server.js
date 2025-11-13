// Simple Node.js backend for secure password validation
// Deploy this on a server (e.g., Vercel, Netlify, Heroku)
// This keeps the password off the client-side code

import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

// Store this securely in environment variables, never in code
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || crypto.createHash('sha256').update('wixin4eva').digest('hex');
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'your-secret-key-here';

// Generate JWT-like token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Store active tokens in memory (use Redis in production)
const activeTokens = new Map();

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ success: false, error: 'Password required' });
  }

  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  
  if (passwordHash === ADMIN_PASSWORD_HASH) {
    const token = generateToken();
    activeTokens.set(token, { createdAt: Date.now() });
    
    // Token expires in 24 hours
    setTimeout(() => activeTokens.delete(token), 24 * 60 * 60 * 1000);
    
    return res.json({ 
      success: true, 
      token: token,
      expiresIn: 86400 
    });
  }
  
  res.status(401).json({ success: false, error: 'Incorrect password' });
});

app.post('/api/auth/verify', (req, res) => {
  const { token } = req.body;
  
  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
  
  res.json({ success: true });
});

app.post('/api/auth/logout', (req, res) => {
  const { token } = req.body;
  
  if (token) {
    activeTokens.delete(token);
  }
  
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
