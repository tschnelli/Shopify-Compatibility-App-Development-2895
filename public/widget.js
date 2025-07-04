(function() {
  'use strict';
  
  // Widget configuration
  const WIDGET_CONFIG = {
    apiEndpoint: 'https://your-app.com/api',
    version: '1.0.0'
  };

  // Initialize widget when DOM is ready
  function initWidget() {
    const widgetContainers = document.querySelectorAll('[data-product-id]');
    
    widgetContainers.forEach(container => {
      const productId = container.getAttribute('data-product-id');
      if (productId) {
        loadCompatibilityWidget(container, productId);
      }
    });
  }

  // Load and render the compatibility widget
  function loadCompatibilityWidget(container, productId) {
    // Create iframe for the widget
    const iframe = document.createElement('iframe');
    iframe.src = `${window.location.origin}/widget/${productId}`;
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.minHeight = '200px';
    iframe.onload = function() {
      // Auto-resize iframe based on content
      resizeIframe(iframe);
    };
    
    container.appendChild(iframe);
  }

  // Auto-resize iframe to fit content
  function resizeIframe(iframe) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const height = doc.body.scrollHeight;
      iframe.style.height = height + 'px';
    } catch (e) {
      // Cross-origin restrictions - use default height
      iframe.style.height = '300px';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  // Listen for messages from the widget iframe
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'COMPATIBILITY_WIDGET_RESIZE') {
      const iframe = document.querySelector(`iframe[src*="/widget/${event.data.productId}"]`);
      if (iframe) {
        iframe.style.height = event.data.height + 'px';
      }
    }
  });

})();