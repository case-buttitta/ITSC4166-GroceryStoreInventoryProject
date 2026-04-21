import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService.js';

export async function getAllProductsHandler(req, res) {
  const isAdmin = req.user?.role === 'admin';
  const products = await getAllProducts(isAdmin);
  res.status(200).json(products);
}

export async function getProductByIdHandler(req, res) {
  const isAdmin = req.user?.role === 'admin';
  const product = await getProductById(req.params.id, isAdmin);
  res.status(200).json(product);
}

export async function createProductHandler(req, res) {
  const { product_name, upc, price, stock_quantity, reorder_threshold, warehouse_location } = req.body;
  const newProduct = await createProduct({ product_name, upc, price, stock_quantity, reorder_threshold, warehouse_location });
  res.status(201).json(newProduct);
}

export async function updateProductHandler(req, res) {
  const { product_name, upc, price, stock_quantity, reorder_threshold, warehouse_location } = req.body;
  const updatedData = JSON.parse(JSON.stringify({ product_name, upc, price, stock_quantity, reorder_threshold, warehouse_location }));

  const updatedProduct = await updateProduct(req.params.id, updatedData);
  res.status(200).json(updatedProduct);
}

export async function deleteProductHandler(req, res) {
  await deleteProduct(req.params.id);
  res.status(204).send();
}
