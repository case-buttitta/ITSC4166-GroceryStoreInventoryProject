import { getCart, addItem, updateItem, clearCart } from '../services/cartService.js';

export async function getCartHandler(req, res) {
  const cart = await getCart(req.user.id);
  res.status(200).json(cart);
}

export async function addCartItemHandler(req, res) {
  const { product_id, quantity } = req.body;

  if (!product_id || !Number.isInteger(product_id) || product_id < 1) {
    return res.status(400).json({ error: 'product_id must be a positive integer' });
  }
  if (!quantity || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: 'quantity must be a positive integer' });
  }

  const cart = await addItem(req.user.id, product_id, quantity);
  res.status(201).json(cart);
}

export async function updateCartItemHandler(req, res) {
  const product_id = parseInt(req.params.product_id);
  const { quantity } = req.body;

  if (!Number.isInteger(product_id) || product_id < 1) {
    return res.status(400).json({ error: 'product_id must be a positive integer' });
  }
  if (quantity === undefined || !Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).json({ error: 'quantity must be a non-negative integer' });
  }

  const cart = await updateItem(req.user.id, product_id, quantity);
  res.status(200).json(cart);
}

export async function clearCartHandler(req, res) {
  await clearCart(req.user.id);
  res.status(204).send();
}
