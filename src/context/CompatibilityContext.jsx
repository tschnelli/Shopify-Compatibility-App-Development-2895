import React, { createContext, useContext, useState, useEffect } from 'react';

const CompatibilityContext = createContext();

export const useCompatibility = () => {
  const context = useContext(CompatibilityContext);
  if (!context) {
    throw new Error('useCompatibility must be used within a CompatibilityProvider');
  }
  return context;
};

export const CompatibilityProvider = ({ children }) => {
  const [compatibilityData, setCompatibilityData] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({
    showMissingProducts: false,
    enableWidget: true,
    widgetTitle: 'Compatible Products',
    widgetPosition: 'below-description'
  });
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('compatibility-data');
    const savedProducts = localStorage.getItem('shopify-products');
    const savedSettings = localStorage.getItem('compatibility-settings');
    
    if (savedData) {
      setCompatibilityData(JSON.parse(savedData));
    }
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveCompatibilityData = (data) => {
    setCompatibilityData(data);
    localStorage.setItem('compatibility-data', JSON.stringify(data));
  };

  const saveProducts = (productData) => {
    setProducts(productData);
    localStorage.setItem('shopify-products', JSON.stringify(productData));
  };

  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('compatibility-settings', JSON.stringify(updatedSettings));
  };

  const getCompatibleProducts = (productId) => {
    const compatibility = compatibilityData.find(item => item.productId === productId);
    if (!compatibility) return [];

    return compatibility.compatibleProducts.map(compatibleId => {
      const product = products.find(p => p.id === compatibleId);
      return {
        id: compatibleId,
        exists: !!product,
        product: product || null
      };
    }).filter(item => settings.showMissingProducts || item.exists);
  };

  const getMissingProducts = () => {
    const allCompatibleIds = new Set();
    compatibilityData.forEach(item => {
      item.compatibleProducts.forEach(id => allCompatibleIds.add(id));
    });

    const missingProducts = [];
    allCompatibleIds.forEach(id => {
      if (!products.find(p => p.id === id)) {
        missingProducts.push(id);
      }
    });

    return missingProducts;
  };

  const value = {
    compatibilityData,
    products,
    settings,
    loading,
    setLoading,
    saveCompatibilityData,
    saveProducts,
    updateSettings,
    getCompatibleProducts,
    getMissingProducts
  };

  return (
    <CompatibilityContext.Provider value={value}>
      {children}
    </CompatibilityContext.Provider>
  );
};