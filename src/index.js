import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure this file exists in src/
import App from './App'; // <-- IMPORTANT: No .js or .jsx extension here! Vite handles it.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);