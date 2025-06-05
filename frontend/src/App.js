import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ItemList from './components/ItemList'; // your inventory listing
import AddProductForm from './components/AddProductForm'; // form to add new product
import InvoicePage from './components/InvoicePage'; // invoice generator
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product) => {
    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex((item) => item.product_id === product.product_id);

    if (existingProductIndex !== -1) {
      // If the product is already in the cart, increase its quantity
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // If the product is not in the cart, add it with quantity 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    // Update the stock quantity in the products list
    const updatedProducts = products.map((item) =>
      item.product_id === product.product_id
        ? { ...item, stock_quantity: item.stock_quantity - 1 }
        : item
    );
    setProducts(updatedProducts);
  };

  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <nav style={{ padding: '10px', backgroundColor: '#eee' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/add-product" style={{ marginRight: '10px' }}>Add Product</Link>
        <Link to="/invoice">Invoice</Link>
      </nav>

      <Routes>
        {/* Home page shows inventory + cart */}
        <Route
          path="/"
          element={
            <>
              <ItemList products={products} fetchProducts={fetchProducts} addToCart={addToCart} />
              
              <div style={{ padding: '20px' }}>
                <h2>Cart</h2>
                {cart.length === 0 ? (
                  <p>No items in cart</p>
                ) : (
                  <table border="1" cellPadding="10" style={{ width: '100%', marginBottom: '20px' }}>
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Price (₹)</th>
                        <th>Quantity</th>
                        <th>Subtotal (₹)</th>
                        <th>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, index) => (
                        <tr key={index}>
                          <td>{item.product_name}</td>
                          <td>{item.price}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price * item.quantity}</td>
                          <td>
                            <button onClick={() => removeFromCart(index)}>Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {cart.length > 0 && (
                  <>
                    <h3>Total: ₹{calculateTotal()}</h3>
                    <Link to="/invoice">
                      <button>Generate Invoice</button>
                    </Link>
                  </>
                )}
              </div>
            </>
          }
        />

        {/* Add product page */}
        <Route
          path="/add-product"
          element={<AddProductForm fetchProducts={fetchProducts} />}
        />

        {/* Invoice page */}
        <Route
          path="/invoice"
          element={
            <InvoicePage
              cart={cart}
              calculateTotal={calculateTotal}
              clearCart={clearCart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              fetchProducts={fetchProducts}
            />

          }
        />
      </Routes>
    </Router>
  );
}

export default App;
