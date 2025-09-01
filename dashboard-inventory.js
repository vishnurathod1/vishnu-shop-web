// Dashboard Inventory Management JavaScript
class DashboardInventoryManager {
    constructor() {
        this.inventory = [];
        this.filteredInventory = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        
        this.init();
    }

    async init() {
        await this.loadInventory();
        this.setupEventListeners();
        this.updateDashboardStats();
        this.renderInventory();
    }

    async loadInventory() {
        try {
            // Try to load from localStorage first
            const storedInventory = localStorage.getItem('inventoryData');
            if (storedInventory) {
                this.inventory = JSON.parse(storedInventory);
            } else {
                // Fallback to sample data if localStorage is empty
                this.loadSampleInventory();
            }
        } catch (error) {
            console.error('Error loading inventory from localStorage:', error);
            this.loadSampleInventory();
        }
        
        this.filteredInventory = [...this.inventory];
    }

    saveInventoryToStorage() {
        localStorage.setItem('inventoryData', JSON.stringify(this.inventory));
    }

    loadSampleInventory() {
        // Sample inventory data for dashboard
        this.inventory = [
            {
                id: 1,
                name: "Wireless Headphones",
                category: "electronics",
                price: 2999,
                originalPrice: 4999,
                stock: 45,
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
                stock: 32,
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
                stock: 67,
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
                stock: 12,
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
                stock: 78,
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
                stock: 23,
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
                stock: 56,
                image: "https://res.cloudinary.com/ds3wuvkwo/image/upload/v1756116567/download_whxsnw.jpg",
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
                stock: 89,
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
                stock: 34,
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
                stock: 19,
                image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300",
                rating: 4.6,
                reviews: 167,
                badge: "Sale"
            }
        ];
        this.saveInventoryToStorage();
    }

    setupEventListeners() {
        // Search functionality with debounce
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            let debounceTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    this.searchProducts(e.target.value);
                }, 300);
            });
        }

        // Filter functionality
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }

        const stockFilter = document.getElementById('stockFilter');
        if (stockFilter) {
            stockFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }

        // Sort functionality
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.sortProducts();
            });
        }

        // Form submission handlers
        const addForm = document.getElementById('addProductForm');
        if (addForm) {
            addForm.addEventListener('submit', this.handleAddProduct.bind(this));
        }

        const editForm = document.getElementById('editProductForm');
        if (editForm) {
            editForm.addEventListener('submit', this.handleEditProduct.bind(this));
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme);
        }

        // Navigation toggle
        const navToggle = document.getElementById('navToggle');
        if (navToggle) {
            navToggle.addEventListener('click', this.toggleNavigation);
        }
    }

    renderInventory() {
        const container = document.getElementById('inventoryTableBody');
        if (!container) return;

        container.innerHTML = '';

        this.filteredInventory.forEach(product => {
            const status = this.getStockStatus(product.stock);
            const statusClass = this.getStockClass(product.stock);
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/40x40'">
                        <div>
                            <div style="font-weight: 600;">${product.name}</div>
                            ${product.badge ? `<div style="font-size: 11px; color: var(--muted);">${product.badge}</div>` : ''}
                        </div>
                    </div>
                </td>
                <td><span class="status st-active">${product.category}</span></td>
                <td>
                    <div style="font-weight: 600;">₹${product.price.toLocaleString()}</div>
                    ${product.originalPrice > product.price ? `<div style="font-size: 12px; color: var(--muted); text-decoration: line-through;">₹${product.originalPrice.toLocaleString()}</div>` : ''}
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${this.getStockColor(product.stock)};"></span>
                        <span style="font-weight: 600;">${product.stock}</span>
                    </div>
                </td>
                <td><span class="status ${statusClass}">${status}</span></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span>⭐ ${product.rating}</span>
                        <small style="color: var(--muted);">(${product.reviews})</small>
                    </div>
                </td>
                <td>
                    <button class="action-btn view-btn" onclick="viewProduct(${product.id})">
                        <i class="fa-solid fa-eye"></i> View
                    </button>
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

    getStockStatus(stock) {
        if (stock === 0) return 'Out of Stock';
        if (stock <= 5) return 'Critical';
        if (stock <= 10) return 'Low Stock';
        return 'In Stock';
    }

    getStockClass(stock) {
        if (stock === 0) return 'st-inactive';
        if (stock <= 5) return 'st-inactive';
        if (stock <= 10) return 'st-new';
        return 'st-active';
    }

    getStockColor(stock) {
        if (stock === 0) return 'var(--danger)';
        if (stock <= 5) return 'var(--danger)';
        if (stock <= 10) return 'var(--accent)';
        return 'var(--brand-2)';
    }

    searchProducts(query) {
        if (!query) {
            this.filteredInventory = [...this.inventory];
        } else {
            this.filteredInventory = this.inventory.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase()) ||
                product.id.toString().includes(query)
            );
        }
        this.renderInventory();
    }

    filterProducts() {
        const categoryFilter = document.getElementById('categoryFilter');
        const stockFilter = document.getElementById('stockFilter');
        
        let filtered = [...this.inventory];
        
        if (categoryFilter && categoryFilter.value !== 'all') {
            filtered = filtered.filter(product => product.category === categoryFilter.value);
        }
        
        if (stockFilter && stockFilter.value !== 'all') {
            switch (stockFilter.value) {
                case 'in_stock':
                    filtered = filtered.filter(product => product.stock > 10);
                    break;
                case 'low_stock':
                    filtered = filtered.filter(product => product.stock <= 10 && product.stock > 0);
                    break;
                case 'out_of_stock':
                    filtered = filtered.filter(product => product.stock === 0);
                    break;
            }
        }
        
        this.filteredInventory = filtered;
        this.renderInventory();
    }

    sortProducts() {
        const sortFilter = document.getElementById('sortFilter');
        if (!sortFilter) return;
        
        const sorted = [...this.filteredInventory];
        
        switch (sortFilter.value) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price_high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'price_low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'stock_high':
                sorted.sort((a, b) => b.stock - a.stock);
                break;
            case 'stock_low':
                sorted.sort((a, b) => a.stock - b.stock);
                break;
            case 'newest':
                sorted.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }
        
        this.filteredInventory = sorted;
        this.renderInventory();
    }

    updateDashboardStats() {
        const totalProducts = this.inventory.length;
        const totalValue = this.inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
        const lowStockItems = this.inventory.filter(item => item.stock <= 10 && item.stock > 0).length;
        const outOfStock = this.inventory.filter(item => item.stock === 0).length;

        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('totalValue').textContent = '₹' + totalValue.toLocaleString();
        document.getElementById('lowStockItems').textContent = lowStockItems;
        document.getElementById('outOfStock').textContent = outOfStock;
    }

    async addProduct(productData) {
        try {
            const newProduct = {
                id: this.inventory.length > 0 ? Math.max(...this.inventory.map(p => p.id)) + 1 : 1,
                ...productData,
                reviews: productData.reviews || 0,
                badge: productData.badge || null
            };
            
            this.inventory.push(newProduct);
            this.saveInventoryToStorage();

            this.filteredInventory = [...this.inventory];
            this.renderInventory();
            this.updateDashboardStats();
            return true;
        } catch (error) {
            console.error('Error adding product:', error);
            return false;
        }
    }

    async updateProduct(productId, productData) {
        try {
            const index = this.inventory.findIndex(p => p.id === productId);
            if (index !== -1) {
                this.inventory[index] = { ...this.inventory[index], ...productData };
                this.saveInventoryToStorage();
            }

            this.filteredInventory = [...this.inventory];
            this.renderInventory();
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
            this.inventory = this.inventory.filter(p => p.id !== productId);
            this.saveInventoryToStorage();

            this.filteredInventory = [...this.inventory];
            this.renderInventory();
            this.updateDashboardStats();
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    }

    toggleTheme() {
        document.documentElement.classList.toggle('light');
        const isLight = document.documentElement.classList.contains('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    toggleNavigation() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
        document.body.classList.toggle('nav-open');
    }

    // Form handlers
    async handleAddProduct(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')) || 0,
            originalPrice: parseFloat(formData.get('originalPrice')) || parseFloat(formData.get('price')) || 0,
            stock: parseInt(formData.get('stock')) || 0,
            image: formData.get('image') || '',
            rating: parseFloat(formData.get('rating')) || 0,
            badge: formData.get('badge') || null
        };

        const success = await this.addProduct(productData);
        if (success) {
            closeAddProductModal();
            alert('Product added successfully!');
        } else {
            alert('Failed to add product. Please try again.');
        }
    }

    async handleEditProduct(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const productId = parseInt(formData.get('id'));
        const productData = {
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')) || 0,
            originalPrice: parseFloat(formData.get('originalPrice')) || parseFloat(formData.get('price')) || 0,
            stock: parseInt(formData.get('stock')) || 0,
            image: formData.get('image') || '',
            rating: parseFloat(formData.get('rating')) || 0,
            badge: formData.get('badge') || null
        };

        const success = await this.updateProduct(productId, productData);
        if (success) {
            closeEditProductModal();
            alert('Product updated successfully!');
        } else {
            alert('Failed to update product. Please try again.');
        }
    }
}

// Global instance
let inventoryManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light');
    }

    inventoryManager = new DashboardInventoryManager();
});

// Modal functions
function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.style.display = 'block';
}

function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
    document.getElementById('addProductForm').reset();
}

function openEditProductModal(productId) {
    const product = inventoryManager.inventory.find(p => p.id === productId);
    if (product) {
        const form = document.getElementById('editProductForm');
        form.elements.id.value = product.id;
        form.elements.name.value = product.name;
        form.elements.category.value = product.category;
        form.elements.price.value = product.price;
        form.elements.originalPrice.value = product.originalPrice || '';
        form.elements.stock.value = product.stock;
        form.elements.image.value = product.image || '';
        form.elements.rating.value = product.rating || '';
        form.elements.badge.value = product.badge || '';
        
        document.getElementById('editProductModal').style.display = 'block';
    }
}

function closeEditProductModal() {
    document.getElementById('editProductModal').style.display = 'none';
}

function viewProduct(productId) {
    const product = inventoryManager.inventory.find(p => p.id === productId);
    if (product) {
        alert(`Product Details:\n\nName: ${product.name}\nCategory: ${product.category}\nPrice: ₹${product.price}\nStock: ${product.stock}\nRating: ${product.rating}\nReviews: ${product.reviews}\nBadge: ${product.badge || 'None'}`);
    }
}

// Global delete function
async function deleteProduct(productId) {
    const success = await inventoryManager.deleteProduct(productId);
    if (success) {
        alert('Product deleted successfully!');
    } else {
        alert('Failed to delete product. Please try again.');
    }
}

// Global filter functions
function filterProducts() {
    inventoryManager.filterProducts();
}

function sortProducts() {
    inventoryManager.sortProducts();
}
