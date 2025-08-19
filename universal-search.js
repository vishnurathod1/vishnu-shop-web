// Universal Search System for VSV ShopEasy
// Works across all pages and categories with real-time search functionality

class UniversalSearch {
    constructor() {
        this.products = [];
        this.categories = [];
        this.searchIndex = new Map();
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.buildSearchIndex();
            this.setupSearchUI();
            this.isInitialized = true;
            console.log('Universal Search initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Universal Search:', error);
        }
    }

    async loadData() {
        // Load products from existing system
        try {
            const response = await fetch('./routes/products.json');
            this.products = await response.json();
        } catch (error) {
            console.log('Using fallback product data');
            this.products = this.getFallbackProducts();
        }

        // Define categories
        this.categories = [
            { id: 'electronics', name: 'Electronics', url: 'electronics.html', icon: 'fa-laptop', count: 0 },
            { id: 'fashion', name: 'Fashion', url: 'clothing.html', icon: 'fa-tshirt', count: 0 },
            { id: 'footwear', name: 'Footwear', url: 'footwear.html', icon: 'fa-shoe-prints', count: 0 },
            { id: 'beauty', name: 'Beauty', url: 'beauty.html', icon: 'fa-spa', count: 0 },
            { id: 'home', name: 'Home & Decor', url: 'Home and decor.html', icon: 'fa-home', count: 0 },
            { id: 'health', name: 'Health & Personal Care', url: 'Health and personal care.html', icon: 'fa-heartbeat', count: 0 },
            { id: 'books', name: 'Books & Media', url: 'books and media.html', icon: 'fa-book', count: 0 },
            { id: 'sports', name: 'Sports & Fitness', url: 'sports-new (1).html', icon: 'fa-running', count: 0 },
            { id: 'toys', name: 'Kids & Toys', url: 'kids-toys.html', icon: 'fa-puzzle-piece', count: 0 },
            { id: 'groceries', name: 'Groceries', url: 'groceries.html', icon: 'fa-shopping-basket', count: 0 },
            { id: 'accessories', name: 'Accessories', url: 'Accessories.html', icon: 'fa-gem', count: 0 },
            { id: 'luggage', name: 'Luggage', url: 'Luggage faves.html', icon: 'fa-suitcase', count: 0 }
        ];

        // Count products per category
        this.categories.forEach(category => {
            category.count = this.products.filter(p => p.category === category.id).length;
        });
    }

    getFallbackProducts() {
        return [
            {
                id: 1, name: "iPhone 15 Pro", category: "electronics", price: 119900,
                image: "https://res.cloudinary.com/ddxbevmiz/image/upload/v1754748052/iPhone_15_Pro_gtp4sb.webp"
            },
            {
                id: 2, name: "Smart Watch", category: "electronics", price: 7999,
                image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300"
            },
            {
                id: 3, name: "Running Shoes", category: "fashion", price: 3499,
                image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300"
            },
            {
                id: 4, name: "Gaming Laptop", category: "electronics", price: 59999,
                image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300"
            },
            {
                id: 5, name: "Yoga Mat", category: "sports", price: 899,
                image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300"
            }
        ];
    }

    buildSearchIndex() {
        this.searchIndex.clear();

        // Index products
        this.products.forEach(product => {
            const keywords = [
                product.name,
                product.description || '',
                product.category,
                product.brand || '',
                product.tags || []
            ].flat().join(' ').toLowerCase();

            this.searchIndex.set(`product_${product.id}`, {
                type: 'product',
                data: product,
                keywords: keywords,
                category: product.category
            });
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
        if (!query || query.trim() === '') return [];

        const searchTerm = query.toLowerCase();
        let results = [];

        // Search through all indexed items
        for (const [key, item] of this.searchIndex) {
            const score = this.calculateRelevance(item, searchTerm);
            if (score > 0) {
                results.push({
                    id: key,
                    type: item.type,
                    data: item.data,
                    score: score
                });
            }
        }

        // Apply filters
        if (filters.category && filters.category !== 'all') {
            results = results.filter(r => r.data.category === filters.category);
        }

        // Sort by relevance
        results.sort((a, b) => b.score - a.score);

        return results.slice(0, 20); // Limit to 20 results
    }

    calculateRelevance(item, searchTerm) {
        let score = 0;
        const keywords = item.keywords;

        // Exact match
        if (keywords === searchTerm) score += 10;
        else if (keywords.startsWith(searchTerm)) score += 8;
        else if (keywords.includes(searchTerm)) score += 6;

        // Category bonus
        if (item.type === 'category') score += 2;

        return score;
    }

    setupSearchUI() {
        // Create search bar if it doesn't exist
        this.createUniversalSearchBar();
        this.addSearchEventListeners();
    }

    createUniversalSearchBar() {
        // Check if search bar already exists
        if (document.getElementById('universal-search')) return;

        const searchHTML = `
            <div class="universal-search-container">
                <div class="search-wrapper">
                    <input type="text" 
                           id="universal-search" 
                           placeholder="Search products, categories..." 
                           class="universal-search-input"
                           autocomplete="off">
                    <button id="universal-search-btn" class="universal-search-btn">
                        <i class="fas fa-search"></i>
                    </button>
                    <div id="universal-search-results" class="search-dropdown" style="display: none;">
                        <div class="search-results-content">
                            <div id="search-suggestions"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert into header or create floating search
        const header = document.querySelector('.header .container .nav-wrapper');
        if (header) {
            header.insertAdjacentHTML('afterbegin', searchHTML);
        } else {
            document.body.insertAdjacentHTML('afterbegin', searchHTML);
        }

        // Add styles
        this.addSearchStyles();
    }

    addSearchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .universal-search-container {
                position: relative;
                max-width: 600px;
                margin: 0 auto;
                z-index: 1000;
            }

            .search-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            .universal-search-input {
                width: 100%;
                padding: 12px 45px 12px 15px;
                border: 2px solid #ddd;
                border-radius: 25px;
                font-size: 16px;
                outline: none;
                transition: all 0.3s ease;
            }

            .universal-search-input:focus {
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .universal-search-btn {
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
                background: #667eea;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .universal-search-btn:hover {
                background: #5a6fd8;
                transform: translateY(-50%) scale(1.1);
            }

            .search-dropdown {
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
                z-index: 1001;
            }

            .search-result-item {
                padding: 12px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                display: flex;
                align-items: center;
                transition: background 0.2s;
            }

            .search-result-item:hover {
                background: #f8f9fa;
            }

            .search-result-item img {
                width: 50px;
                height: 50px;
                object-fit: cover;
                margin-right: 12px;
                border-radius: 4px;
            }

            .search-result-info h4 {
                margin: 0 0 4px 0;
                font-size: 14px;
                font-weight: 600;
            }

            .search-result-info p {
                margin: 0;
                font-size: 12px;
                color: #666;
            }

            .search-result-price {
                color: #667eea;
                font-weight: bold;
            }

            .search-result-category {
                background: #e3f2fd;
                color: #1976d2;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                margin-left: 8px;
            }

            @media (max-width: 768px) {
                .universal-search-container {
                    margin: 10px;
                }
                
                .universal-search-input {
                    font-size: 14px;
                    padding: 10px 40px 10px 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addSearchEventListeners() {
        const searchInput = document.getElementById('universal-search');
        const searchBtn = document.getElementById('universal-search-btn');
        const resultsContainer = document.getElementById('universal-search-results');

        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length > 0) {
                searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300);
            } else {
                this.hideResults();
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(e.target.value.trim());
            }
        });

        searchBtn.addEventListener('click', () => {
            this.performSearch(searchInput.value.trim());
        });

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.universal-search-container')) {
                this.hideResults();
            }
        });
    }

    performSearch(query) {
        if (!query) {
            this.hideResults();
            return;
        }

        const results = this.search(query);
        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (!suggestionsContainer) return;

        if (results.length === 0) {
            suggestionsContainer.innerHTML = `
                <div class="search-result-item">
                    <div class="search-result-info">
                        <h4>No results found</h4>
                        <p>Try searching with different keywords</p>
                    </div>
                </div>
            `;
            return;
        }

        suggestionsContainer.innerHTML = results.map(result => {
            if (result.type === 'product') {
                return `
                    <div class="search-result-item" onclick="window.location.href='products.html#product-${result.data.id}'">
                        <img src="${result.data.image}" alt="${result.data.name}">
                        <div class="search-result-info">
                            <h4>${result.data.name}</h4>
                            <p class="search-result-price">₹${result.data.price}</p>
                            <span class="search-result-category">${result.data.category}</span>
                        </div>
                    </div>
                `;
            } else if (result.type === 'category') {
                return `
                    <div class="search-result-item" onclick="window.location.href='${result.data.url}'">
                        <div class="search-result-info">
                            <h4><i class="fas ${result.data.icon}"></i> ${result.data.name}</h4>
                            <p>${result.data.count} items available</p>
                        </div>
                    </div>
                `;
            }
        }).join('');

        document.getElementById('universal-search-results').style.display = 'block';
    }

    hideResults() {
        const resultsContainer = document.getElementById('universal-search-results');
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
    }

    // Utility method to get search suggestions
    getSuggestions(query) {
        if (!query || query.length < 2) return [];
        return this.search(query).slice(0, 5);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.universalSearch = new UniversalSearch();
});

// Make available globally
window.UniversalSearch = UniversalSearch;
