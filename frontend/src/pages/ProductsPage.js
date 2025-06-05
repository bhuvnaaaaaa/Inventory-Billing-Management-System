import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  // Fetch Products from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Add to Cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const productInCart = prevCart.find(item => item.product_id === product.product_id);
      if (productInCart) {
        // Increase quantity if product is already in the cart
        return prevCart.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Otherwise, add a new product to the cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from Cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.product_id !== productId));
  };

  // Increment item quantity in cart
  const incrementQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrement item quantity in cart
  const decrementQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map(item =>
        item.product_id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <h1>Product List</h1>
      <div>
        {products.map((product) => (
          <div key={product.product_id}>
            <h3>{product.product_name}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Stock Quantity: {product.stock_quantity}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <h2>Cart</h2>
      <div>
        {cart.length === 0 ? (
          <p>No items in the cart</p>
        ) : (
          cart.map((item) => (
            <div key={item.product_id}>
              <p>{item.product_name}</p>
              <p>₹{item.price} x {item.quantity}</p>
              <button onClick={() => incrementQuantity(item.product_id)}>+</button>
              <button onClick={() => decrementQuantity(item.product_id)}>-</button>
              <button onClick={() => removeFromCart(item.product_id)}>Remove</button>
            </div>
          ))
        )}
      </div>

      <h3>Total: ₹{calculateTotal()}</h3>
    </div>
  );
};

export default ProductsPage;
