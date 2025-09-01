// Authentication System - Pure HTML/CSS/JS
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.checkAuthStatus();
    }

    loadUsers() {
        const users = localStorage.getItem('vsv_users');
        return users ? JSON.parse(users) : [];
    }

    saveUsers() {
        localStorage.setItem('vsv_users', JSON.stringify(this.users));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    hashPassword(password) {
        // Simple hashing for demo - in production use proper encryption
        return btoa(password);
    }

    verifyPassword(password, hash) {
        return btoa(password) === hash;
    }

    register(userData) {
        const { email, password, fullname, phone, dob, gender } = userData;

        // Validation
        if (!email || !password || !fullname) {
            throw new Error('Please fill in all required fields');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        if (this.users.find(u => u.email === email)) {
            throw new Error('Email already registered');
        }

        const user = {
            id: this.generateId(),
            email,
            password: this.hashPassword(password),
            fullname,
            phone,
            dob,
            gender,
            createdAt: new Date().toISOString(),
            addresses: [],
            paymentMethods: [],
            orders: [],
            wishlist: []
        };

        this.users.push(user);
        this.saveUsers();
        return user;
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            throw new Error('User not found');
        }

        if (!this.verifyPassword(password, user.password)) {
            throw new Error('Invalid password');
        }

        this.currentUser = user;
        localStorage.setItem('vsv_currentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('vsv_currentUser');
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const stored = localStorage.getItem('vsv_currentUser');
            if (stored) {
                this.currentUser = JSON.parse(stored);
            }
        }
        return this.currentUser;
    }

    isLoggedIn() {
        return !!this.getCurrentUser();
    }

    updateProfile(userData) {
        const user = this.getCurrentUser();
        if (!user) throw new Error('Not logged in');

        const userIndex = this.users.findIndex(u => u.id === user.id);
        if (userIndex === -1) throw new Error('User not found');

        this.users[userIndex] = { ...this.users[userIndex], ...userData };
        this.currentUser = this.users[userIndex];
        
        this.saveUsers();
        localStorage.setItem('vsv_currentUser', JSON.stringify(this.currentUser));
        
        return this.currentUser;
    }

    changePassword(currentPassword, newPassword) {
        const user = this.getCurrentUser();
        if (!user) throw new Error('Not logged in');

        if (!this.verifyPassword(currentPassword, user.password)) {
            throw new Error('Current password is incorrect');
        }

        const userIndex = this.users.findIndex(u => u.id === user.id);
        this.users[userIndex].password = this.hashPassword(newPassword);
        
        this.saveUsers();
        return true;
    }

    addAddress(address) {
        const user = this.getCurrentUser();
        if (!user) throw new Error('Not logged in');

        const userIndex = this.users.findIndex(u => u.id === user.id);
        this.users[userIndex].addresses.push({ ...address, id: this.generateId() });
        
        this.saveUsers();
        this.updateCurrentUser();
    }

    updateCurrentUser() {
        const user = this.getCurrentUser();
        if (user) {
            const updatedUser = this.users.find(u => u.id === user.id);
            this.currentUser = updatedUser;
            localStorage.setItem('vsv_currentUser', JSON.stringify(updatedUser));
        }
    }

    checkAuthStatus() {
        const user = this.getCurrentUser();
        if (user) {
            document.body.classList.add('logged-in');
            document.body.classList.remove('logged-out');
        } else {
            document.body.classList.add('logged-out');
            document.body.classList.remove('logged-in');
        }
    }
}

// Initialize auth system
const auth = new AuthSystem();
