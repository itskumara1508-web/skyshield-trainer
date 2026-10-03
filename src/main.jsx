import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { SimulatorProvider } from './context/SimulatorContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <AuthProvider>
        <SimulatorProvider>
          <App />
        </SimulatorProvider>
      </AuthProvider>
    </SettingsProvider>
  </React.StrictMode>,
);
