// routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../server'); // Import the database connection

// Create Product Route
router.post('/add-product', (req, res) => {
    const { product_name, price, stock_quantity, category, supplier_id } = req.body;
    const query = `INSERT INTO Products (product_name, price, stock_quantity, category, supplier_id) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [product_name, price, stock_quantity, category, supplier_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error adding product.");
        }
        res.status(201).send("Product added successfully!");
    });
});

// Get All Products Route
router.get('/products', (req, res) => {
    const query = "SELECT * FROM Products";
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching products.");
        }
        res.status(200).json(results);
    });
});

// Update Product Route
router.put('/update-product/:id', (req, res) => {
    const { id } = req.params;
    const { product_name, price, stock_quantity, category } = req.body;
    const query = `UPDATE Products SET product_name = ?, price = ?, stock_quantity = ?, category = ? WHERE product_id = ?`;
    db.query(query, [product_name, price, stock_quantity, category, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error updating product.");
        }
        res.status(200).send("Product updated successfully!");
    });
});

// Delete Product Route
router.delete('/delete-product/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM Products WHERE product_id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting product.");
        }
        res.status(200).send("Product deleted successfully!");
    });
});

module.exports = router;
