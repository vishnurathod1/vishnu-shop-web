// Performance Optimization Script
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupServiceWorker();
        this.optimizeImages();
        this.setupPreloading();
    }

    // Lazy Loading for Images
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Service Worker Registration
    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    // Image Optimization
    optimizeImages() {
        // Convert images to WebP format with fallback
        document.querySelectorAll('img').forEach(img => {
            if (img.src.includes('.jpg') || img.src.includes('.png')) {
                const webpSrc = img.src.replace(/\.(jpg|png)$/, '.webp');
                const picture = document.createElement('picture');
                
                const webpSource = document.createElement('source');
                webpSource.srcset = webpSrc;
                webpSource.type = 'image/webp';
                
                const fallbackSource = document.createElement('source');
                fallbackSource.srcset = img.src;
                fallbackSource.type = img.src.includes('.jpg') ? 'image/jpeg' : 'image/png';
                
                img.parentNode.insertBefore(picture, img);
                picture.appendChild(webpSource);
                picture.appendChild(fallbackSource);
                picture.appendChild(img);
            }
        });
    }

    // Resource Preloading
    setupPreloading() {
        const criticalResources = [
            '/style.css',
            '/slideshow.css',
            '/vsv-styles.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }
}

// Initialize Performance Optimizer
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});
