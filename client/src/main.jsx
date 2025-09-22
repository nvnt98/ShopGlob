// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppState from './context/AppState.jsx'

import 'bootstrap/dist/css/bootstrap.min.css';      // ✅ styles
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ✅ JS for toggler, dropdown, modals


createRoot(document.getElementById('root')).render(
 <AppState>
  <App/>
 </AppState>,
)
 