import prisma from '../config/db.js';

export async function createUserWithCart(name, email, passwordHash) {
  try {
    return await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, password_hash: passwordHash, created_at: new Date() },
        select: { id: true, name: true, email: true, created_at: true },
      });
      await tx.cart.create({
        data: {
          user_id: newUser.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      return newUser;
    });
  } catch (error) {
    if (error.code === 'P2002') {
      const err = new Error('Email has already been used');
      err.status = 409;
      throw err;
    }
    throw error;
  }
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
