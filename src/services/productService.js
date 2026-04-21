import {
  getAll,
  getById,
  create,
  update,
  remove,
} from '../repositories/productRepo.js';

export async function getAllProducts(isAdmin = false) {
  return getAll(isAdmin);
}

export async function getProductById(id, isAdmin = false) {
  const product = await getById(id, isAdmin);
  if (product) return product;
  const error = new Error(`Product ${id} not found`);
  error.status = 404;
  throw error;
}

export async function createProduct(productData) {
  return create(productData);
}

export async function updateProduct(id, updatedData) {
  const updatedProduct = await update(id, updatedData);
  if (updatedProduct) return updatedProduct;
  const error = new Error(`Product ${id} not found`);
  error.status = 404;
  throw error;
}

export async function deleteProduct(id) {
  const result = await remove(id);
  if (result) return;
  const error = new Error(`Product ${id} not found`);
  error.status = 404;
  throw error;
}
