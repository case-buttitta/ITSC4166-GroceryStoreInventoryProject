import {
  getAllOrdersService,
  getOrderByIdService,
  createOrderService,
  updateOrderStatusService,
  deleteOrderService,
} from '../services/orderService.js';

function isPositiveInt(val) {
  return Number.isInteger(val) && val > 0;
}

export async function getAllOrdersHandler(req, res) {
  const orders = await getAllOrdersService();
  res.status(200).json(orders);
}

export async function getOrderByIdHandler(req, res) {
  const id = parseInt(req.params.id);
  if (!isPositiveInt(id)) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }
  const order = await getOrderByIdService(id, req.user);
  res.status(200).json(order);
}

export async function createOrderHandler(req, res) {
  const order = await createOrderService(req.user.id);
  res.status(201).json(order);
}

export async function updateOrderStatusHandler(req, res) {
  const id = parseInt(req.params.id);
  if (!isPositiveInt(id)) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }
  const order = await updateOrderStatusService(id, req.body.status);
  res.status(200).json(order);
}

export async function deleteOrderHandler(req, res) {
  const id = parseInt(req.params.id);
  if (!isPositiveInt(id)) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }
  await deleteOrderService(id);
  res.status(204).send();
}
