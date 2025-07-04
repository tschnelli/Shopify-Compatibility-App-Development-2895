import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import Dashboard from './components/Dashboard';
import ProductCompatibilityWidget from './components/ProductCompatibilityWidget';
import { CompatibilityProvider } from './context/CompatibilityContext';
import enTranslations from '@shopify/polaris/locales/en.json';

function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <CompatibilityProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/widget/:productId" element={<ProductCompatibilityWidget />} />
          </Routes>
        </Router>
      </CompatibilityProvider>
    </AppProvider>
  );
}

export default App;