// Deals Page JavaScript
class DealsManager {
    constructor() {
        this.deals = this.getDefaultDeals();
        this.init();
    }

    init() {
        this.loadDealsFromStorage();
        this.renderDeals();
    }

    getDefaultDeals() {
        return [
            {
                id: 1,
                title: 'Diwali Dhamaka',
                description: 'Flat 25% off on all products',
                discount: 25,
                discountType: 'percentage',
                category: 'all',
                startDate: '2024-10-20',
                endDate: '2024-10-30',
                image: 'https://res.cloudinary.com/ds3wuvkwo/image/upload/v1756729339/7cebcf86-6f86-41e8-888c-8b4568ebeebc_zvlp4e.jpg',
                link: 'products.html'
            },
            {
                id: 2,
                title: 'Weekend Offer',
                description: 'Buy 1 Get 1 Free on selected items',
                discount: 50,
                discountType: 'percentage',
                category: 'clothing',
                startDate: '2024-09-02',
                endDate: '2024-09-04',
                image: 'https://res.cloudinary.com/ds3wuvkwo/image/upload/v1756814031/Fotos_de_Clothing_-_Descarga_fotos_gratis_de_gran_calidad___Freepik_iggwdw.jpg',
                link: 'clothing.html'
            },
            {
                id: 3,
                title: 'Festive Combo',
                description: 'Extra ₹1000 off on orders above ₹5000',
                discount: 1000,
                discountType: 'fixed',
                category: 'all',
                startDate: '2024-09-10',
                endDate: '2024-09-20',
                image: 'https://res.cloudinary.com/ds3wuvkwo/image/upload/v1756814035/Premium_Photo___Realistic_Blur_Background_of_Store_s3xx0z.jpg',
                link: 'products.html'
            },
            {
                id: 4,
                title: 'Flash Sale',
                description: '50% off on electronics',
                discount: 50,
                discountType: 'percentage',
                category: 'electronics',
                startDate: '2024-08-30',
                endDate: '2024-09-01',
                image: 'https://res.cloudinary.com/ds3wuvkwo/image/upload/v1756714865/Apple_prouduct_iphone_applesmartwatch_macbook_nnfyf7.jpg',
                link: 'electronics.html'
            },
            {
                id: 5,
                title: 'Back to School',
                description: '20% off on stationery and books',
                discount: 20,
                discountType: 'percentage',
                category: 'books',
                startDate: '2024-08-15',
                endDate: '2024-08-31',
                image: 'https://res.cloudinary.com/ds3wuvkwo/image/upload/v1756725220/8b5a04db-08bb-4c5f-8192-b5a33cfd3fee_cseol3.jpg',
                link: 'books and media.html'
            },
            {
                id: 6,
                title: 'Summer Clearance',
                description: 'Up to 70% off on summer collection',
                discount: 70,
                discountType: 'percentage',
                category: 'clothing',
                startDate: '2024-07-01',
                endDate: '2024-07-31',
                image: 'https://res.cloudinary.com/ds3wuvkwo/image/upload/v1756809882/This_white_cotton_shirt_is_breathable_tailored_jyij2l.jpg',
                link: 'clothing.html'
            }
        ];
    }

    loadDealsFromStorage() {
        const storedDeals = localStorage.getItem('vsv_deals');
        if (storedDeals) {
            this.deals = JSON.parse(storedDeals);
        }
    }

    saveDealsToStorage() {
        localStorage.setItem('vsv_deals', JSON.stringify(this.deals));
    }

    renderDeals() {
        const dealsGrid = document.getElementById('deals-grid');
        if (!dealsGrid) return;

        dealsGrid.innerHTML = '';

        const activeDeals = this.getActiveDeals();

        if (activeDeals.length === 0) {
            dealsGrid.innerHTML = '<p class="no-deals">No active deals at the moment. Check back soon!</p>';
            return;
        }

        activeDeals.forEach(deal => {
            const dealCard = this.createDealCard(deal);
            dealsGrid.appendChild(dealCard);
        });
    }

    getActiveDeals() {
        const now = new Date();
        return this.deals.filter(deal => {
            const endDate = new Date(deal.endDate);
            return endDate >= now;
        });
    }

    createDealCard(deal) {
        const card = document.createElement('div');
        card.className = 'product-card deal-card';

        const discountText = deal.discountType === 'percentage'
            ? `${deal.discount}% OFF`
            : `₹${deal.discount} OFF`;

        card.innerHTML = `
            <div class="product-badge">${discountText}</div>
            <img src="${deal.image}" alt="${deal.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${deal.title}</h3>
                <p class="product-description">${deal.description}</p>
                <div class="deal-details">
                    <p><i class="fas fa-calendar"></i> Valid till: ${this.formatDate(deal.endDate)}</p>
                    <p><i class="fas fa-tag"></i> Category: ${deal.category === 'all' ? 'All Products' : deal.category}</p>
                </div>
                <a href="${deal.link}" class="shop-now-btn">Shop Now</a>
            </div>
        `;

        return card;
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    // Method to add new deal (could be used by admin)
    addDeal(deal) {
        deal.id = Date.now();
        this.deals.push(deal);
        this.saveDealsToStorage();
        this.renderDeals();
    }

    // Method to remove expired deals
    removeExpiredDeals() {
        const now = new Date();
        this.deals = this.deals.filter(deal => {
            const endDate = new Date(deal.endDate);
            return endDate >= now;
        });
        this.saveDealsToStorage();
        this.renderDeals();
    }
}

// Initialize deals manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dealsManager = new DealsManager();

    // Clean up expired deals on page load
    window.dealsManager.removeExpiredDeals();
});
