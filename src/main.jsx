import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Turning the lights and Tailwind back on!
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);