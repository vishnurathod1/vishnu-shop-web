// Dashboard Products Management JavaScript
class DashboardProductsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.apiBaseUrl = 'http://localhost:5000/api/products';
        this.currentView = 'table'; // 'table' or 'cards'
        
        // Bind methods to maintain proper 'this' context
        this.handleAddProductFormSubmit = this.handleAddProductFormSubmit.bind(this);
        this.addProduct = this.addProduct.bind(this);
        
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.updateDashboardStats();
    }

    async loadProducts() {
        try {
            // Try to load from API first
            const response = { ok: false }; // Simulate API failure
            if (response.ok) {
                const data = await response.json();
                this.products = data.data || [];
            } else {
                // Fallback to sample data if API fails
                this.loadSampleProducts();
            }
        } catch (error) {
            console.error('Error loading products from API:', error);
            this.loadSampleProducts();
        }
        
        this.filteredProducts = [...this.products];
        this.renderProducts();
    }

    loadSampleProducts() {
        // Sample product data for dashboard
        this.products = [
            {
                id: 1,
                name: "Wireless Headphones",
                category: "electronics",
                price: 2999,
                stock: 45,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
                status: "active",
                sales: 128
            },
            {
                id: 2,
                name: "Smart Watch Pro",
                category: "electronics",
                price: 7999,
                stock: 12,
                image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300",
                status: "active",
                sales: 89
            },
            {
                id: 3,
                name: "Running Shoes",
                category: "fashion",
                price: 3499,
                stock: 8,
                image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300",
                status: "low-stock",
                sales: 256
            },
            {
                id: 4,
                name: "Gaming Laptop",
                category: "electronics",
                price: 59999,
                stock: 0,
                image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300",
                status: "out-of-stock",
                sales: 342
            },
            {
                id: 5,
                name: "Yoga Mat Premium",
                category: "sports",
                price: 899,
                stock: 25,
                image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300",
                status: "active",
                sales: 78
            },
            {
                id: 6,
                name: "Coffee Maker Deluxe",
                category: "home",
                price: 2499,
                stock: 18,
                image: "https://res.cloudinary.com/ds3wuvkwo/image/upload/v1754824909/download_28_mxpuxp.jpg",
                status: "active",
                sales: 156
            },
            {
                id: 7,
                name: "Skincare Set",
                category: "beauty",
                price: 1899,
                stock: 30,
                image: "https://res.cloudinary.com/ds3wuvkwo/image/upload/v1754824674/images_6_qcjc79.jpg",
                status: "active",
                sales: 203
            },
            {
                id: 8,
                name: "Mystery Novel Collection",
                category: "books",
                price: 399,
                stock: 5,
                image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300",
                status: "low-stock",
                sales: 92
            }
        ];
    }

    setupEventListeners() {
        console.log('Setting up event listeners for buttons'); // Log setup of event listeners
        try {
            const addProductButton = document.querySelector('.add-product-btn');
            if (addProductButton) {
                addProductButton.addEventListener('click', () => {
                    openAddProductModal();
                });
            }
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
        
        // Add product form submission
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleAddProductFormSubmit(e);
            });
        }

        // Search functionality
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }

        // View toggle functionality
        this.setupViewToggle();
    }

    async handleAddProductFormSubmit(e) {
        console.log('handleAddProductFormSubmit called');
        const form = e.target;
        const formData = new FormData(form);
        
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            image: formData.get('image') || '',
            status: formData.get('status') || 'active'
        };

        console.log('Product data to add:', productData);

        // Validate required fields
        if (!productData.name || !productData.category || isNaN(productData.price) || isNaN(productData.stock)) {
            alert('Please fill in all required fields (Name, Category, Price, Stock)');
            return;
        }

        const success = await this.addProduct(productData);
        console.log('addProduct success:', success);
        if (success) {
            alert('Product added successfully!');
            closeAddProductModal();
        } else {
            alert('Failed to add product. Please try again.');
        }
    }

    setupViewToggle() {
        const viewToggle = document.querySelector('.view-toggle');
        if (!viewToggle) return;

        // Create view toggle buttons only once
        if (!viewToggle.hasChildNodes()) {
            const tableBtn = document.createElement('button');
            tableBtn.className = 'view-toggle-btn';
            tableBtn.innerHTML = '<i class="fa-solid fa-table"></i> Table';
            tableBtn.addEventListener('click', () => this.toggleView('table'));

            const cardsBtn = document.createElement('button');
            cardsBtn.className = 'view-toggle-btn';
            cardsBtn.innerHTML = '<i class="fa-solid fa-grip"></i> Cards';
            cardsBtn.addEventListener('click', () => this.toggleView('cards'));

            viewToggle.appendChild(tableBtn);
            viewToggle.appendChild(cardsBtn);
        }

        this.updateViewToggleButtons();

        // Add event listeners to filter dropdowns
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.sortProducts();
            });
        }
    }

    updateViewToggleButtons() {
        const viewToggle = document.querySelector('.view-toggle');
        if (!viewToggle) return;
        const buttons = viewToggle.querySelectorAll('.view-toggle-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
        if (this.currentView === 'table') {
            buttons[0]?.classList.add('active');
        } else {
            buttons[1]?.classList.add('active');
        }
    }

    toggleView(viewType) {
        if (this.currentView === viewType) return;
        this.currentView = viewType;
        this.updateViewToggleButtons();
        this.renderProducts();
    }

    renderProducts() {
        if (this.currentView === 'table') {
            this.renderProductsTable();
        } else {
            this.renderProductsCards();
        }
    }

    renderProductsTable() {
        const container = document.getElementById('productsTableBody');
        if (!container) return;

        container.innerHTML = '';

        this.filteredProducts.forEach(product => {
            const row = document.createElement('tr');
            
            const statusClass = this.getStatusClass(product.stock, product.status);
            const statusText = this.getStatusText(product.stock, product.status);

            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                        <div>
                            <div style="font-weight: 600;">${product.name}</div>
                            <div style="font-size: 12px; color: var(--muted);">SKU: PROD-${product.id.toString().padStart(4, '0')}</div>
                        </div>
                    </div>
                </td>
                <td>${this.getCategoryName(product.category)}</td>
                <td>₹${product.price.toLocaleString()}</td>
                <td>${product.stock}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn edit-btn" onclick="openEditProductModal(${product.id})">
                        <i class="fa-solid fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            `;
            
            container.appendChild(row);
        });
    }

    renderProductsCards() {
        const tableContainer = document.querySelector('.table-wrap');
        if (!tableContainer) return;

        // Create or get the products grid container
        let gridContainer = document.getElementById('productsGrid');
        if (!gridContainer) {
            gridContainer = document.createElement('div');
            gridContainer.id = 'productsGrid';
            gridContainer.className = 'products-grid';
            tableContainer.innerHTML = '';
            tableContainer.appendChild(gridContainer);
        } else {
            gridContainer.innerHTML = '';
        }

        this.filteredProducts.forEach(product => {
            const statusClass = this.getStatusClass(product.stock, product.status);
            const statusText = this.getStatusText(product.stock, product.status);
            const badgeClass = statusClass.replace('st-', '');

            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <span class="product-badge ${badgeClass}">${statusText}</span>
                </div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-details">
                    <div class="product-detail">
                        <span class="product-detail-label">Category:</span>
                        <span class="product-detail-value">${this.getCategoryName(product.category)}</span>
                    </div>
                    <div class="product-detail">
                        <span class="product-detail-label">SKU:</span>
                        <span class="product-detail-value">PROD-${product.id.toString().padStart(4, '0')}</span>
                    </div>
                    <div class="product-detail">
                        <span class="product-detail-label">Stock:</span>
                        <span class="product-detail-value">${product.stock} units</span>
                    </div>
                </div>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <div class="product-actions">
                    <button class="product-action-btn product-edit-btn" onclick="openEditProductModal(${product.id})">
                        <i class="fa-solid fa-edit"></i> Edit
                    </button>
                    <button class="product-action-btn product-delete-btn" onclick="deleteProduct(${product.id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            `;
            
            gridContainer.appendChild(card);
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

    getStatusClass(stock, status) {
        if (status === 'inactive') return 'st-inactive';
        if (stock === 0) return 'st-out-of-stock';
        if (stock <= 10) return 'st-low-stock';
        return 'st-active';
    }

    getStatusText(stock, status) {
        if (status === 'inactive') return 'Inactive';
        if (stock === 0) return 'Out of Stock';
        if (stock <= 10) return 'Low Stock';
        return 'Active';
    }

    searchProducts(query) {
        if (!query) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase()) ||
                product.id.toString().includes(query)
            );
        }
        this.renderProducts();
    }

    filterProducts() {
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        let filtered = [...this.products];
        
        if (categoryFilter && categoryFilter.value !== 'all') {
            filtered = filtered.filter(product => product.category === categoryFilter.value);
        }
        
        if (statusFilter && statusFilter.value !== 'all') {
            filtered = filtered.filter(product => {
                const status = this.getStatusText(product.stock, product.status).toLowerCase().replace(' ', '-');
                return status === statusFilter.value;
            });
        }
        
        this.filteredProducts = filtered;
        this.renderProducts();
    }

    sortProducts() {
        const sortFilter = document.getElementById('sortFilter');
        if (!sortFilter) return;
        
        const sorted = [...this.filteredProducts];
        
        switch (sortFilter.value) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'stock':
                sorted.sort((a, b) => a.stock - b.stock);
                break;
            case 'newest':
                sorted.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }
        
        this.filteredProducts = sorted;
        this.renderProducts();
    }

    updateDashboardStats() {
        const totalProducts = this.products.length;
        const lowStockCount = this.products.filter(p => p.stock > 0 && p.stock <= 10).length;
        const outOfStockCount = this.products.filter(p => p.stock === 0).length;
        const bestSeller = this.products.reduce((best, current) => 
            (current.sales > (best?.sales || 0)) ? current : best, null
        );

        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('lowStockCount').textContent = lowStockCount;
        document.getElementById('outOfStockCount').textContent = outOfStockCount;
        document.getElementById('bestSeller').textContent = bestSeller ? bestSeller.name : '-';
    }

    async addProduct(productData) {
        try {
            // Try to add via API
            const response = await fetch(this.apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                const newProduct = await response.json();
                this.products.push(newProduct);
            } else {
                // Fallback: Add locally
                // Calculate new ID safely (handle empty array case)
                const maxId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) : 0;
                const newProduct = {
                    id: maxId + 1,
                    ...productData,
                    sales: 0
                };
                this.products.push(newProduct);
            }

            this.filteredProducts = [...this.products];
            this.renderProducts();
            this.updateDashboardStats();
            return true;
        } catch (error) {
            console.error('Error adding product:', error);
            // Fallback: Add locally if API call fails
            try {
                const maxId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) : 0;
                const newProduct = {
                    id: maxId + 1,
                    ...productData,
                    sales: 0
                };
                this.products.push(newProduct);
                this.filteredProducts = [...this.products];
                this.renderProducts();
                this.updateDashboardStats();
                return true;
            } catch (localError) {
                console.error('Error adding product locally:', localError);
                return false;
            }
        }
    }

    async updateProduct(productId, productData) {
        try {
            // Try to update via API
            const response = await fetch(`${this.apiBaseUrl}/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                const updatedProduct = await response.json();
                const index = this.products.findIndex(p => p.id === productId);
                if (index !== -1) {
                    this.products[index] = updatedProduct;
                }
            } else {
                // Fallback: Update locally
                const index = this.products.findIndex(p => p.id === productId);
                if (index !== -1) {
                    this.products[index] = { ...this.products[index], ...productData };
                }
            }

            this.filteredProducts = [...this.products];
            this.renderProducts();
            this.updateDashboardStats();
            return true;
        } catch (error) {
            console.error('Error updating product:', error);
            return false;
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) {
            return false;
        }

        try {
            // Try to delete via API
            const response = await fetch(`${this.apiBaseUrl}/${productId}`, {
                method: 'DELETE'
            });

            if (response.ok || response.status === 404) {
                this.products = this.products.filter(p => p.id !== productId);
            } else {
                // Fallback: Delete locally
                this.products = this.products.filter(p => p.id !== productId);
            }

            this.filteredProducts = [...this.products];
            this.renderProducts();
            this.updateDashboardStats();
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    }
}

// Global instance
let productsManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    productsManager = new DashboardProductsManager();
});

function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.style.display = 'block'; // Show the modal
    // Scroll modal content to top when opened
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

function closeAddProductModal() {
    console.log('Closing Add Product Modal');
    document.getElementById('addProductModal').style.display = 'none';
    document.getElementById('addProductForm').reset();
}

function openEditProductModal(productId) {
    const product = productsManager.products.find(p => p.id === productId);
    if (product) {
        const form = document.getElementById('editProductForm');
        form.elements.id.value = product.id;
        form.elements.name.value = product.name;
        form.elements.category.value = product.category;
        form.elements.price.value = product.price;
        form.elements.stock.value = product.stock;
        form.elements.image.value = product.image || '';
        form.elements.status.value = product.status || 'active';
        
        document.getElementById('editProductModal').style.display = 'block';
    }
}

function closeEditProductModal() {
    document.getElementById('editProductModal').style.display = 'none';
}

// Global delete function
async function deleteProduct(productId) {
    const success = await productsManager.deleteProduct(productId);
    if (success) {
        alert('Product deleted successfully!');
    } else {
        alert('Failed to delete product. Please try again.');
    }
}
