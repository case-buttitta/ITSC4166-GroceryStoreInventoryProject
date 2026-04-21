import prisma from '../config/db.js';

export async function getAllOrders() {
  return prisma.order.findMany({
    select: { id: true, user_id: true, status: true, total: true, created_at: true },
  });
}

export async function getOrderById(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      order_items: {
        include: { product: true },
      },
    },
  });
  if (!order) return null;

  return {
    id: order.id,
    user_id: order.user_id,
    status: order.status,
    total: parseFloat(order.total),
    created_at: order.created_at,
    items: order.order_items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product.product_name,
      quantity: item.quantity,
      unit_price: parseFloat(item.unit_price),
    })),
  };
}

export async function createOrderFromCart(userId, cartItems, total) {
  const orderId = await prisma.$transaction(async (transaction) => { //all in one with multiple prisma commands
    const order = await transaction.order.create({
      data: {
        user_id: userId,
        status: 'pending',
        total,
        created_at: new Date(),
      },
    });

    await transaction.orderItem.createMany({
      data: cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    });

    const cart = await transaction.cart.findFirst({ where: { user_id: userId } });
    await transaction.cartItem.deleteMany({ where: { cart_id: cart.id } });
    await transaction.cart.update({
      where: { id: cart.id },
      data: { updated_at: new Date() },
    });

    return order.id;
  });

  return getOrderById(orderId);
}

export async function updateOrderStatus(id, status) {
  try {
    return await prisma.order.update({
      where: { id },
      data: { status },
      select: { id: true, user_id: true, status: true, total: true, created_at: true },
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}

export async function removeOrder(id) {
  try {
    return await prisma.$transaction(async (transaction) => {
      await transaction.orderItem.deleteMany({ where: { order_id: id } });
      return transaction.order.delete({ where: { id } });
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
