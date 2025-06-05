import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemList.css';
import AddProductForm from './AddProductForm'; // Import AddProductForm

const ItemList = ({ addToCart }) => { // Add addToCart as a prop
  const [items, setItems] = useState([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // State to manage loading

  // Fetch products
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        if (response.data && Array.isArray(response.data.products)) {
          setItems(response.data.products); // Set products if data structure is correct
        } else {
          console.error('Invalid data structure');
        }
        setLoading(false); // Data loaded, set loading to false
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false); // In case of error, stop loading
      }
    };
    fetchItems();
  }, []);

  const handleAddProduct = (newProduct) => {
    setItems((prevItems) => [...prevItems, newProduct]);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/delete-product/${productId}`);
      if (response.status === 200) {
        setItems(items.filter(item => item.product_id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateProduct = async (productId, updatedProduct) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/update-product/${productId}`, updatedProduct);
      if (response.status === 200) {
        setItems(items.map(item => (item.product_id === productId ? { ...item, ...updatedProduct } : item)));
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Handle search filter
  const filteredItems = items && items.filter(item => 
    item.product_name && item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding to cart and updating stock quantity
  const handleAddToCart = (product) => {
    if (product.stock_quantity > 0) {
      // Decrease stock quantity in the product list
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === product.product_id
            ? { ...item, stock_quantity: item.stock_quantity - 1 }
            : item
        )
      );

      // Call the addToCart function passed as a prop
      addToCart(product);
    } else {
      alert('Out of stock!');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div className="item-list-container">
      <div className="item-list-header">
        <h2>Product List</h2>
        <button onClick={() => setIsAddProductOpen(!isAddProductOpen)}>
          {isAddProductOpen ? 'Cancel' : 'Add Product'}
        </button>
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isAddProductOpen && <AddProductForm onAdd={handleAddProduct} />}

      <table className="item-list-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Actions</th>
            <th>Add to Cart</th> {/* Add column for the cart button */}
          </tr>
        </thead>
        <tbody>
          {filteredItems && filteredItems.map(item => (
            <tr key={item.product_id}>
              <td>{item.product_name}</td>
              <td>{item.price}</td>
              <td>{item.stock_quantity}</td>
              <td>
                <button onClick={() => handleDeleteProduct(item.product_id)}>Delete</button>
                <button onClick={() => handleUpdateProduct(item.product_id, {
                  product_name: prompt('Enter new product name', item.product_name),
                  price: parseFloat(prompt('Enter new price', item.price)),
                  stock_quantity: parseInt(prompt('Enter new stock quantity', item.stock_quantity)),
                })}>
                  Update
                </button>
              </td>
              <td>
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button> {/* Add to cart button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;
