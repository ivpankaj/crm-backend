import Product from '../models/product.js';
import Sales from '../models/Sales.js';
import Employee from '../models/employee.js';
export const createSale = async (req, res) => {
  try {
    const {
      productName, productCategory, salesAmount, salesDate, quantitySold,
      customerName, customerEmail, customerPhone, isCompleted, comments, productId,
    } = req.body;
    const {sales_personId} = req.params
    const Employee = await Employee.findByPk(sales_personId);
    if (!Employee) {
      return res.status(404).json({ error: 'Sales person not found' });
    }
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const newSale = await Sales.create({
      productName, productCategory, salesAmount, salesDate, quantitySold,
      customerName, customerEmail, customerPhone, isCompleted, comments, productId, sales_personId
    });
    Employee.totalSales += salesAmount;
    await Employee.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ error: 'Error creating sale', details: error.message });
  }
};
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sales.findAll({
    });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sales', details: error.message });
  }
};
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findByPk(req.params.id, {
    });
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sale', details: error.message });
  }
};

export const updateSale = async (req, res) => {
  try {
    const sale = await Sales.findByPk(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    const updatedSale = await sale.update(req.body);
    res.status(200).json(updatedSale);
  } catch (error) {
    res.status(500).json({ error: 'Error updating sale', details: error.message });
  }
};
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sales.findByPk(req.params.id);
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    await sale.destroy();
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting sale', details: error.message });
  }
};
export const filterSales = async (req, res) => {
  const { productCategory, salesDate, isCompleted } = req.query;
  const filters = {};
  if (productCategory) filters.productCategory = productCategory;
  if (salesDate) filters.salesDate = salesDate;
  if (isCompleted) filters.isCompleted = isCompleted === 'true';
  try {
    const sales = await Sales.findAll({ where: filters });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error filtering sales', details: error.message });
  }
}; 
export const getSalesBySalesPersonId = async (req, res) => {
  try {
    const { sales_personId } = req.params;
    const Employee = await Employee.findByPk(sales_personId);
    if (!Employee) {
      return res.status(404).json({ error: 'Sales person not found' });
    }
    const sales = await Sales.findAll({
      where: { sales_personId },
    });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sales by sales person ID', details: error.message });
  }
};
export const getSalesByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const sales = await Sales.findAll({
      where: { productId },
    });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sales by product ID', details: error.message });
  }
};