 // Dashboard Customers Management JavaScript
class DashboardCustomersManager {
    constructor() {
        this.customers = [];
        this.filteredCustomers = [];
        this.currentPage = 1;
        this.itemsPerPage = 5;
        
        this.init();
    }

    async init() {
        await this.loadCustomers();
        this.setupEventListeners();
        this.updateDashboardStats();
    }

    async loadCustomers() {
        try {
            // Try to load from localStorage first
            const storedCustomers = localStorage.getItem('customersData');
            if (storedCustomers) {
                this.customers = JSON.parse(storedCustomers);
            } else {
                // Fallback to sample data if localStorage is empty
                this.loadSampleCustomers();
            }
        } catch (error) {
            console.error('Error loading customers from localStorage:', error);
            this.loadSampleCustomers();
        }
        
        this.filteredCustomers = [...this.customers];
        this.renderCustomers();
    }

    saveCustomersToStorage() {
        localStorage.setItem('customersData', JSON.stringify(this.customers));
    }

    loadSampleCustomers() {
        // Sample customer data for dashboard
        this.customers = [
            {
                id: 1,
                name: "Rohit Kumar",
                email: "rohit@email.com",
                phone: "9112180623",
                orders: 5,
                totalSpent: 8200,
                lastOrder: "2025-08-12",
                status: "active"
            },
            {
                id: 2,
                name: "Neha Sharma",
                email: "neha@email.com",
                phone: "8605180623",
                orders: 3,
                totalSpent: 4500,
                lastOrder: "2025-08-12",
                status: "active"
            },
            {
                id: 3,
                name: "Imran Shaikh",
                email: "imran@email.com",
                phone: "9087654567",
                orders: 2,
                totalSpent: 2099,
                lastOrder: "2025-08-11",
                status: "active"
            },
            {
                id: 4,
                name: "Pooja Patel",
                email: "pooja@email.com",
                phone: "9112647623",
                orders: 1,
                totalSpent: 6250,
                lastOrder: "2025-08-11",
                status: "inactive"
            },
            {
                id: 5,
                name: "Amit Verma",
                email: "amit@email.com",
                phone: "9876543210",
                orders: 0,
                totalSpent: 0,
                lastOrder: "",
                status: "new"
            },
            {
                id: 6,
                name: "Sneha Reddy",
                email: "sneha@email.com",
                phone: "9988776655",
                orders: 7,
                totalSpent: 12500,
                lastOrder: "2025-08-14",
                status: "active"
            },
            {
                id: 7,
                name: "Vikram Singh",
                email: "vikram@email.com",
                phone: "8877665544",
                orders: 4,
                totalSpent: 5600,
                lastOrder: "2025-08-10",
                status: "active"
            },
            {
                id: 8,
                name: "Priya Desai",
                email: "priya@email.com",
                phone: "7766554433",
                orders: 0,
                totalSpent: 0,
                lastOrder: "",
                status: "new"
            }
        ];
        this.saveCustomersToStorage();
    }

    setupEventListeners() {
        // Search functionality with debounce
        const searchInput = document.getElementById('customerSearch');
        if (searchInput) {
            let debounceTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    this.searchCustomers(e.target.value);
                }, 300);
            });
        }

        // Filter functionality
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.filterCustomers();
            });
        }

        // Sort functionality
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.sortCustomers();
            });
        }

        // Form submission handlers
        const addForm = document.getElementById('addCustomerForm');
        if (addForm) {
            addForm.addEventListener('submit', handleAddCustomer);
        }

        const editForm = document.getElementById('editCustomerForm');
        if (editForm) {
            editForm.addEventListener('submit', handleEditCustomer);
        }
    }

    renderCustomers() {
        const container = document.getElementById('customersTableBody');
        if (!container) return;

        container.innerHTML = '';

        this.filteredCustomers.forEach(customer => {
            const row = document.createElement('tr');
            
            const statusClass = this.getStatusClass(customer.status);
            const statusText = this.getStatusText(customer.status);

            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--brand), var(--brand-2)); display: grid; place-items: center; font-weight: bold;">
                            ${customer.name.charAt(0)}
                        </div>
                        <div>
                            <div style="font-weight: 600;">${customer.name}</div>
                            <div style="font-size: 12px; color: var(--muted);">ID: CUST-${customer.id.toString().padStart(4, '0')}</div>
                        </div>
                    </div>
                </td>
                <td>${customer.email}</td>
                <td>${customer.orders}</td>
                <td>${customer.phone}</td>
                <td>₹${customer.totalSpent.toLocaleString()}</td>
                <td>${customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'N/A'}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="action-btn view-btn" onclick="viewCustomer(${customer.id})">
                        <i class="fa-solid fa-eye"></i> View
                    </button>
                    <button class="action-btn edit-btn" onclick="openEditCustomerModal(${customer.id})">
                        <i class="fa-solid fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteCustomer(${customer.id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            `;
            
            container.appendChild(row);
        });
    }

    getStatusClass(status) {
        switch (status) {
            case 'active': return 'st-active';
            case 'inactive': return 'st-inactive';
            case 'new': return 'st-new';
            default: return 'st-active';
        }
    }

    getStatusText(status) {
        switch (status) {
            case 'active': return 'Active';
            case 'inactive': return 'Inactive';
            case 'new': return 'New';
            default: return 'Active';
        }
    }

    searchCustomers(query) {
        if (!query) {
            this.filteredCustomers = [...this.customers];
        } else {
            this.filteredCustomers = this.customers.filter(customer =>
                customer.name.toLowerCase().includes(query.toLowerCase()) ||
                customer.email.toLowerCase().includes(query.toLowerCase()) ||
                customer.phone.includes(query) ||
                customer.id.toString().includes(query)
            );
        }
        this.renderCustomers();
    }

    filterCustomers() {
        const statusFilter = document.getElementById('statusFilter');
        
        let filtered = [...this.customers];
        
        if (statusFilter && statusFilter.value !== 'all') {
            filtered = filtered.filter(customer => customer.status === statusFilter.value);
        }
        
        this.filteredCustomers = filtered;
        this.renderCustomers();
    }

    sortCustomers() {
        const sortFilter = document.getElementById('sortFilter');
        if (!sortFilter) return;
        
        const sorted = [...this.filteredCustomers];
        
        switch (sortFilter.value) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'orders':
                sorted.sort((a, b) => b.orders - a.orders);
                break;
            case 'spent':
                sorted.sort((a, b) => b.totalSpent - a.totalSpent);
                break;
            case 'recent':
                sorted.sort((a, b) => new Date(b.lastOrder) - new Date(a.lastOrder));
                break;
            case 'newest':
                sorted.sort((a, b) => b.id - a.id);
                break;
            default:
                break;
        }
        
        this.filteredCustomers = sorted;
        this.renderCustomers();
    }

    updateDashboardStats() {
        const totalCustomers = this.customers.length;
        const activeCustomers = this.customers.filter(c => c.status === 'active').length;
        const totalRevenue = this.customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
        const avgOrderValue = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;

        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('activeCustomers').textContent = activeCustomers;
        document.getElementById('totalRevenue').textContent = '₹' + totalRevenue.toLocaleString();
        document.getElementById('avgOrderValue').textContent = '₹' + avgOrderValue.toLocaleString();
    }

    async addCustomer(customerData) {
        try {
            // Add locally and save to storage
            const newCustomer = {
                id: this.customers.length > 0 ? Math.max(...this.customers.map(c => c.id)) + 1 : 1,
                ...customerData,
                orders: 0,
                lastOrder: customerData.lastOrder || ""
            };
            this.customers.push(newCustomer);
            this.saveCustomersToStorage();

            this.filteredCustomers = [...this.customers];
            this.renderCustomers();
            this.updateDashboardStats();
            return true;
        } catch (error) {
            console.error('Error adding customer:', error);
            return false;
        }
    }

    async updateCustomer(customerId, customerData) {
        try {
            // Update locally and save to storage
            const index = this.customers.findIndex(c => c.id === customerId);
            if (index !== -1) {
                this.customers[index] = { ...this.customers[index], ...customerData };
                this.saveCustomersToStorage();
            }

            this.filteredCustomers = [...this.customers];
            this.renderCustomers();
            this.updateDashboardStats();
            return true;
        } catch (error) {
            console.error('Error updating customer:', error);
            return false;
        }
    }

    async deleteCustomer(customerId) {
        if (!confirm('Are you sure you want to delete this customer?')) {
            return false;
        }

        try {
            // Try to delete via API (simulated)
            const response = { ok: false }; // Simulate API failure

            if (response.ok || response.status === 404) {
                this.customers = this.customers.filter(c => c.id !== customerId);
            } else {
                // Fallback: Delete locally
                this.customers = this.customers.filter(c => c.id !== customerId);
            }

            this.filteredCustomers = [...this.customers];
            this.renderCustomers();
            this.updateDashboardStats();
            return true;
        } catch (error) {
            console.error('Error deleting customer:', error);
            return false;
        }
    }
}

// Global instance
let customersManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    customersManager = new DashboardCustomersManager();
});

// Modal functions
function openAddCustomerModal() {
    console.log("Opening Add Customer Modal"); // Added log for debugging
    const modal = document.getElementById('addCustomerModal');
    modal.style.display = 'block';
}

function closeAddCustomerModal() {
    document.getElementById('addCustomerModal').style.display = 'none';
    document.getElementById('addCustomerForm').reset();
}

function openEditCustomerModal(customerId) {
    const customer = customersManager.customers.find(c => c.id === customerId);
    if (customer) {
        const form = document.getElementById('editCustomerForm');
        form.elements.id.value = customer.id;
        form.elements.name.value = customer.name;
        form.elements.email.value = customer.email;
        form.elements.phone.value = customer.phone;
        form.elements.totalSpent.value = customer.totalSpent;
        form.elements.lastOrder.value = customer.lastOrder;
        form.elements.status.value = customer.status;
        
        document.getElementById('editCustomerModal').style.display = 'block';
    }
}

function closeEditCustomerModal() {
    document.getElementById('editCustomerModal').style.display = 'none';
}

function viewCustomer(customerId) {
    const customer = customersManager.customers.find(c => c.id === customerId);
    if (customer) {
        alert(`Customer Details:\n\nName: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nOrders: ${customer.orders}\nTotal Spent: ₹${customer.totalSpent.toLocaleString()}\nLast Order: ${customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'N/A'}\nStatus: ${customer.status}`);
    }
}

// Form handlers
async function handleAddCustomer(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        totalSpent: parseFloat(formData.get('totalSpent')) || 0,
        lastOrder: formData.get('lastOrder'),
        status: formData.get('status')
    };

    const success = await customersManager.addCustomer(customerData);
    if (success) {
        closeAddCustomerModal();
        alert('Customer added successfully!');
    } else {
        alert('Failed to add customer. Please try again.');
    }
}

async function handleEditCustomer(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customerId = parseInt(formData.get('id'));
    const customerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        totalSpent: parseFloat(formData.get('totalSpent')) || 0,
        lastOrder: formData.get('lastOrder'),
        status: formData.get('status')
    };

    const success = await customersManager.updateCustomer(customerId, customerData);
    if (success) {
        closeEditCustomerModal();
        alert('Customer updated successfully!');
    } else {
        alert('Failed to update customer. Please try again.');
    }
}

// Global delete function
async function deleteCustomer(customerId) {
    const success = await customersManager.deleteCustomer(customerId);
    if (success) {
        alert('Customer deleted successfully!');
    } else {
        alert('Failed to delete customer. Please try again.');
    }
}

// Global filter functions
function filterCustomers() {
    customersManager.filterCustomers();
}

function sortCustomers() {
    customersManager.sortCustomers();
}
