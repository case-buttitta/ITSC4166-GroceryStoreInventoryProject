import { getCart, addItem, updateItem, clearCart } from '../services/cartService.js';

export async function getCartHandler(req, res) {
  const cart = await getCart(req.user.id);
  res.status(200).json(cart);
}

export async function addCartItemHandler(req, res) {
  const { product_id, quantity } = req.body;
  const cart = await addItem(req.user.id, product_id, quantity);
  res.status(201).json(cart);
}

export async function updateCartItemHandler(req, res) {
  const product_id = req.params.product_id;
  const { quantity } = req.body;
  const cart = await updateItem(req.user.id, product_id, quantity);
  res.status(200).json(cart);
}

export async function clearCartHandler(req, res) {
  await clearCart(req.user.id);
  res.status(204).send();
}
