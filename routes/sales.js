import express from 'express';
import { createSale, deleteSale, getAllSales, getSaleById, getSalesByProductId, getSalesBySalesPersonId, updateSale } from '../controllers/sales.js';

const router = express.Router();

router.post('/sales/create/:sales_personId', createSale);

router.get('/sales/getall', getAllSales);

router.get('/sales/get/:id', getSaleById);

router.put('/sales/update/:id', updateSale);

router.delete('/sales/delete/:id', deleteSale);

router.get('/sales/sales_person/:sales_personId', getSalesBySalesPersonId);

router.get('/sales/product/:productId', getSalesByProductId);

export default router;

