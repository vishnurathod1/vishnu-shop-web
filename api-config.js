// API Configuration for frontend
const API_CONFIG = {
  BASE_URL: 'http://localhost:5500/api',
  ENDPOINTS: {
    PRODUCTS: '/products',
    PRODUCT_BY_ID: '/products/:id',
    PRODUCTS_BY_CATEGORY: '/products/category/:category'
  }
};

// Helper function to build API URLs
function buildApiUrl(endpoint, params = {}) {
  let url = API_CONFIG.BASE_URL + endpoint;
  
  // Replace URL parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_CONFIG, buildApiUrl };
}
