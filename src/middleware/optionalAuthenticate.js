import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.id, role: payload.role };
    } catch {
      // Invalid token — treat as unauthenticated
    }
  }
  next();
}
