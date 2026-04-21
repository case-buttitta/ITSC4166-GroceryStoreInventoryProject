import {
  getAllOrders,
  getOrderById,
  createOrderFromCart,
  updateOrderStatus,
  removeOrder,
} from '../repositories/ordersRepo.js';
import { getCartByUserId } from '../repositories/cartRepo.js';
import { getById as getProductById } from '../repositories/productRepo.js';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered'];

export async function getAllOrdersService() {
  return getAllOrders();
}

export async function getOrderByIdService(id, requestingUser) {
  const order = await getOrderById(id);
  if (!order) {
    const error = new Error(`Order ${id} not found`);
    error.status = 404;
    throw error;
  }
  if (requestingUser.role !== 'admin' && order.user_id !== requestingUser.id) {
    const error = new Error('Forbidden: you do not have access to this order');
    error.status = 403;
    throw error;
  }
  return order;
}

export async function createOrderService(userId) {
  const cart = await getCartByUserId(userId);
  if (!cart || cart.items.length === 0) {
    const error = new Error('Cart is empty');
    error.status = 400;
    throw error;
  }

  for (const item of cart.items) {
    const product = await getProductById(item.product_id, true);
    if (!product) {
      const error = new Error(`Product ${item.product_id} no longer exists`);
      error.status = 404;
      throw error;
    }
  }

  const cartItems = cart.items.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }));

  const total = parseFloat(cart.total.toFixed(2));

  return createOrderFromCart(userId, cartItems, total);
}

export async function updateOrderStatusService(id, status) {
  if (!status || !STATUSES.includes(status)) {
    const error = new Error(`Status must be one of: ${STATUSES.join(', ')}`);
    error.status = 400;
    throw error;
  }
  const updated = await updateOrderStatus(id, status);
  if (!updated) {
    const error = new Error(`Order ${id} not found`);
    error.status = 404;
    throw error;
  }
  return updated;
}

export async function deleteOrderService(id) {
  const result = await removeOrder(id);
  if (!result) {
    const error = new Error(`Order ${id} not found`);
    error.status = 404;
    throw error;
  }
}
