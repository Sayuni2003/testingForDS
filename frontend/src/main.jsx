/**
 * src/main.jsx — React App Entry Point
 *
 * PURPOSE:
 *   Bootstraps the React application by mounting the root <App /> component
 *   into the <div id="root"> element defined in index.html.
 *   This is the standard Vite + React entry point.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
