import React, { useState } from 'react';
import axios from 'axios';

const AddProductForm = ({ onAdd }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [error, setError] = useState(''); // State for error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      const response = await axios.post('http://localhost:5000/api/add-product', {
        product_name: productName,
        price: parseFloat(price),
        stock_quantity: parseInt(stockQuantity),
      });

      if (response.status === 201) {
        const newProduct = response.data.product;
        onAdd(newProduct);
        setProductName('');
        setPrice('');
        setStockQuantity('');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.'); // Set error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}
      <div>
        <label>Product Name: </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label>Price: </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <br />
      <div>
        <label>Stock Quantity: </label>
        <input
          type="number"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          required
        />
      </div>
      <br />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm;