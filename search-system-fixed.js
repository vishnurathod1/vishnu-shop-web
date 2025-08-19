// Comprehensive Search System for E-Commerce Website
// Includes all categories and products with connections

class EcommerceSearch {
    constructor() {
        this.products = [];
        this.categories = [];
        this.searchIndex = new Map();
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.buildCategories();
        this.buildSearchIndex();
        this.setupSearchUI();
    }

    async loadProducts() {
        this.product =[
            {
                id: 1,
                name: "Wireless Headphones",
                description: "High-quality Bluetooth headphones with noise cancellation",
                category: "electronics",
                brand: "Sony",
                tags: ["audio", "wireless", "music"],
                image: "images/headphones.jpg",
                price: 1999,
                rating: 4.5
            },
        ]
        try {
            const response = await fetch('/api/products');
            const result = await response.json();
            this.products = result.data || [];
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to local products.json
            try {
                const response = await fetch('./data/products.json');
                this.products = await response.json();
            } catch (fallbackError) {
                console.error('Fallback error:', fallbackError);
            }
        }
    }

    buildCategories() {
        this.categories = [
            { id: 'electronics', name: 'Electronics', url: 'electronics.html', icon: 'fa-laptop', count: 0   },
            { id: 'fashion', name: 'Fashion', url: 'clothing.html', icon: 'fa-tshirt', count: 0 },
            { id: 'footwear', name: 'Footwear', url: 'footwear.html', icon: 'fa-shoe-prints', count: 0 },
            { id: 'beauty', name: 'Beauty', url: 'beauty.html', icon: 'fa-spa', count: 0 },
            { id: 'home', name: 'Home & Decor', url: 'Home and decor.html', icon: 'fa-home', count: 0 },
            { id: 'health', name: 'Health & Personal Care', url: 'Health and personal care.html', icon: 'fa-heartbeat', count: 0 },
            { id: 'books', name: 'Books & Media', url: 'books and media.html', icon: 'fa-book', count: 0 },
            { id: 'sports', name: 'Sports', url: 'sports-new (1).html', icon: 'fa-running', count: 0 },
            { id: 'toys', name: 'Kids Toys', url: 'kids-toys.html', icon: 'fa-puzzle-piece', count: 0 },
            { id: 'groceries', name: 'Groceries', url: 'groceries.html', icon: 'fa-shopping-basket', count: 0 },
            { id: 'accessories', name: 'Accessories', url: 'Accessories.html', icon: 'fa-gem', count: 0 },
            { id: 'luggage', name: 'Luggage', url: 'Luggage faves.html', icon: 'fa-suitcase', count: 0 }
        ];

        // Count products per category
        this.categories.forEach(category => {
            category.count = this.products.filter(p => p.category === category.id).length;
        });
    }

    buildSearchIndex() {
        this.searchIndex.clear();

        // Index products
        this.products.forEach(product => {
            const keywords = [
                product.name,
                product.description,
                product.category,
                product.brand || '',
                ...(product.tags || [])
            ].join(' ').toLowerCase();

            if (!this.searchIndex.has(product.id)) {
                this.searchIndex.set(product.id, {
                    type: 'product',
                    data: product,
                    keywords: keywords,
                    category: product.category
                });
            }
        });

        // Index categories
        this.categories.forEach(category => {
            const keywords = category.name.toLowerCase();
            this.searchIndex.set(`category_${category.id}`, {
                type: 'category',
                data: category,
                keywords: keywords,
                count: category.count
            });
        });
    }

    search(query, filters = {}) {
        if (!query || query.trim() === '') {
            return this.getAllProducts();
        }

        const searchTerm = query.toLowerCase();
        let results = [];

        // Search in products
        this.products.forEach(product => {
            const score = this.calculateRelevance(product, searchTerm);
            if (score > 0) {
                results.push({
                    type: 'product',
                    data: product,
                    score: score,
                    category: product.category
                });
            }
        });

        // Search in categories
        this.categories.forEach(category => {
            if (category.name.toLowerCase().includes(searchTerm)) {
                results.push({
                    type: 'category',
                    data: category,
                    score: 0.8,
                    count: category.count
                });
            }
        });

        // Apply filters
        if (filters.category && filters.category !== 'all') {
            results = results.filter(r => r.category === filters.category);
        }

        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            results = results.filter(r => {
                if (r.type === 'product') {
                    const price = r.data.price;
                    return max ? price >= min && price <= max : price >= min;
                }
                return true;
            });
        }

        // Sort by relevance
        results.sort((a, b) => b.score - a.score);

        return results;
    }

    calculateRelevance(product, searchTerm) {
        let score = 0;
        const name = product.name.toLowerCase();
        const description = (product.description || '').toLowerCase();
        const category = product.category.toLowerCase();

        // Exact match in name
        if (name === searchTerm) score += 10;
        // Starts with search term
        else if (name.startsWith(searchTerm)) score += 8;
        // Contains search term
        else if (name.includes(searchTerm)) score += 6;

        // Description match
        if (description.includes(searchTerm)) score += 4;

        // Category match
        if (category.includes(searchTerm)) score += 3;

        // Rating bonus
        score += product.rating * 0.5;

        return score;
    }

    getAllProducts() {
        return this.products.map(product => ({
            type: 'product',
            data: product,
            score: 1,
            category: product.category
        }));
    }

    getProductsByCategory(categoryId) {
        return this.products
            .filter(product => product.category === categoryId)
            .map(product => ({
                type: 'product',
                data: product,
                score: 1,
                category: product.category
            }));
    }

    getCategories() {
        return this.categories;
    }

    getRelatedProducts(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return [];

        return this.products
            .filter(p => p.category === product.category && p.id !== productId)
            .slice(0, 4)
            .map(p => ({
                type: 'product',
                data: p,
                score: 1,
                category: p.category
            }));
    }

    setupSearchUI() {
        // Create search input if it doesn't exist
        if (!document.getElementById('global-search')) {
            this.createSearchUI();
        }
    }

    createSearchUI() {
        const searchContainer = document.createElement('div');
        searchContainer.innerHTML = `
            <div class="search-container">
                <input type="text" id="global-search" placeholder="Search products, categories..." class="search-input">
                <button id="search-btn" class="search-btn">
                    <i class="fas fa-search"></i>
                </button>
                <div id="search-results" class="search-results-dropdown" style="display: none;">
                    <div class="search-results-content">
                        <div class="search-section">
                            <h4>Categories</h4>
                            <div id="category-results"></div>
                        </div>
                        <div class="search-section">
                            <h4>Products</h4>
                            <div id="product-results"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .search-container {
                position: relative;
                max-width: 600px;
                margin: 20px auto;
            }
            .search-input {
                width: 100%;
                padding: 12px 45px 12px 15px;
                border: 2px solid #ddd;
                border-radius: 25px;
                font-size: 16px;
                outline: none;
            }
            .search-input:focus {
                border-color: #007bff;
            }
            .search-btn {
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
                background: #007bff;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 50%;
                cursor: pointer;
            }
            .search-results-dropdown {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                max-height: 400px;
                overflow-y: auto;
                z-index: 1000;
            }
            .search-result-item {
                padding: 12px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                display: flex;
                align-items: center;
            }
            .search-result-item:hover {
                background: #f8f9fa;
            }
            .search-result-item img {
                width: 50px;
                height: 50px;
                object-fit: cover;
                margin-right: 10px;
                border-radius: 4px;
            }
            .search-result-info h4 {
                margin: 0;
                font-size: 14px;
            }
            .search-result-info p {
                margin: 2px 0;
                font-size: 12px;
                color: #666;
            }
            .search-category {
                background: #007bff;
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
            }
        `;
        document.head.appendChild(style);

        // Insert search container
        const header = document.querySelector('header') || document.body;
        header.insertBefore(searchContainer, header.firstChild);

        // Add event listeners
        const searchInput = document.getElementById('global-search');
        const searchBtn = document.getElementById('search-btn');
        const resultsContainer = document.getElementById('search-results');
        const categoryResults = document.getElementById('category-results');
        const productResults = document.getElementById('product-results');

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        searchBtn.addEventListener('click', () => {
            this.handleSearch(searchInput.value);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                resultsContainer.style.display = 'none';
            }
        });
    }

    handleSearch(query) {
        const results = this.search(query);
        this.displayResults(results);
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('search-results');
        const categoryResults = document.getElementById('category-results');
        const productResults = document.getElementById('product-results');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item">No results found</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        // Separate categories and products
        const categories = results.filter(r => r.type === 'category');
        const products = results.filter(r => r.type === 'product');

        // Display categories
        categoryResults.innerHTML = categories.slice(0, 5).map(result => `
            <div class="search-result-item" onclick="window.location.href='${result.data.url}'">
                <div class="search-result-info">
                    <h4><i class="fas ${result.data.icon}"></i> ${result.data.name}</h4>
                    <p>${result.data.count} products available</p>
                </div>
            </div>
        `).join('');

        // Display products
        productResults.innerHTML = products.slice(0, 8).map(result => `
            <div class="search-result-item" onclick="window.location.href='products.html#product-${result.data.id}'">
                <img src="${result.data.image}" alt="${result.data.name}">
                <div class="search-result-info">
                    <h4>${result.data.name}</h4>
                    <p>₹${result.data.price} <span class="search-category">${result.data.category}</span></p>
                </div>
            </div>
        `).join('');

        resultsContainer.style.display = 'block';
    }
}

// Initialize search system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.ecommerceSearch = new EcommerceSearch();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EcommerceSearch;
}
