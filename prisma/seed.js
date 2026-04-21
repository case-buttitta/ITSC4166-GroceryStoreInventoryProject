import bcrypt from 'bcrypt';
import 'dotenv/config';
import prisma from '../src/config/db.js';

try {
  // Clear all tables and reset auto-increment IDs
  await prisma.$executeRaw`TRUNCATE "OrderItem", "Order", "CartItem", "Cart", "Product", "User" RESTART IDENTITY CASCADE`;

  // ─── Users ───────────────────────────────────────────────────────────────
  // At least one admin and one regular user, all with known credentials.

  const adminHash    = await bcrypt.hash('admin123', 10);
  const jane_hash    = await bcrypt.hash('password123', 10);
  const john_hash    = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Store Admin',
      email: 'admin@grocery.com',
      password_hash: adminHash,
      role: 'admin',
      created_at: new Date(),
    },
  });

  const jane = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane@grocery.com',
      password_hash: jane_hash,
      created_at: new Date(),
    },
  });

  const john = await prisma.user.create({
    data: {
      name: 'John Smith',
      email: 'john@grocery.com',
      password_hash: john_hash,
      created_at: new Date(),
    },
  });

  console.log('✓ Users seeded');

  // ─── Products ────────────────────────────────────────────────────────────

  const [blueberries, strawberries, milk, bread, eggs] =
    await Promise.all([
      prisma.product.create({
        data: {
          product_name: 'Blueberries',
          upc: '4049',
          price: 4.29,
          stock_quantity: 100,
          reorder_threshold: 10,
          warehouse_location: 'A-01',
        },
      }),
      prisma.product.create({
        data: {
          product_name: 'Strawberries',
          upc: '3085',
          price: 3.49,
          stock_quantity: 75,
          reorder_threshold: 15,
          warehouse_location: 'B-07',
        },
      }),
      prisma.product.create({
        data: {
          product_name: 'Organic Whole Milk',
          upc: '1122',
          price: 5.99,
          stock_quantity: 50,
          reorder_threshold: 8,
          warehouse_location: 'C-02',
        },
      }),
      prisma.product.create({
        data: {
          product_name: 'Whole Wheat Bread',
          upc: '3344',
          price: 2.99,
          stock_quantity: 30,
          reorder_threshold: 5,
          warehouse_location: 'D-04',
        },
      }),
      prisma.product.create({
        data: {
          product_name: 'Free Range Eggs (12-pack)',
          upc: '5566',
          price: 6.49,
          stock_quantity: 60,
          reorder_threshold: 12,
          warehouse_location: 'E-03',
        },
      }),
    ]);

  console.log('✓ Products seeded');

  // ─── Carts ───────────────────────────────────────────────────────────────
  // One cart per user. Jane's cart has items; the others are empty.

  const janeCart = await prisma.cart.create({
    data: {
      user_id: jane.id,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  await prisma.cart.createMany({
    data: [
      { user_id: admin.id, created_at: new Date(), updated_at: new Date() },
      { user_id: john.id,  created_at: new Date(), updated_at: new Date() },
    ],
  });

  // Jane has two products in her cart (useful for testing GET /cart and checkout)
  await prisma.cartItem.createMany({
    data: [
      { cart_id: janeCart.id, product_id: blueberries.id,  quantity: 2 },
      { cart_id: janeCart.id, product_id: strawberries.id, quantity: 1 },
    ],
  });

  console.log('✓ Carts seeded');

  // ─── Orders ──────────────────────────────────────────────────────────────
  // Jane has two past orders; John has one.
  // Useful for testing ownership (403 when wrong user) and admin list/detail.

  // Jane – order 1: Blueberries x3, Milk x1  →  total = 3×4.29 + 1×5.99 = 18.86
  const janeOrder1 = await prisma.order.create({
    data: {
      user_id: jane.id,
      status: 'delivered',
      total: 18.86,
      created_at: new Date('2025-01-15T10:30:00Z'),
    },
  });
  await prisma.orderItem.createMany({
    data: [
      { order_id: janeOrder1.id, product_id: blueberries.id, quantity: 3, unit_price: 4.29 },
      { order_id: janeOrder1.id, product_id: milk.id,        quantity: 1, unit_price: 5.99 },
    ],
  });

  // Jane – order 2: Strawberries x2, Bread x1  →  total = 2×3.49 + 1×2.99 = 9.97
  const janeOrder2 = await prisma.order.create({
    data: {
      user_id: jane.id,
      status: 'shipped',
      total: 9.97,
      created_at: new Date('2025-01-16T08:45:00Z'),
    },
  });
  await prisma.orderItem.createMany({
    data: [
      { order_id: janeOrder2.id, product_id: strawberries.id, quantity: 2, unit_price: 3.49 },
      { order_id: janeOrder2.id, product_id: bread.id,        quantity: 1, unit_price: 2.99 },
    ],
  });

  // John – order 1: Eggs x2  →  total = 2×6.49 = 12.98
  const johnOrder1 = await prisma.order.create({
    data: {
      user_id: john.id,
      status: 'pending',
      total: 12.98,
      created_at: new Date('2025-01-17T14:00:00Z'),
    },
  });
  await prisma.orderItem.createMany({
    data: [
      { order_id: johnOrder1.id, product_id: eggs.id, quantity: 2, unit_price: 6.49 },
    ],
  });

  console.log('✓ Orders seeded');

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Seed complete — test credentials
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Admin  │ admin@grocery.com  │ admin123
 User 1 │ jane@grocery.com   │ password123
 User 2 │ john@grocery.com   │ password123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Jane's cart : Blueberries x2, Strawberries x1
 Jane's orders: #${janeOrder1.id} (delivered), #${janeOrder2.id} (shipped)
 John's orders: #${johnOrder1.id} (pending)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

} catch (error) {
  console.error('Seed failed:', error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
