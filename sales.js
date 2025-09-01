// Sales Reports JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Setup mobile navigation
    setupMobileNavigation();
    
    // Setup report generation
    setupReportGeneration();
});

// Initialize all charts
function initializeCharts() {
    createDailySalesChart();
    createSalesByCategoryChart();
    createSalesForecastChart();
    createSeasonalTrendsChart();
}

// Daily Sales Chart
function createDailySalesChart() {
    const ctx = document.getElementById('dailySalesChart').getContext('2d');
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Daily Sales (₹)',
            data: [45000, 52000, 48000, 61000, 75000, 89000, 68000],
            borderColor: '#6c8cff',
            backgroundColor: 'rgba(108, 140, 255, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Sales by Category Chart
function createSalesByCategoryChart() {
    const ctx = document.getElementById('salesByCategoryChart').getContext('2d');
    const data = {
        labels: ['Fashion', 'Electronics', 'Home & Decor', 'Sports', 'Kids'],
        datasets: [{
            data: [1340000, 1130000, 756000, 588000, 312000],
            backgroundColor: [
                '#6c8cff',
                '#15c39a',
                '#f59f00',
                '#ff6b6b',
                '#fbbf24'
            ],
            borderWidth: 0
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text')
                    }
                }
            }
        }
    });
}

// Sales Forecast Chart
function createSalesForecastChart() {
    const ctx = document.getElementById('salesForecastChart').getContext('2d');
    const data = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Actual Sales',
                data: [420000, 480000, 520000, 580000],
                borderColor: '#6c8cff',
                backgroundColor: 'rgba(108, 140, 255, 0.1)',
                borderWidth: 2,
                fill: true
            },
            {
                label: 'Forecast',
                data: [null, null, null, 620000, 680000, 750000, 820000],
                borderColor: '#15c39a',
                backgroundColor: 'rgba(21, 195, 154, 0.1)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: true
            }
        ]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text')
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Seasonal Trends Chart
function createSeasonalTrendsChart() {
    const ctx = document.getElementById('seasonalTrendsChart').getContext('2d');
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Monthly Sales (₹)',
            data: [1200000, 1100000, 1300000, 1400000, 1600000, 1800000, 1700000, 1900000, 2100000, 2300000, 2800000, 3200000],
            borderColor: '#f59f00',
            backgroundColor: 'rgba(245, 159, 0, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Theme Toggle Functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (localStorage.getItem('theme') === 'light' || (!localStorage.getItem('theme') && !prefersDark)) {
        document.documentElement.classList.add('light');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('light')) {
            document.documentElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });
}

// Mobile Navigation
function setupMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth <= 768) {
        navToggle.style.display = 'flex';
        
        navToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== navToggle) {
                sidebar.classList.remove('open');
                document.body.classList.remove('nav-open');
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navToggle.style.display = 'none';
            sidebar.classList.remove('open');
            document.body.classList.remove('nav-open');
        } else {
            navToggle.style.display = 'flex';
        }
    });
}

// Report Generation
function setupReportGeneration() {
    const dateRange = document.getElementById('dateRange');
    const categoryFilter = document.getElementById('categoryFilter');
    const reportType = document.getElementById('reportType');
    
    // Update report data when filters change
    [dateRange, categoryFilter, reportType].forEach(filter => {
        filter.addEventListener('change', updateReportData);
    });
}

function updateReportData() {
    const dateRange = document.getElementById('dateRange').value;
    const category = document.getElementById('categoryFilter').value;
    const reportType = document.getElementById('reportType').value;
    
    console.log('Updating report with:', { dateRange, category, reportType });
    // Here you would typically make an API call to get filtered data
    // For now, we'll just reload the charts
    initializeCharts();
}

// Generate Sales Report
function generateSalesReport() {
    const dateRange = document.getElementById('dateRange').value;
    const category = document.getElementById('categoryFilter').value;
    const reportType = document.getElementById('reportType').value;
    
    console.log('Generating sales report:', { dateRange, category, reportType });
    
    // Show loading state
    const generateBtn = document.querySelector('.btn.primary');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
    generateBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
        
        // Show success message
        showNotification('Sales report generated successfully!', 'success');
        
        // Update charts with new data
        initializeCharts();
    }, 2000);
}

// Export Sales Report
function exportSalesReport(format) {
    console.log(`Exporting sales report as ${format}`);
    
    // Show loading state
    const exportBtn = document.querySelector('.btn.secondary');
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Exporting...';
    exportBtn.disabled = true;
    
    // Simulate export process
    setTimeout(() => {
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
        
        // Show success message
        showNotification(`Sales report exported as ${format.toUpperCase()} successfully!`, 'success');
    }, 1500);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fa-solid fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: var(--shadow);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification.success {
        border-left: 4px solid var(--success);
    }
    
    .notification.error {
        border-left: 4px solid var(--danger);
    }
    
    .notification.warning {
        border-left: 4px solid var(--warning);
    }
    
    .notification.info {
        border-left: 4px solid var(--brand);
    }
`;
document.head.appendChild(notificationStyles);
