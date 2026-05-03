import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. IMPORT THE BROWSER ROUTER
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. WRAP YOUR APP COMPONENT */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)