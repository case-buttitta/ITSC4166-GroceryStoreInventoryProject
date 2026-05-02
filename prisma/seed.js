import bcrypt from 'bcrypt';
import prisma from '../src/config/db.js';

try {
  await prisma.$executeRaw`TRUNCATE "OrderItem", "Order", "CartItem", "Cart", "Product", "User" RESTART IDENTITY CASCADE`;

  const admin = await prisma.user.create({
    data: {
      name: 'Store Admin',
      email: 'admin@grocery.com',
      password_hash: await bcrypt.hash('admin123', 10),
      role: 'admin',
      created_at: new Date(),
    },
  });

  const jane = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane@grocery.com',
      password_hash: await bcrypt.hash('password123', 10),
      created_at: new Date(),
    },
  });

  const john = await prisma.user.create({
    data: {
      name: 'John Smith',
      email: 'john@grocery.com',
      password_hash: await bcrypt.hash('password123', 10),
      created_at: new Date(),
    },
  });

  console.log('Users seeded');


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

  console.log('Products seeded');


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

  await prisma.cartItem.createMany({
    data: [
      { cart_id: janeCart.id, product_id: blueberries.id,  quantity: 2 },
      { cart_id: janeCart.id, product_id: strawberries.id, quantity: 1 },
    ],
  });

  console.log('Carts seeded');

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

  console.log('Orders seeded');

} catch (error) {
  console.error('Seed failed:', error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
