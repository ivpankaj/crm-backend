// routes/productRoutes.js
import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/product_controller.js';


const router = express.Router();


router.post('/products/create',createProduct);
router.get('/products/getall', getAllProducts);
router.get('/products/get/:id', getProductById);
router.put('/products/update/:id', updateProduct);
router.delete('/products/delete/:id', deleteProduct);

export default router;
