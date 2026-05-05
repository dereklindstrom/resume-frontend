import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { Analytics } from '@vercel/analytics/react';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Analytics /> {/* This must be used as a tag, inside the tree! */}
    </BrowserRouter>
  </React.StrictMode>
);