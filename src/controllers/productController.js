import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService.js';

function isPositiveInt(val) {
  return Number.isInteger(val) && val > 0;
}

export async function getAllProductsHandler(req, res) {
  const isAdmin = req.user?.role === 'admin';
  const products = await getAllProducts(isAdmin);
  res.status(200).json(products);
}

export async function getProductByIdHandler(req, res) {
  const id = parseInt(req.params.id);
  if (!isPositiveInt(id)) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }
  const isAdmin = req.user?.role === 'admin';
  const product = await getProductById(id, isAdmin);
  res.status(200).json(product);
}

export async function createProductHandler(req, res) {
  const {
    product_name,
    upc,
    price,
    stock_quantity,
    reorder_threshold,
    warehouse_location,
  } = req.body;

  if (!product_name || !upc || price === undefined || stock_quantity === undefined) {
    return res.status(400).json({ error: 'product_name, upc, price, and stock_quantity are required' });
  }

  const newProduct = await createProduct({
    product_name,
    upc,
    price,
    stock_quantity,
    reorder_threshold,
    warehouse_location,
  });
  res.status(201).json(newProduct);
}

export async function updateProductHandler(req, res) {
  const id = parseInt(req.params.id);
  if (!isPositiveInt(id)) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }

  const {
    product_name,
    upc,
    price,
    stock_quantity,
    reorder_threshold,
    warehouse_location,
  } = req.body;

  const updatedData = {};
  if (product_name !== undefined) updatedData.product_name = product_name;
  if (upc !== undefined) updatedData.upc = upc;
  if (price !== undefined) updatedData.price = price;
  if (stock_quantity !== undefined) updatedData.stock_quantity = stock_quantity;
  if (reorder_threshold !== undefined) updatedData.reorder_threshold = reorder_threshold;
  if (warehouse_location !== undefined) updatedData.warehouse_location = warehouse_location;

  if (Object.keys(updatedData).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }

  const updatedProduct = await updateProduct(id, updatedData);
  res.status(200).json(updatedProduct);
}

export async function deleteProductHandler(req, res) {
  const id = parseInt(req.params.id);
  if (!isPositiveInt(id)) {
    return res.status(400).json({ error: 'ID must be a positive integer' });
  }
  await deleteProduct(id);
  res.status(204).send();
}
