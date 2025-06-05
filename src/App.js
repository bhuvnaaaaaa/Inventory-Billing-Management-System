import React, { useEffect } from 'react';
import axios from 'axios';
import api from './services/api';  // Make sure this is correct

function App() {
  useEffect(() => {
    api.get('/')
      .then(response => {
        console.log(response.data); // Should log: "Backend server is running!"
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);
  

  return (
    <div>
      <h1>Inventory Billing System</h1>
      <p>Check your browser console for the server response.</p>
    </div>
  );
}

export default App;

