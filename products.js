// Products Page JavaScript Functionality
class ProductsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.setupCart();
    }

    loadProducts() {
        // Sample product data - in real app, this would come from API
        this.products = [
            {
                id: 1,
                name: "Wireless Headphones",
                category: "electronics",
                price: 2999,
                originalPrice: 4999,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
                rating: 4.5,
                reviews: 128,
                badge: "New"
            },
            {
                id: 2,
                name: "Smart Watch",
                category: "electronics",
                price: 7999,
                originalPrice: 12999,
                image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300",
                rating: 4.2,
                reviews: 89,
                badge: "Sale"
            },
            {
                id: 3,
                name: "Running Shoes",
                category: "fashion",
                price: 3499,
                originalPrice: 5499,
                image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300",
                rating: 4.8,
                reviews: 256,
                badge: null
            },
            {
                id: 4,
                name: "Gaming Laptop",
                category: "electronics",
                price: 59999,
                originalPrice: 79999,
                image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300",
                rating: 4.7,
                reviews: 342,
                badge: "Hot"
            },
            {
                id: 5,
                name: "Yoga Mat",
                category: "sports",
                price: 899,
                originalPrice: 1299,
                image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300",
                rating: 4.3,
                reviews: 78,
                badge: "New"
            },
            {
                id: 6,
                name: "Coffee Maker",
                category: "home",
                price: 2499,
                originalPrice: 3999,
                image: "https://res.cloudinary.com/ds3wuvkwo/image/upload/v1754824909/download_28_mxpuxp.jpg",
                rating: 4.4,
                reviews: 156,
                badge: "Sale"
            },
            {
                id: 7,
                name: "Skincare Set",
                category: "beauty",
                price: 1899,
                originalPrice: 2499,
                image: "https://res.cloudinary.com/ds3wuvkwo/image/upload/v1754824674/images_6_qcjc79.jpg",
                rating: 4.6,
                reviews: 203,
                badge: null
            },
            {
                id: 8,
                name: "Mystery Novel",
                category: "books",
                price: 399,
                originalPrice: 599,
                image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300",
                rating: 4.9,
                reviews: 92,
                badge: "New"
            },
            {
                id: 9,
                name: "Bluetooth Speaker",
                category: "electronics",
                price: 3999,
                originalPrice: 5999,
                image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300",
                rating: 4.5,
                reviews: 89,
                badge: "New"
            },
            {
                id: 10,
                name: "Winter Jacket",
                category: "fashion",
                price: 4499,
                originalPrice: 6999,
                image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300",
                rating: 4.6,
                reviews: 167,
                badge: "Sale"
            }
        ];
        
        this.filteredProducts = [...this.products];
        this.renderProducts();
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

    renderProducts() {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        // Clear container and set appropriate class
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
                        <button class="add-to-cart-btn">Add to Cart</button>
                    </div>
                `;
            } else {
                productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image-list">
                    <div class="product-info-list">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-category">${this.getCategoryName(product.category)}</p>
                        <p class="product-description">High-quality product with excellent features and great value for money.</p>
                        <div class="product-price">
                            <span class="current-price">₹${product.price.toLocaleString()}</span>
                            ${product.originalPrice ? `<span class="original-price">₹${product.originalPrice.toLocaleString()}</span>` : ''}
                        </div>
                        <div class="product-rating">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            <span>(${product.reviews} reviews)</span>
                        </div>
                        <button class="add-to-cart-btn">Add to Cart</button>
                    </div>
                    ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
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

    searchProducts(query) {
        if (!query) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.currentPage = 1;
        this.renderProducts();
    }

    filterProducts() {
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        
        let filtered = [...this.products];
        
        if (categoryFilter && categoryFilter.value !== 'all') {
            filtered = filtered.filter(product => product.category === categoryFilter.value);
        }
        
        if (priceFilter && priceFilter.value !== 'all') {
            const [min, max] = priceFilter.value.split('-').map(Number);
            filtered = filtered.filter(product => {
                if (max) {
                    return product.price >= min && product.price <= max;
                } else {
                    return product.price >= min;
                }
            });
        }
        
        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
    }

    sortProducts() {
        const sortFilter = document.getElementById('sortFilter');
        if (!sortFilter) return;
        
        const sorted = [...this.filteredProducts];
        
        switch (sortFilter.value) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                sorted.sort((a, b) => b.id - a.id);
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }
        
        this.filteredProducts = sorted;
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
