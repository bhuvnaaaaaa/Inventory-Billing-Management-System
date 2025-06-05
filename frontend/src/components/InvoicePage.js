import React from 'react';
import axios from 'axios';

function InvoicePage({ cart, calculateTotal, clearCart, addToCart, removeFromCart, fetchProducts }) {
  const handlePrint = async () => {
    const printContents = document.getElementById('invoiceSection').innerHTML;
    const originalContents = document.body.innerHTML;

    // Update stock on backend
    try {
      const response = await axios.post('http://localhost:5000/api/update-stock', { cart });
      if (response.status === 200) {
        console.log('Stock updated successfully');
      } else {
        console.error('Stock update failed:', response);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }

    // Print invoice
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();

    // Clear cart and fetch updated product data
    clearCart();
    fetchProducts();
  };

  const incrementQuantity = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    addToCart(updatedCart);
  };

  const decrementQuantity = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      addToCart(updatedCart);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', marginBottom: '40px' }}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price (₹)</th>
              <th>Quantity</th>
              <th>Subtotal (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td>{item.product_name}</td>
                <td>{item.price}</td>
                <td>
                  <button onClick={() => decrementQuantity(index)}>-</button>
                  {item.quantity}
                  <button onClick={() => incrementQuantity(index)}>+</button>
                </td>
                <td>{item.price * item.quantity}</td>
                <td>
                  <button onClick={() => removeFromCart(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div id="invoiceSection" style={{ padding: '20px', border: '1px solid black' }}>
        <h2>Invoice</h2>
        <p>Date: {new Date().toLocaleDateString()}</p>
        {cart.length === 0 ? (
          <p>No items to bill</p>
        ) : (
          <table border="1" cellPadding="10" style={{ width: '100%', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Subtotal (₹)</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <h3>Total Amount: ₹{calculateTotal()}</h3>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={handlePrint} style={{ marginRight: '10px' }}>
          Print Invoice
        </button>
        <button onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}

export default InvoicePage;
