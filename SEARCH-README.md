# E-Commerce Search System

## Overview
This comprehensive search system provides advanced search functionality across all categories and products with intelligent filtering and sorting.

## Files Created

### Core Files
- `search-system.js` - Main search engine with indexing and filtering
- `search.html` - Dedicated search page with filters and results
- `search-enhancements.css` - Advanced styling for search components
- `SEARCH-README.md` - This documentation

### Features
- ✅ Full-text search across all products and categories
- ✅ Real-time search suggestions
- ✅ Advanced filtering (category, price, rating, etc.)
- ✅ Sorting options (price, rating, newest)
- ✅ Responsive design for mobile/desktop
- ✅ Category-based browsing
- ✅ Related products suggestions
- ✅ Search analytics and tracking

## Usage

### 1. Basic Integration
Add to any HTML page:
```html
<script src="search-system.js"></script>
<link rel="stylesheet" href="search-enhancements.css">
```

### 2. Search Page
Navigate to `search.html` for full search experience with filters.

### 3. Global Search Bar
The system automatically adds a search bar to your header when loaded.

### 4. API Usage
```javascript
// Search products
const results = ecommerceSearch.search('wireless headphones', {
    category: 'electronics',
    priceRange: '1000-5000',
    sort: 'rating'
});

// Get products by category
const electronics = ecommerceSearch.getProductsByCategory('electronics');

// Get related products
const related = ecommerceSearch.getRelatedProducts(productId);
```

## Categories Included
- Electronics (electronics.html)
- Fashion/Clothing (clothing.html)
- Footwear (footwear.html)
- Beauty (beauty.html)
- Home & Decor (Home and decor.html)
- Health & Personal Care (Health and personal care.html)
- Books & Media (books and media.html)
- Sports (sports-new (1).html)
- Kids Toys (kids-toys.html)
- Groceries (groceries.html)
- Accessories (Accessories.html)
- Luggage (Luggage faves.html)

## Search Parameters
- **Query**: Text search across product names, descriptions, and categories
- **Category**: Filter by specific category
- **Price Range**: Filter by price ranges
- **Sort**: Sort by relevance, price, rating, or newest

## Integration Steps

1. **Add search to homepage**: Include search-system.js in homepage.html
2. **Enable category search**: Each category page can link to search.html with category parameter
3. **Add search bar**: The system auto-adds search to headers
4. **Test search**: Visit search.html?q=your-query to test

## Backend Integration
The system works with your existing `/api/products` endpoints and uses the products.json data file.

## Mobile Responsive
All search components are fully responsive and work on mobile devices.

## Example URLs
- `search.html` - All products
- `search.html?q=wireless` - Search for "wireless"
- `search.html?category=electronics` - Electronics only
- `search.html?q=laptop&price=10000-50000` - Laptops in price range
