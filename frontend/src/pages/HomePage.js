import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Inventory & Billing System</h1>
      <p>Manage your inventory, create bills, and track sales easily!</p>

      <div style={{ marginTop: '30px' }}>
        <Link to="/products">
          <button style={{ marginRight: '20px' }}>Manage Products</button>
        </Link>
        <Link to="/billing">
          <button>Billing</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

