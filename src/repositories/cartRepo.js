import prisma from '../config/db.js';

async function fetchFormattedCart(userId) {
  const cart = await prisma.cart.findFirst({
    where: { user_id: userId },
    include: {
      cart_items: {
        include: { product: true },
      },
    },
  });
  if (!cart) return null;

  const items = cart.cart_items.map((item) => ({
    product_id: item.product_id,
    product_name: item.product.product_name,
    quantity: item.quantity,
    unit_price: parseFloat(item.product.price),
    subtotal: parseFloat((item.quantity * parseFloat(item.product.price)).toFixed(2)),
  }));

  const total = parseFloat(items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2));

  return {
    id: cart.id,
    user_id: cart.user_id,
    updated_at: cart.updated_at,
    items,
    total,
  };
}

export async function getCartByUserId(userId) { //wrapper for private function above
  return fetchFormattedCart(userId);
}

export async function addOrIncrementItem(userId, productId, quantity) {
  const cart = await prisma.cart.findFirst({ where: { user_id: userId } });
  const selected_item = await prisma.cartItem.findFirst({
    where: { cart_id: cart.id, product_id: productId },
  });

  if (selected_item) {
    await prisma.cartItem.update({
      where: { id: selected_item.id },
      data: { quantity: selected_item.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cart_id: cart.id, product_id: productId, quantity },
    });
  }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { updated_at: new Date() },
  });

  return fetchFormattedCart(userId);
}

export async function updateItemQuantity(userId, productId, quantity) {
  const cart = await prisma.cart.findFirst({ where: { user_id: userId } });
  const selected_item = await prisma.cartItem.findFirst({
    where: { cart_id: cart.id, product_id: productId },
  });

  if (!selected_item) return null;

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: selected_item.id } });
  } else {
    await prisma.cartItem.update({ where: { id: selected_item.id }, data: { quantity } });
  }

  await prisma.cart.update({
    where: { id: cart.id },
    data: { updated_at: new Date() },
  });

  return fetchFormattedCart(userId);
}

export async function clearCartItems(userId) {
  const cart = await prisma.cart.findFirst({ where: { user_id: userId } });
  await prisma.cartItem.deleteMany({ where: { cart_id: cart.id } });
  await prisma.cart.update({
    where: { id: cart.id },
    data: { updated_at: new Date() },
  });
}
