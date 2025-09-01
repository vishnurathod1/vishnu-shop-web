// Universal Search Functionality for VSV ShopEasy
// This script provides search functionality across all pages

// Product and category data
const searchData = {
    categories: {
        'electronics': 'electronics.html',
        'clothing': 'clothing.html',
        'home decor': 'Home and decor.html',
        'beauty': 'beauty.html',
        'footwear': 'footwear.html',
        'sports': 'sports-new.html',
        'kids toys': 'kids-toys.html',
        'groceries': 'groceries.html',
        'books': 'books and media.html',
        'luggage faves': 'luggage faves.html',
        'health': 'Health and personal care.html',
        'personal care': 'Health and personal care.html',
        'accessories': 'accessories.html',
        'new arrivals': 'new-arrivals.html',
        'deals': 'deals.html',
        'products': 'products.html'
    },
    products: {
        // Electronics
        'iphone 15 pro': 'electronics.html',
        'samsung galaxy s24': 'electronics.html',
        'google pixel 8': 'electronics.html',
        'oneplus 12': 'electronics.html',
        'xiaomi 14': 'electronics.html',
        'macbook pro': 'electronics.html',
        'dell xps 15': 'electronics.html',
        'hp spectre x360': 'electronics.html',
        'lenovo thinkpad': 'electronics.html',
        'asus rog strix': 'electronics.html',
        'canon eos r6': 'electronics.html',
        'sony a7 iv': 'electronics.html',
        'nikon z6 ii': 'electronics.html',
        'fujifilm x-t5': 'electronics.html',
        'gopro hero 12': 'electronics.html',
        'airpods pro': 'electronics.html',
        'samsung galaxy watch': 'electronics.html',
        'sony wh-1000xm5': 'electronics.html',
        'anker powercore': 'electronics.html',
        'logitech mx master': 'electronics.html',
        
        // Accessories
        'anklets for wedding': 'accessories.html',
        'bridal bangles': 'accessories.html',
        'jhumkas': 'accessories.html',
        'diamond studded ring': 'accessories.html',
        'engagement ring': 'accessories.html',
        'gold jewellery': 'accessories.html',
        'bangles': 'accessories.html',
        'jewellery': 'accessories.html',
        'bracelet': 'accessories.html',
        'bridal kundan anklet': 'accessories.html',
        'designer leather handbag': 'accessories.html',
        'rfid leather wallet': 'accessories.html',
        'travel backpack': 'accessories.html',
        'apple watch series 9': 'accessories.html',
        'fossil gen 6 smartwatch': 'accessories.html',
        'titan analog watch': 'accessories.html',
        //groceries
        'fresh apples': 'groceries.html',
        'fresh bananas':'groceries.html',
        'fresh oranges':'groceries.html',
        'fresh mangoes': 'groceries.html',
                'fresh grapes' :'groceries.html',
                'fresh tomatoes':'groceries.html',
                'fresh carrots':'groceries.html',
                'fresh onions':'groceries.html',
                'fresh brinjal':'groceries.html',
                'fresh cucumber':'groceries.html',
                'fresh milk':'groceries.html',
                'cheese':'groceries.html',
                'yogurt':'groceries.html',
                'butter':'groceries.html',
                'cream':'groceries.html',
        //kids and toys
                'wooden alphabet blocks':'kids-toys.html',
                'math learning puzzle':'kids-toys.html',
                'junior science kit' :'kids-toys.html',
                'learning flash cards' :'kids-toys.html',
                'coding robot for kids':'kids-toys.html',
                'superhero action figure set':'kids-toys.html',
                'transformers robot' :'kids-toys.html',
                'dinosaur figure set':'kids-toys.html',
                'anime character figures':'kids-toys.html',
                'military action set':'kids-toys.html',
                'lego classic building set':'kids-toys.html',
                'mega bloks building set':'kids-toys.html',
                'technic building kit':'kids-toys.html',
                'architecture building set':'kids-toys.html',
                'wooden building blocks':'kids-toys.html',
                'kids tricycle':'kids-toys.html',
                'kids scooter': 'kids-toys.html',
                'garden swing set':'kids-toys.html',
                'sand and water table':'kids-toys.html',
                'kids basketball set':'kids-toys.html',
                //footwear
                'nike air max':'footwear.html',
                'adidas harden':'footwear.html',
                'puma ignite':'footwear.html',
                'asics gel':'footwear.html',
                'reebok crossfit':'footwear.html',
                'converse chuck':'footwear.html',
                'sperry loafers':'footwear.html',
                'timberland boat':'footwear.html',
                'tommy espadrilles':'footwear.html',
                'minnetonka moccasins':'footwear.html',
                'oxford shoes':'footwear.html',
                'derby shoes':'footwear.html',
                'monk strap':'footwear.html',
                'formal loafers':'footwear.html',
                'brogues':'footwear.html',
                'sports sandals':'footwear.html',
                'leather wedges':'footwear.html',
                'flip flops':'footwear.html',
                'house slippers':'footwear.html',
                //Luggage Faves
                'premium carry-on':'luggage faves.html',
                'hardside spinner':'luggage faves.html',
                'softside cabin':'luggage faves.html',
                'business carry-on':'luggage faves.html',
                'compact traveler':'luggage faves.html',
                'large spinner':'luggage faves.html',
                'medium suitcase':'luggage faves.html',
                'hardside set':'luggage faves.html',
                'softside large':'luggage faves.html',
                'premium checked':'luggage faves.html',
                'travel backpack':'luggage faves.html',
                'hiking backpack':'luggage faves.html',
                'business backpack':'luggage faves.html',
                'convertible backpack':'luggage faves.html',
                'weekender backpack':'luggage faves.html',
                'packing cubes':'luggage faves.html',
                'travel pillow':'luggage faves.html',
                'luggage scale':'luggage faves.html',
                'toiletry bag':'luggage faves.html',
                'luggage tags':'luggage faves.html',
                //books and media
                'you were not born to suffer':'books and media.html',
                'what are you doing with your life':'books and media.html',
                'fantasy novel':'books and media.html',
                'thriller novel':'books and media.html',
                'mind management not time management':'books and media.html',
                'biography':'books and media.html',
                'self-help':'books and media.html',
                'cookbook':'books and media.html',
                'travel guide':'books and media.html',
                'history book':'books and media.html',
                'fairy tales':'books and media.html',
                'picture books':'books and media.html',
                'educational books':'books and media.html',
                'story books':'books and media.html',
                'activity books':'books and media.html',
                //health and personal care
                'moisturizer':'Health and personal care.html',
                'sunscreen':'Health and personal care.html',
                'face wash':'Health and personal care.html',
                'serum':'Health and personal care.html',
                'face mask':'Health and personal care.html',
                'toothpaste':'Health and personal care.html',
                'toothbrush':'Health and personal care.html',
                'mouthwash':'Health and personal care.html',
                'dental floss':'Health and personal care.html',
                'electric toothbrush':'Health and personal care.html',
                'shampoo':'Health and personal care.html',
                'conditioner':'Health and personal care.html',
                'hair oil':'Health and personal care.html',
                'hair serum':'Health and personal care.html',
                'hair mask':'Health and personal care.html',
                //beauty
                'hydrating face cream':'beauty.html',
                'refreshing toner':'beauty.html',
                'vitamin c serum':'beauty.html',
                'night repair cream':'beauty.html',
                'sunscreen spf 55':'beauty.html',
                'liquid foundation':'beauty.html',
                'mascara':'beauty.html',
                'lipstick':'beauty.html',
                'blush':'beauty.html',
                'eyeliner':'beauty.html',
                'shampoo':'beauty.html',
                'conditioner':'beauty.html',
                'hair oil':'beauty.html',
                'hair mask':'beauty.html',
                'hair serum':'beauty.html',
                //home and decor
                'modern sofa':'Home and decor.html',
                'coffee table':'Home and decor.html',
                'floor lamp':'Home and decor.html',
                'area rug':'Home and decor.html',
                'bookshelf':'Home and decor.html',
                'king size bed':'Home and decor.html',
                'nightstand':'Home and decor.html',
                'dresser':'Home and decor.html',
                'bedside lamp':'Home and decor.html',
                'wardrobe':'Home and decor.html',
                'dining set':'Home and decor.html',
                'cookware set':'Home and decor.html',
                'kitchen island':'Home and decor.html',
                'bar stools':'Home and decor.html',
                'storage cabinet':'Home and decor.html',
                'vanity':'Home and decor.html',
                'shower caddy':'Home and decor.html',
                'towel rack':'Home and decor.html',
                'bath mat':'Home and decor.html',
                'shower head':'Home and decor.html',
                //sports
                'professional cricket bat':'sports-new.html',
                'cricket ball set':'sports-new.html',
                'cricket helmet':'sports-new.html',
                'cricket gloves':'sports-new.html',
                'cricket pads':'sports-new.html',
                'professional football':'sports-new.html',
                'football boots':'sports-new.html',
                'football jersey':'sports-new.html',
                'football shin guards':'sports-new.html',
                //clothing
                'classic white shirt':'clothing.html',
                'blue striped shirt':'clothing.html',
                'formal black shirt':'clothing.html',
                'checkered casual shirt':'clothing.html',
                'linen summer shirt':'clothing.html',
                'graphic print t-shirt':'clothing.html',
                'solid color t-shirt':'clothing.html',
                'polo t-shirt':'clothing.html',
                'v-neck t-shirt':'clothing.html',
                'round neck t-shirt':'clothing.html',
                'slim fit jeans':'clothing.html',
                'regular fit jeans':'clothing.html',
                'skinny jeans':'clothing.html',
                'distressed jeans':'clothing.html',
                'straight fit jeans':'clothing.html',
                'maxi dress':'clothing.html',
                'classic saree':'clothing.html',
                'kurthi set':'clothing.html',
                'premium shirts':'clothing.html',
                'trendy t-shirts':'clothing.html',
                'designer jeans':'clothing.html',
                'elegant dresses':'clothing.html',
                'white shirt':'clothing.html',
                'blue shirt':'clothing.html',
                'black shirt':'clothing.html',
                'checkered shirt':'clothing.html',
                'linen shirt':'clothing.html',
                'graphic t-shirt':'clothing.html',
                'solid t-shirt':'clothing.html',
                'polo shirt':'clothing.html',
                'v neck t shirt':'clothing.html',
                'round neck t shirt':'clothing.html',
                'jeans':'clothing.html',
                'dress':'clothing.html',
                'saree':'clothing.html',
                'kurthi':'clothing.html',
                't shirt':'clothing.html',
                'tshirt':'clothing.html',
                'shirt':'clothing.html',
        
        // Homepage featured
        'wireless headphones': 'homepage.html',
        'smart watch': 'homepage.html',
        'running shoes': 'homepage.html',
        'gaming laptop': 'homepage.html'
    }
};

// Universal search function
function performSearch(query) {
    if (!query || query.trim() === '') return;
    
    query = query.toLowerCase().trim();
    
    // Check for exact product matches
    for (const [product, page] of Object.entries(searchData.products)) {
        if (product === query || product.includes(query)) {
            window.location.href = `${page}?search=${encodeURIComponent(query)}`;
            return;
        }
    }
    
    // Check for category matches
    for (const [category, page] of Object.entries(searchData.categories)) {
        if (category === query || category.includes(query)) {
            window.location.href = `${page}?search=${encodeURIComponent(query)}`;
            return;
        }
    }
    
    // Check for partial matches in products
    for (const [product, page] of Object.entries(searchData.products)) {
        if (product.includes(query) || query.includes(product)) {
            window.location.href = `${page}?search=${encodeURIComponent(query)}`;
            return;
        }
    }
    
    // Fallback to products page
    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
}

// Search input handler
function setupSearchInput(inputId, buttonId = null) {
    const searchInput = document.getElementById(inputId);
    if (!searchInput) return;
    
    const searchHandler = () => {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    };
    
    // Handle button click
    if (buttonId) {
        const searchBtn = document.getElementById(buttonId);
        if (searchBtn) {
            searchBtn.addEventListener('click', searchHandler);
        }
    }
    
    // Handle Enter key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchHandler();
        }
    });
}

// Handle search parameters on page load
function handleSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    
    if (searchTerm) {
        const products = document.querySelectorAll('.product-card');
        let found = false;
        
        products.forEach(card => {
            const title = card.querySelector('.product-title')?.textContent.toLowerCase();
            if (title && title.includes(searchTerm.trim().toLowerCase())) {
                card.style.display = 'block';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // If no products found, show all products
        if (!found) {
            products.forEach(card => card.style.display = 'block');
        }
        
        // Set the search input value if it exists
        const searchInput = document.querySelector('.search-bar input, input[type="text"][placeholder*="search" i]');
        if (searchInput) {
            searchInput.value = searchTerm;
        }
    }
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', function() {
    // Setup search for homepage
    setupSearchInput('homeSearch', 'searchBtn');
    
    // Setup search for other pages
    setupSearchInput('searchInput');
    
    // Handle search parameters
    handleSearchParams();
});

// Export for global use
window.VSVSearch = {
    performSearch,
    setupSearchInput,
    handleSearchParams
};
