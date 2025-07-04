import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiExternalLink, FiPackage } = FiIcons;

const ProductCompatibilityWidget = () => {
  const { productId } = useParams();
  const [compatibilityData, setCompatibilityData] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage or API
    const loadData = () => {
      try {
        const savedData = localStorage.getItem('compatibility-data');
        const savedProducts = localStorage.getItem('shopify-products');
        const savedSettings = localStorage.getItem('compatibility-settings');
        
        if (savedData) setCompatibilityData(JSON.parse(savedData));
        if (savedProducts) setProducts(JSON.parse(savedProducts));
        if (savedSettings) setSettings(JSON.parse(savedSettings));
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading compatibility data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getCompatibleProducts = () => {
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

  const compatibleProducts = getCompatibleProducts();

  if (loading) {
    return (
      <div className="compatibility-widget loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!settings.enableWidget || compatibleProducts.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="compatibility-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="widget-header">
        <h3>{settings.widgetTitle || 'Compatible Products'}</h3>
      </div>
      
      <div className="compatible-products-grid">
        {compatibleProducts.map((item, index) => (
          <motion.div
            key={item.id}
            className={`product-card ${!item.exists ? 'missing' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {item.exists && item.product ? (
              <a 
                href={`/products/${item.product.handle}`}
                className="product-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="product-info">
                  <SafeIcon icon={FiPackage} />
                  <div>
                    <h4>{item.product.title}</h4>
                    <p className="price">${item.product.price}</p>
                  </div>
                </div>
                <SafeIcon icon={FiExternalLink} />
              </a>
            ) : (
              <div className="product-info missing">
                <SafeIcon icon={FiPackage} />
                <div>
                  <h4>{item.id}</h4>
                  <p className="status">Not available</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .compatibility-widget {
          margin: 20px 0;
          padding: 20px;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          background: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .widget-header h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #202223;
        }

        .compatible-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 12px;
        }

        .product-card {
          border: 1px solid #e1e3e5;
          border-radius: 6px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .product-card:hover {
          border-color: #008060;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .product-card.missing {
          border-color: #ffc453;
          background: #fffbf5;
        }

        .product-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          text-decoration: none;
          color: inherit;
        }

        .product-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .product-info.missing {
          padding: 12px;
        }

        .product-info h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: #202223;
          line-height: 1.3;
        }

        .product-info .price {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: #008060;
          font-weight: 500;
        }

        .product-info .status {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: #bf5000;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e1e3e5;
          border-top: 2px solid #008060;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .compatible-products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default ProductCompatibilityWidget;