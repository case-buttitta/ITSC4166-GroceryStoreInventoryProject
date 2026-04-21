import {
  getCartByUserId,
  addOrIncrementItem,
  updateItemQuantity,
  clearCartItems,
} from '../repositories/cartRepo.js';
import { getById as getProductById } from '../repositories/productRepo.js';

export async function getCart(userId) {
  const cart = await getCartByUserId(userId);
  if (!cart) {
    const error = new Error('Cart not found');
    error.status = 401;
    throw error;
  }
  return cart;
}

export async function addItem(userId, productId, quantity) {
  const product = await getProductById(productId, true);
  if (!product) {
    const error = new Error(`Product ${productId} not found`);
    error.status = 404;
    throw error;
  }
  return addOrIncrementItem(userId, productId, quantity);
}

export async function updateItem(userId, productId, quantity) {
  const updatedCart = await updateItemQuantity(userId, productId, quantity);
  if (!updatedCart) {
    const error = new Error('Product is not in the cart');
    error.status = 404;
    throw error;
  }
  return updatedCart;
}

export async function clearCart(userId) {
  await clearCartItems(userId);
}
