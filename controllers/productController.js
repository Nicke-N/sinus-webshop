const Product = require("../models/productModels");

module.exports = {
  create: async (req, res) => {
    try {
      const product = await Product.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
  getAll: async (req, res) => {
    try {
      const products = await Product.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
  get: async (req, res) => {
    try {
      const product = await Product.getProduct(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
  update: async (req, res) => {
  
    try {
      const product = await Product.updateProduct(req.params.id, req.body.newProduct);
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
  delete: async (req, res) => {
    try {
      const product = await Product.deleteProduct(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
  deleteAll: async (req, res) => {
    try {
      const products = await Product.deleteAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
};
