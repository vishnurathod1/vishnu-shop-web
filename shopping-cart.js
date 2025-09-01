// Complete Shopping Cart System for Beauty Products
class ShoppingCart {
    constructor() {
        this.cart = [];
        this.total = 0;
        this.cartCount = 0;
        this.init();
    }

    init() {
        this.loadCartFromStorage();
        this.updateCartDisplay();
        this.bindEvents();
    }

    // Load cart from localStorage
    loadCartFromStorage() {
        const savedCart = localStorage.getItem('beautyCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.calculateTotal();
            this.updateCartCount();
        }
    }

    // Save cart to localStorage
    saveCartToStorage() {
        localStorage.setItem('beautyCart', JSON.stringify(this.cart));
    }

    // Bind events to buttons
    bindEvents() {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => this.addToCart(e));
        });

        document.querySelectorAll('.buy-now-btn').forEach(button => {
            button.addEventListener('click', (e) => this.buyNow(e));
        });
    }

    // Extract product data from card
    extractProductData(productCard) {
        return {
            id: productCard.dataset.productId || Date.now(),
            name: productCard.querySelector('.product-title').textContent,
            price: parseFloat(productCard.querySelector('.current-price').textContent.replace('₹', '').replace(',', '')),
            originalPrice: productCard.querySelector('.original-price') ? 
                parseFloat(productCard.querySelector('.original-price').textContent.replace('₹', '').replace(',', '')) : null,
            image: productCard.querySelector('.product-image').src,
            quantity: 1
        };
    }

    // Add product to cart
    addToCart(event) {
        const productCard = event.target.closest('.product-card');
        const productData = this.extractProductData(productCard);
        
        const existingItem = this.cart.find(item => item.id === productData.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push(productData);
        }
        
        this.calculateTotal();
        this.updateCartCount();
        this.saveCartToStorage();
        this.updateCartDisplay();
        
        this.showCartFeedback(event.target, 'Added to Cart!');
    }

    // Buy now functionality
    buyNow(event) {
        const productCard = event.target.closest('.product-card');
        const productData = this.extractProductData(productCard);
        
        const checkoutCart = [{
            ...productData,
            quantity: 1
        }];
        
        this.redirectToCheckout(checkoutCart);
    }

    // Redirect to checkout
    redirectToCheckout(items) {
        const checkoutUrl = `checkout.html?items=${encodeURIComponent(JSON.stringify(items))}`;
        window.location.href = checkoutUrl;
    }

    // Calculate total
    calculateTotal() {
        this.total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Update cart count
    updateCartCount() {
        this.cartCount = this.cart.reduce((count, item) => count + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.cartCount;
        }
    }

    // Update cart display
    updateCartDisplay() {
        this.updateCartCount();
        
        if (document.getElementById('cart-items')) {
            this.renderCartItems();
        }
        
        this.updateCartSummary();
    }

    // Render cart items
    renderCartItems() {
        const cartContainer = document.getElementById('cart-items');
        if (!cartContainer) return;

        cartContainer.innerHTML = '';
        
        if (this.cart.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">
                    ₹${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-btn" data-id="${item.id}">×</button>
            `;
            cartContainer.appendChild(cartItem);
        });

        this.bindCartItemEvents();
    }

    // Bind cart item events
    bindCartItemEvents() {
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => this.updateQuantity(e.target.dataset.id, -1));
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => this.updateQuantity(e.target.dataset.id, 1));
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.removeFromCart(e.target.dataset.id));
        });
    }

    // Update quantity
    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.calculateTotal();
                this.updateCartCount();
                this.saveCartToStorage();
                this.updateCartDisplay();
            }
        }
    }

    // Remove from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.calculateTotal();
        this.updateCartCount();
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    // Update cart summary
    updateCartSummary() {
        const subtotalElement = document.getElementById('cart-subtotal');
        const totalElement = document.getElementById('cart-total');
        
        if (subtotalElement) {
            subtotalElement.textContent = `₹${this.total.toFixed(2)}`;
        }
        
        if (totalElement) {
            totalElement.textContent = `₹${this.total.toFixed(2)}`;
        }
    }

    // Show feedback
    showCartFeedback(button, message) {
        const originalText = button.textContent;
        button.textContent = message;
        button.style.background = '#4CAF50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'linear-gradient(45deg, #ff69b4, #ff1493)';
        }, 1500);
    }

    // Get cart items
    getCartItems() {
        return this.cart;
    }

    // Get total
    getTotal() {
        return this.total;
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.total = 0;
        this.cartCount = 0;
        this.saveCartToStorage();
        this.updateCartDisplay();
    }
}

// Initialize cart system
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
});
