// Alerts JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize alerts functionality
    initializeAlerts();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Setup mobile navigation
    setupMobileNavigation();
    
    // Setup alert filters
    setupAlertFilters();
});

// Initialize alerts functionality
function initializeAlerts() {
    // Load alerts from localStorage or use default data
    loadAlerts();
    
    // Update badge count in sidebar
    updateAlertBadge();
}

// Load alerts data
function loadAlerts() {
    // In a real application, this would fetch from an API
    // For now, we'll use the static data from the HTML
    console.log('Alerts loaded successfully');
}

// Update alert badge count
function updateAlertBadge() {
    const badge = document.querySelector('.nav a.active .badge');
    if (badge) {
        // Count unread alerts (critical + warning)
        const criticalAlerts = document.querySelectorAll('.alert-item.critical').length;
        const warningAlerts = document.querySelectorAll('.alert-item.warning').length;
        const totalUnread = criticalAlerts + warningAlerts;
        
        badge.textContent = totalUnread;
        
        if (totalUnread === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
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

// Alert Filters
function setupAlertFilters() {
    const alertType = document.getElementById('alertType');
    const alertCategory = document.getElementById('alertCategory');
    const timeFilter = document.getElementById('timeFilter');
    
    // Update alerts when filters change
    [alertType, alertCategory, timeFilter].forEach(filter => {
        filter.addEventListener('change', filterAlerts);
    });
}

function filterAlerts() {
    const alertType = document.getElementById('alertType').value;
    const alertCategory = document.getElementById('alertCategory').value;
    const timeFilter = document.getElementById('timeFilter').value;
    
    console.log('Filtering alerts:', { alertType, alertCategory, timeFilter });
    
    // Show loading state
    showNotification('Applying filters...', 'info');
    
    // In a real application, this would filter the alerts from an API
    // For now, we'll just simulate the filtering
    setTimeout(() => {
        showNotification('Filters applied successfully', 'success');
    }, 500);
}

// Alert Actions
function resolveAlert(alertId) {
    console.log('Resolving alert:', alertId);
    
    // Find the alert element
    const alertElement = document.querySelector(`[onclick="resolveAlert('${alertId}')]`).closest('.alert-item');
    
    if (alertElement) {
        // Change to resolved state
        alertElement.classList.remove('critical', 'warning', 'info');
        alertElement.classList.add('success');
        alertElement.style.opacity = '0.7';
        
        // Update status badge
        const statusBadge = alertElement.querySelector('.status');
        if (statusBadge) {
            statusBadge.className = 'status resolved';
            statusBadge.textContent = 'Resolved';
        }
        
        // Update actions
        const actionsDiv = alertElement.querySelector('.alert-actions');
        if (actionsDiv) {
            actionsDiv.innerHTML = `
                <button class="btn" onclick="deleteAlert('${alertId}')">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            `;
        }
        
        showNotification('Alert resolved successfully', 'success');
        updateAlertBadge();
    }
}

function deleteAlert(alertId) {
    console.log('Deleting alert:', alertId);
    
    const alertElement = document.querySelector(`[onclick="deleteAlert('${alertId}')]`).closest('.alert-item');
    if (alertElement) {
        alertElement.style.opacity = '0';
        setTimeout(() => {
            alertElement.remove();
            showNotification('Alert deleted successfully', 'success');
            updateAlertBadge();
        }, 300);
    }
}

function markAllAsRead() {
    console.log('Marking all alerts as read');
    
    const alerts = document.querySelectorAll('.alert-item.critical, .alert-item.warning');
    alerts.forEach(alert => {
        const alertId = alert.querySelector('[onclick^="resolveAlert"]').getAttribute('onclick').split("'")[1];
        resolveAlert(alertId);
    });
    
    showNotification('All alerts marked as read', 'success');
}

function clearAllAlerts() {
    if (confirm('Are you sure you want to clear all alerts? This action cannot be undone.')) {
        console.log('Clearing all alerts');
        
        const alerts = document.querySelectorAll('.alert-item');
        alerts.forEach(alert => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        });
        
        showNotification('All alerts cleared', 'success');
        updateAlertBadge();
    }
}

function resolveAllCritical() {
    const criticalAlerts = document.querySelectorAll('.alert-item.critical');
    criticalAlerts.forEach(alert => {
        const alertId = alert.querySelector('[onclick^="resolveAlert"]').getAttribute('onclick').split("'")[1];
        resolveAlert(alertId);
    });
    
    showNotification('All critical alerts resolved', 'success');
}

function resolveAllWarnings() {
    const warningAlerts = document.querySelectorAll('.alert-item.warning');
    warningAlerts.forEach(alert => {
        const alertId = alert.querySelector('[onclick^="resolveAlert"]').getAttribute('onclick').split("'")[1];
        resolveAlert(alertId);
    });
    
    showNotification('All warning alerts resolved', 'success');
}

function refreshAlerts() {
    console.log('Refreshing alerts');
    
    // Show loading state
    const refreshBtn = document.querySelector('[onclick="refreshAlerts()"]');
    const originalText = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Refreshing...';
    refreshBtn.disabled = true;
    
    // Simulate API refresh
    setTimeout(() => {
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
        showNotification('Alerts refreshed successfully', 'success');
    }, 1500);
}

// Navigation functions (placeholder for actual implementation)
function viewProduct(productId) {
    console.log('Viewing product:', productId);
    showNotification(`Redirecting to product: ${productId}`, 'info');
}

function viewServerMetrics() {
    console.log('Viewing server metrics');
    showNotification('Redirecting to server metrics', 'info');
}

function viewPaymentMetrics() {
    console.log('Viewing payment metrics');
    showNotification('Redirecting to payment metrics', 'info');
}

function viewSecurityLogs() {
    console.log('Viewing security logs');
    showNotification('Redirecting to security logs', 'info');
}

function viewSalesReport() {
    console.log('Viewing sales report');
    showNotification('Redirecting to sales report', 'info');
}

function viewCustomerAnalytics() {
    console.log('Viewing customer analytics');
    showNotification('Redirecting to customer analytics', 'info');
}

function saveAlertSettings() {
    console.log('Saving alert settings');
    showNotification('Alert settings saved successfully', 'success');
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
