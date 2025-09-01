// Updated Products Page JavaScript - Connected to Backend API
class ProductsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.apiBaseUrl = 'http://localhost:5000/api/products';
        
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.setupCart();
    }

    async loadProducts() {
        try {
            const response = await fetch(`${this.apiBaseUrl}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            
            const data = await response.json();
            this.products = data.data;
            this.filteredProducts = [...this.products];
            this.renderProducts();
            this.updatePagination();
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to hardcoded data if API fails
            this.loadFallbackProducts();
        }
    }

    loadFallbackProducts() {
        // This would be removed once API is working
        console.log('Loading fallback products...');
        // Your original hardcoded products would go here as fallback
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }

        // Filter functionality
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (categoryFilter) categoryFilter.addEventListener('change', () => this.filterProducts());
        if (priceFilter) priceFilter.addEventListener('change', () => this.filterProducts());
        if (sortFilter) sortFilter.addEventListener('change', () => this.sortProducts());
    }

    setupCart() {
        let cartCount = 0;
        const cartCountElement = document.querySelector('.cart-count');
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                cartCount++;
                if (cartCountElement) cartCountElement.textContent = cartCount;
                
                // Add animation
                e.target.textContent = 'Added!';
                e.target.style.background = '#28a745';
                
                setTimeout(() => {
                    e.target.textContent = 'Add to Cart';
                    e.target.style.background = '#667eea';
                }, 1000);
            }
        });
    }

    async renderProducts() {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

    container.innerHTML = '';
    container.className = this.currentView === 'grid' ? 'products-grid' : 'products-list';

    productsToShow.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = this.currentView === 'grid' ? 'product-card' : 'product-card-list';
      
      if (this.currentView === 'grid') {
        productElement.innerHTML = `
          ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-category">${this.getCategoryName(product.category)}</p>
            <div class="product-price">
              <span class="current-price">₹${product.price.toLocaleString()}</span>
              ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : ''}
            </div>
            <div class="product-rating">
              ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
              <span>(${product.reviews})</span>
            </div>
            <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
          </div>
        `;
      } else {
        productElement.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="product-image-list">
          <div class="product-info-list">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-category">${this.getCategoryName(product.category)}</p>
            <div class="product-price">
              <span class="current-price">₹${product.price.toLocaleString()}</span>
              ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : ''}
            </div>
            <div class="product-rating">
              ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
              <span>(${product.reviews} reviews)</span>
            </div>
            <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
          </div>
        `;
      }
      
      container.appendChild(productElement);
    });
    }

    getCategoryName(category) {
      const categories = {
        electronics: 'Electronics',
        fashion: 'Fashion',
        home: 'Home & Living',
        beauty: 'Beauty',
        books: 'Books',
        sports: 'Sports'
      };
      return categories[category] || category;
    }

    async searchProducts(query) {
      if (!query) {
        this.filteredProducts = [...this.products];
      } else {
        const response = await fetch(`${this.apiBaseUrl}?search=${encodeURIComponent(query)}`);
        const data = await response.json();
        this.filteredProducts = data.data;
      }
      this.currentPage = 1;
      this.renderProducts();
    }

    async filterProducts() {
      const categoryFilter = document.getElementById('categoryFilter');
      const priceFilter = document.getElementById('priceFilter');
      
      let params = new URLSearchParams();
      
      if (categoryFilter && categoryFilter.value !== 'all') {
        params.append('category', categoryFilter.value);
      }
      
      if (priceFilter && priceFilter.value !== 'all') {
        params.append('priceRange', priceFilter.value);
      }
      
      const response = await fetch(`${this.apiBaseUrl}?${params.toString()}`);
      const data = await response.json();
      this.filteredProducts = data.data;
      this.currentPage = 1;
      this.renderProducts();
    }

    async sortProducts() {
      const sortFilter = document.getElementById('sortFilter');
      if (!sortFilter) return;
      
      const response = await fetch(`${this.apiBaseUrl}?sort=${sortFilter.value}`);
      const data = await response.json();
      this.filteredProducts = data.data;
      this.currentPage = 1;
      this.renderProducts();
    }

    updatePagination() {
      const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
      const currentPageElement = document.getElementById('currentPage');
      const totalPagesElement = document.getElementById('totalPages');
      
      if (currentPageElement) currentPageElement.textContent = this.currentPage;
      if (totalPagesElement) totalPagesElement.textContent = totalPages;
    }
}

// Initialize products manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productsContainer')) {
    new ProductsManager();
  }
});
