// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';


// استيراد ملف التنسيقات العام (index.css) ثم App.css
import './index.css';
import './App.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

// إنشاء الجذر ورندرة التطبيق
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// قياس أداء التطبيق (اختياري)
reportWebVitals();
