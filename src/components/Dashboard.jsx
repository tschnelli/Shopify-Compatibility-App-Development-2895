import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UploadSection from './UploadSection';
import ProductList from './ProductList';
import SettingsPanel from './SettingsPanel';
import AnalyticsPanel from './AnalyticsPanel';
import { useCompatibility } from '../context/CompatibilityContext';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { getMissingProducts, settings } = useCompatibility();
  const missingProducts = getMissingProducts();

  const tabs = [
    { id: 'upload', content: 'CSV Upload' },
    { id: 'products', content: 'Products' },
    { id: 'settings', content: 'Settings' },
    { id: 'analytics', content: 'Analytics' }
  ];

  const tabContent = [
    <UploadSection key="upload" />,
    <ProductList key="products" />,
    <SettingsPanel key="settings" />,
    <AnalyticsPanel key="analytics" />
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center justify-start py-10 px-2 sm:px-0"
    >
      <div className="w-full max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight drop-shadow-sm mb-2">Product Compatibility Manager</h1>
          <p className="text-base sm:text-lg text-blue-700 font-medium mb-6">Manage product compatibility relationships for your store</p>
          <button
            onClick={() => {
              const csvContent = 'Product ID,Compatible Product IDs (comma-separated)\nproduct-1,"product-2,product-3,product-4"\nproduct-2,"product-1,product-5"';
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'compatibility-template.csv';
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg px-6 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 mt-2 text-base flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Download Sample CSV
          </button>
        </header>
        {missingProducts.length > 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50/80 shadow-sm mb-4 p-4 flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="1" /></svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-yellow-800 mb-1 flex items-center gap-2">Missing Products Detected</div>
              <div className="text-yellow-900 text-sm">
                {missingProducts.length} products in your compatibility list are not found in your store.
                {!settings.showMissingProducts && ' They are currently hidden from customers.'}
              </div>
              <button
                onClick={() => setSelectedTab(1)}
                className="mt-2 flex items-center gap-1 text-blue-700 hover:underline font-semibold transition-colors duration-150 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                View Details
              </button>
            </div>
          </div>
        )}
        <div className="bg-white/95 shadow-2xl rounded-3xl border border-blue-100">
          <div className="bg-white rounded-t-3xl border-b border-blue-100 px-6 pt-4 pb-2 flex flex-wrap gap-2">
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(idx)}
                className={`px-6 py-2 rounded-lg font-medium transition-all text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 ${selectedTab === idx ? 'bg-blue-100 font-bold shadow-sm' : ''}`}
                aria-selected={selectedTab === idx}
                aria-controls={`${tab.id}-panel`}
                tabIndex={0}
              >
                {tab.content}
              </button>
            ))}
          </div>
          <div className="bg-blue-50 rounded-b-3xl min-h-[350px] sm:min-h-[450px] flex flex-col gap-6 px-6 py-6">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {tabContent[selectedTab]}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;