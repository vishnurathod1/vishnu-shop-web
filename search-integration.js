// Search Integration Script
// This script adds the enhanced search functionality to existing pages

(function() {
    'use strict';

    // Configuration
    const config = {
        searchInputSelector: '#search-input, .search-input, input[type="search"]',
        searchContainerId: 'enhanced-search-container',
        autoInitialize: true
    };

    // Initialize search system
    function initSearch() {
        // Check if search system is already loaded
        if (window.ecommerceSearch) {
            console.log('Search system already initialized');
            return;
        }

        // Load search system
        loadSearchSystem();
    }

    // Load search system script
    function loadSearchSystem() {
        const script = document.createElement('script');
        script.src = 'search-system-complete.js';
        script.onload = () => {
            console.log('Search system loaded successfully');
            setupSearchUI();
        };
        script.onerror = () => {
            console.error('Failed to load search system');
        };
        document.head.appendChild(script);
    }

    // Setup search UI
    function setupSearchUI() {
        // Find existing search inputs
        const searchInputs = document.querySelectorAll(config.searchInputSelector);
        
        searchInputs.forEach(input => {
            // Enhance existing search input
            enhanceSearchInput(input);
        });

        // Add global search if no inputs found
        if (searchInputs.length === 0) {
            addGlobalSearch();
        }
    }

    // Enhance existing search input
    function enhanceSearchInput(input) {
        // Add search suggestions dropdown
        const dropdown = createSearchDropdown();
        input.parentNode.appendChild(dropdown);

        // Add event listeners
        let searchTimeout;
        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value, dropdown);
            }, 300);
        });

        input.addEventListener('focus', () => {
            if (input.value.trim() === '') {
                showPopularSearches(dropdown);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!input.parentNode.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Create search dropdown
    function createSearchDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        dropdown.style.cssText = `
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
            display: none;
        `;
        return dropdown;
    }

    // Perform search
    function performSearch(query, dropdown) {
        if (!query || query.trim() === '') {
            showPopularSearches(dropdown);
            return;
        }

        if (window.ecommerceSearch) {
            const results = window.ecommerceSearch.search(query);
            displaySearchResults(results, dropdown);
        }
    }

    // Display search results
    function displaySearchResults(results, container) {
        container.innerHTML = '';
        container.style.display = 'block';

        if (results.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center;">No results found</div>';
            return;
        }

        // Separate categories and products
        const categories = results.filter(r => r.type === 'category');
        const products = results.filter(r => r.type === 'product');

        // Add categories section
        if (categories.length > 0) {
            const categorySection = document.createElement('div');
            categorySection.innerHTML = `
                <div style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong>Categories</strong>
                </div>
            `;
            categories.slice(0, 3).forEach(result => {
                const item = createSearchResultItem(result);
                categorySection.appendChild(item);
            });
            container.appendChild(categorySection);
        }

        // Add products section
        if (products.length > 0) {
            const productSection = document.createElement('div');
            productSection.innerHTML = `
                <div style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong>Products</strong>
                </div>
            `;
            products.slice(0, 5).forEach(result => {
                const item = createSearchResultItem(result);
                productSection.appendChild(item);
            });
            container.appendChild(productSection);
        }
    }

    // Create search result item
    function createSearchResultItem(result) {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.style.cssText = `
            padding: 10px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            display: flex;
            align-items: center;
        `;

        if (result.type === 'category') {
            item.innerHTML = `
                <i class="fas ${result.data.icon}" style="margin-right: 10px; color: #007bff;"></i>
                <div>
                    <div>${result.data.name}</div>
                    <small style="color: #666;">${result.data.count} products</small>
                </div>
            `;
            item.onclick = () => {
                window.location.href = result.data.url;
            };
        } else {
            item.innerHTML = `
                <img src="${result.data.image}" alt="${result.data.name}" style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px; border-radius: 4px;">
                <div>
                    <div>${result.data.name}</div>
                    <small style="color: #007bff;">₹${result.data.price}</small>
                </div>
            `;
            item.onclick = () => {
                window.location.href = `product-details.html?id=${result.data.id}`;
            };
        }

        return item;
    }

    // Show popular searches
    function showPopularSearches(container) {
        container.innerHTML = '';
        container.style.display = 'block';

        const popular = [
            'wireless headphones', 'smart watch', 'running shoes', 'gaming laptop',
            'yoga mat', 'coffee maker', 'skincare', 'books'
        ];

        container.innerHTML = `
            <div style="padding: 10px; border-bottom: 1px solid #eee;">
                <strong>Popular Searches</strong>
            </div>
        `;

        popular.forEach(term => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.style.cssText = 'padding: 10px; cursor: pointer;';
            item.textContent = term;
            item.onclick = () => {
                document.querySelector(config.searchInputSelector).value = term;
                performSearch(term, container);
            };
            container.appendChild(item);
        });
    }

    // Add global search
    function addGlobalSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.id = config.searchContainerId;
        searchContainer.innerHTML = `
            <div class="global-search-container">
                <input type="text" id="global-search-input" placeholder="Search products, categories...">
                <button id="global-search-btn">
                    <i class="fas fa-search"></i>
                </button>
                <div id="global-search-results" class="search-dropdown"></div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .global-search-container {
                position: relative;
                max-width: 600px;
                margin: 20px auto;
            }
            #global-search-input {
                width: 100%;
                padding: 12px 45px 12px 15px;
                border: 2px solid #ddd;
                border-radius: 25px;
                font-size: 16px;
                outline: none;
            }
            #global-search-btn {
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
        `;
        document.head.appendChild(style);

        // Insert into page
        const header = document.querySelector('header') || document.body;
        header.appendChild(searchContainer);

        // Setup enhanced search
        const input = document.getElementById('global-search-input');
        const dropdown = document.getElementById('global-search-results');
        enhanceSearchInput(input);
    }

    // Auto-initialize
    if (config.autoInitialize) {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSearch);
        } else {
            initSearch();
        }
    }

    // Expose API
    window.SearchIntegration = {
        init: initSearch,
        performSearch: (query) => {
            if (window.ecommerceSearch) {
                return window.ecommerceSearch.search(query);
            }
        },
        getAllProducts: () => {
            if (window.ecommerceSearch) {
                return window.ecommerceSearch.getAllProducts();
            }
        },
        getCategories: () => {
            if (window.ecommerceSearch) {
                return window.ecommerceSearch.getCategories();
            }
        }
    };
})();
