import {
  getAllOrdersService,
  getOrderByIdService,
  createOrderService,
  updateOrderStatusService,
  deleteOrderService,
} from '../services/orderService.js';

export async function getAllOrdersHandler(req, res) {
  const orders = await getAllOrdersService();
  res.status(200).json(orders);
}

export async function getOrderByIdHandler(req, res) {
  const order = await getOrderByIdService(req.params.id, req.user);
  res.status(200).json(order);
}

export async function createOrderHandler(req, res) {
  const order = await createOrderService(req.user.id);
  res.status(201).json(order);
}

export async function updateOrderStatusHandler(req, res) {
  const order = await updateOrderStatusService(req.params.id, req.body.status);
  res.status(200).json(order);
}

export async function deleteOrderHandler(req, res) {
  await deleteOrderService(req.params.id);
  res.status(204).send();
}
