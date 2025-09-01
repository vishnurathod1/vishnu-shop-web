const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Get all products
router.get('/', (req, res) => {
  try {
    const productsData = fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8');
    const products = JSON.parse(productsData);
    
    // Apply filters if provided
    let filteredProducts = [...products];
    
    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }
    
    // Search filter
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Price filter
    if (req.query.priceRange) {
      const [min, max] = req.query.priceRange.split('-').map(Number);
      filteredProducts = filteredProducts.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }
    
    // Sorting
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => b.id - a.id);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
      }
    }
    
    res.json({
      success: true,
      data: filteredProducts,
      count: filteredProducts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading products',
      error: error.message
    });
  }
});

// Get single product by ID
router.get('/:id', (req, res) => {
  try {
    const productsData = fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8');
    const products = JSON.parse(productsData);
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading product',
      error: error.message
    });
  }
});

// Get products by category
router.get('/category/:category', (req, res) => {
  try {
    const productsData = fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8');
    const products = JSON.parse(productsData);
    const categoryProducts = products.filter(product => 
      product.category.toLowerCase() === req.params.category.toLowerCase()
    );
    
    res.json({
      success: true,
      data: categoryProducts,
      count: categoryProducts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading category products',
      error: error.message
    });
  }
});

module.exports = router;
