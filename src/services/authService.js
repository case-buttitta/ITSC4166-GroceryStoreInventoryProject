import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUserWithCart, findUserByEmail } from '../repositories/userRepo.js';

export async function signUp(name, email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await createUserWithCart(name, email, passwordHash);
  return newUser;
}

export async function logIn(email, password) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  const error = new Error('Invalid credentials');
  error.status = 401;
  const user = await findUserByEmail(email);
  if (!user) throw error;

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw error;

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return token;
}
