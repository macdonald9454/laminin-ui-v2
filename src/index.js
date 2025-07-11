// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // ✅ Correct global styles import

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

