import prisma from '../config/db.js';

const storefrontSelect = {
  id: true,
  product_name: true,
  upc: true,
  price: true,
};

const adminSelect = {
  id: true,
  product_name: true,
  upc: true,
  price: true,
  stock_quantity: true,
  reorder_threshold: true,
  warehouse_location: true,
};

export async function getAll(isAdmin = false) {
  return prisma.product.findMany({ select: isAdmin ? adminSelect : storefrontSelect });
}

export async function getById(id, isAdmin = false) {
  return prisma.product.findUnique({
    where: { id },
    select: isAdmin ? adminSelect : storefrontSelect,
  });
}

export async function create(productData) {
  try {
    return await prisma.product.create({ data: productData });
  } catch (error) {
    if (error.code === 'P2002') {
      const err = new Error('A product with that UPC already exists');
      err.status = 409;
      throw err;
    }
    throw error;
  }
}

export async function update(id, updatedData) {
  try {
    return await prisma.product.update({ where: { id }, data: updatedData });
  } catch (error) {
    if (error.code === 'P2025') return null;
    if (error.code === 'P2002') {
      const err = new Error('A product with that UPC already exists');
      err.status = 409;
      throw err;
    }
    throw error;
  }
}

export async function remove(id) {
  try {
    return await prisma.$transaction(async (tx) => {
      await tx.cartItem.deleteMany({ where: { product_id: id } });
      await tx.orderItem.deleteMany({ where: { product_id: id } });
      return tx.product.delete({ where: { id } });
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
