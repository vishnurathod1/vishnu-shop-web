// Shopping Cart System - Add to Cart Functionality
// This file provides comprehensive cart functionality for all pages

class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartDisplay();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('shoppingCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
    }

    // Add item to cart
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1,
                category: product.category || 'general'
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart!`);
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, newQuantity);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    // Get total items in cart
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Get total price
    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    // Update cart display across all pages
    updateCartDisplay() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = this.getTotalItems();
        });

        // Update cart preview if exists
        this.updateCartPreview();
    }

    // Update cart preview (for dropdown or sidebar)
    updateCartPreview() {
        const cartPreview = document.getElementById('cart-preview');
        if (cartPreview) {
            cartPreview.innerHTML = '';
            
            if (this.cart.length === 0) {
                cartPreview.innerHTML = '<p>Your cart is empty</p>';
                return;
            }

            this.cart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-preview-item';
                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">
                    <div>
                        <h4>${item.name}</h4>
                        <p>₹${item.price} x ${item.quantity}</p>
                    </div>
                    <button onclick="cart.removeFromCart('${item.id}')" style="background: none; border: none; color: red;">×</button>
                `;
                cartPreview.appendChild(itemDiv);
            });

            const totalDiv = document.createElement('div');
            totalDiv.className = 'cart-preview-total';
            totalDiv.innerHTML = `
                <strong>Total: ₹${this.getTotalPrice()}</strong>
                <button onclick="window.location.href='cart.html'" class="view-cart-btn">View Cart</button>
            `;
            cartPreview.appendChild(totalDiv);
        }
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #32CD32;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Initialize cart buttons on page load
    initializeCartButtons() {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const product = {
                    id: productCard.dataset.productId || Math.random().toString(36).substr(2, 9),
                    name: productCard.querySelector('.product-title').textContent,
                    price: parseFloat(productCard.querySelector('.current-price').textContent.replace('₹', '')),
                    image: productCard.querySelector('.product-image').src,
                    category: productCard.dataset.category || 'general'
                };
                
                this.addToCart(product);
            });
        });
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Global functions for HTML onclick handlers
function addToCart(productId, name, price, image, category) {
    cart.addToCart({
        id: productId,
        name: name,
        price: price,
        image: image,
        category: category
    });
}

function removeFromCart(productId) {
    cart.removeFromCart(productId);
}

function updateQuantity(productId, quantity) {
    cart.updateQuantity(productId, parseInt(quantity));
}

function clearCart() {
    cart.clearCart();
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    cart.initializeCartButtons();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .cart-preview-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .cart-preview-total {
            padding: 10px;
            text-align: center;
            border-top: 1px solid #eee;
        }
        .view-cart-btn {
            background: #228B22;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 3px;
            cursor: pointer;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);
});
