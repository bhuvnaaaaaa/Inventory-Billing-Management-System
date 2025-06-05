const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
  }
});




db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
  } else {
    console.log('Connected to database.');
  }
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Add Product Route
app.post('/api/add-product', (req, res) => {
  const { product_name, price, stock_quantity } = req.body;
  const query = 'INSERT INTO products (product_name, price, stock_quantity) VALUES (?, ?, ?)';
  db.query(query, [product_name, price, stock_quantity], (err, result) => {
    if (err) {
      console.error('Error adding product: ', err);
      res.status(500).json({ error: 'Failed to add product' });
    } else {
      res.status(201).json({
        message: 'Product added successfully',
        product: { product_id: result.insertId, product_name, price, stock_quantity }
      });
    }
  });
});

// GET all products
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products: ', err);
      res.status(500).json({ error: 'Failed to fetch products' });
    } else {
      res.status(200).json({ products: results });
    }
  });
});

// Update product
app.put('/api/update-product/:id', (req, res) => {
  const { id } = req.params;
  const { product_name, price, stock_quantity } = req.body;
  const query = 'UPDATE products SET product_name = ?, price = ?, stock_quantity = ? WHERE product_id = ?';
  db.query(query, [product_name, price, stock_quantity, id], (err, result) => {
    if (err) {
      console.error('Error updating product: ', err);
      res.status(500).json({ error: 'Failed to update product' });
    } else {
      res.status(200).json({ message: 'Product updated successfully' });
    }
  });
});

// Delete product
app.delete('/api/delete-product/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE product_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting product: ', err);
      res.status(500).json({ error: 'Failed to delete product' });
    } else {
      res.status(200).json({ message: 'Product deleted successfully' });
    }
  });
});

// Update stock after checkout
app.post('/api/update-stock', (req, res) => {
  const { cart } = req.body;

  const updateQueries = cart.map(item => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?';
      db.query(query, [item.quantity, item.product_id], (err, result) => {
        if (err) {
          console.error('Error updating stock: ', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  Promise.all(updateQueries)
    .then(() => {
      res.status(200).json({ message: 'Stock updated successfully' });
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to update stock' });
    });
});


// Update stock after checkout
app.post('/api/update-stock', (req, res) => {
  const cart = req.body.cart;

  const updatePromises = cart.map((item) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?';
      db.query(query, [item.quantity, item.product_id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  Promise.all(updatePromises)
    .then(() => {
      res.status(200).json({ message: 'Stock updated successfully' });
    })
    .catch((error) => {
      console.error('Error updating stock:', error);
      res.status(500).json({ error: 'Failed to update stock' });
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
