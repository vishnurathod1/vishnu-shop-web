// Enhanced Customer Account JavaScript with Modern Features

class CustomerAccount {
    constructor() {
        this.customerData = this.loadCustomerData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCustomerData();
        this.setupAnimations();
        this.setupFormValidation();
        this.setupResponsiveMenu();
    }

    // Enhanced Data Management
    loadCustomerData() {
        const defaultData = {
            profile: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                dob: '',
                gender: ''
            },
            address: {
                address1: '',
                address2: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            },
            payment: {
                cardName: '',
                cardNumber: '',
                expiryDate: '',
                cvv: ''
            },
            preferences: {
                emailNotifications: true,
                smsNotifications: false,
                promotionalEmails: true
            },
            orders: [],
            wishlist: []
        };
        
        const savedData = localStorage.getItem('customerData');
        return savedData ? { ...defaultData, ...JSON.parse(savedData) } : defaultData;
    }

    saveCustomerData() {
        localStorage.setItem('customerData', JSON.stringify(this.customerData));
        this.showNotification('Changes saved successfully!', 'success');
    }

    // Form Validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateForm(form);
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        return isValid;
    }

    showFieldError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.8em';
        errorDiv.style.marginTop = '4px';
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorDiv);
        }
        
        input.style.borderColor = '#ef4444';
    }

    clearFieldError(input) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.style.borderColor = '#e5e7eb';
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.account-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href');
                this.navigateToSection(target);
            });
        });

        // Form inputs
        document.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateCustomerData(e.target);
            });
        });

        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', this.formatCardNumber);
        }

        // Phone number formatting
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.formatPhoneNumber);
        }

        // Password visibility toggle
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', this.togglePasswordVisibility);
        });
    }

    // Navigation
    navigateToSection(target) {
        // Remove active class from all menu items
        document.querySelectorAll('.account-menu a').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to clicked menu item
        document.querySelector(`[href="${target}"]`).classList.add('active');

        // Hide all sections
        document.querySelectorAll('.profile-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.querySelector(target);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.classList.add('fade-in');
        }
    }

    // Data Updates
    updateCustomerData(input) {
        const field = input.id;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        
        // Update nested data structure
        if (field.includes('Address')) {
            this.customerData.address[field.replace('Address', '').toLowerCase()] = value;
        } else if (field.includes('Card')) {
            this.customerData.payment[field.replace('Card', '').toLowerCase()] = value;
        } else if (['emailNotifications', 'smsNotifications', 'promotionalEmails'].includes(field)) {
            this.customerData.preferences[field] = value;
        } else {
            this.customerData.profile[field] = value;
        }

        // Update display name
        if (field === 'firstName' || field === 'lastName') {
            this.updateDisplayName();
        }
    }

    updateDisplayName() {
        const firstName = document.getElementById('firstName').value || 'Customer';
        const lastName = document.getElementById('lastName').value || 'Name';
        document.getElementById('customerName').textContent = `${firstName} ${lastName}`;
    }

    // Formatting Functions
    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        e.target.value = value;
    }

    togglePasswordVisibility(e) {
        const passwordInput = e.target.previousElementSibling;
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        e.target.classList.toggle('fa-eye');
        e.target.classList.toggle('fa-eye-slash');
    }

    // Animations
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        });

        document.querySelectorAll('.profile-section').forEach(section => {
            observer.observe(section);
        });
    }

    // Responsive Menu
    setupResponsiveMenu() {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.style.display = 'none';
        
        const sidebar = document.querySelector('.account-sidebar');
        sidebar.insertBefore(menuToggle, sidebar.firstChild);

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });

        // Handle responsive behavior
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                menuToggle.style.display = 'block';
            } else {
                menuToggle.style.display = 'none';
                sidebar.classList.remove('mobile-open');
            }
        });
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        switch(type) {
            case 'success':
                notification.style.background = '#10b981';
                break;
            case 'error':
                notification.style.background = '#ef4444';
                break;
            case 'warning':
                notification.style.background = '#f59e0b';
                break;
            default:
                notification.style.background = '#667eea';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Enhanced Save Functions
    saveAddress() {
        if (this.validateAddress()) {
            this.saveCustomerData();
        }
    }

    savePayment() {
        if (this.validatePayment()) {
            this.saveCustomerData();
        }
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Please fill in all password fields', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        this.showNotification('Password changed successfully', 'success');
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    validateAddress() {
        const requiredFields = ['address1', 'city', 'state', 'zipCode', 'country'];
        let isValid = true;

        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            }
        });

        return isValid;
    }

    validatePayment() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        if (cardNumber.length !== 16) {
            this.showNotification('Please enter a valid 16-digit card number', 'error');
            return false;
        }

        if (!expiryDate) {
            this.showNotification('Please enter expiry date', 'error');
            return false;
        }

        if (cvv.length !== 3) {
            this.showNotification('Please enter a valid 3-digit CVV', 'error');
            return false;
        }

        return true;
    }

    // Utility Functions
    exportData() {
        const dataStr = JSON.stringify(this.customerData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'customer-data.json';
        link.click();
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.customerData = { ...this.customerData, ...data };
                this.saveCustomerData();
                this.loadCustomerData();
                this.showNotification('Data imported successfully', 'success');
            } catch (error) {
                this.showNotification('Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the enhanced customer account
document.addEventListener('DOMContentLoaded', () => {
    new CustomerAccount();
});

// Additional utility functions
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
