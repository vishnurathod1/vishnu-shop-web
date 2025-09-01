// Reports Settings JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize reports settings functionality
    initializeReportsSettings();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Setup mobile navigation
    setupMobileNavigation();
    
    // Load saved reports settings
    loadReportsSettings();
    
    // Setup color picker previews
    setupColorPickers();
});

// Initialize reports settings functionality
function initializeReportsSettings() {
    console.log('Reports settings page initialized');
    
    // Setup form event listeners
    setupFormListeners();
    
    // Setup validation
    setupValidation();
}

// Setup form event listeners
function setupFormListeners() {
    // Add change listeners to all form elements
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        element.addEventListener('change', function() {
            markSettingAsChanged(this.id);
            updateColorPreviews(this.id, this.value);
        });
    });
}

// Setup validation
function setupValidation() {
    // Add validation for numeric inputs
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateNumericInput(this);
        });
    });
    
    // Email validation for recipients
    const emailTextarea = document.getElementById('emailRecipients');
    if (emailTextarea) {
        emailTextarea.addEventListener('blur', function() {
            validateEmailRecipients(this);
        });
    }
}

// Validate numeric input
function validateNumericInput(input) {
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || Infinity;
    const value = parseInt(input.value);
    
    if (isNaN(value) || value < min || value > max) {
        input.style.borderColor = 'var(--danger)';
        showNotification(`Please enter a value between ${min} and ${max}`, 'error');
        return false;
    }
    
    input.style.borderColor = '';
    return true;
}

// Validate email recipients
function validateEmailRecipients(textarea) {
    const emails = textarea.value.split(',').map(email => email.trim()).filter(email => email);
    
    const invalidEmails = emails.filter(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(email);
    });
    
    if (invalidEmails.length > 0) {
        textarea.style.borderColor = 'var(--danger)';
        showNotification(`Invalid email addresses: ${invalidEmails.join(', ')}`, 'error');
        return false;
    }
    
    textarea.style.borderColor = '';
    return true;
}

// Setup color pickers
function setupColorPickers() {
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        input.addEventListener('input', function() {
            updateColorPreviews(this.id, this.value);
        });
    });
}

// Update color previews
function updateColorPreviews(inputId, colorValue) {
    if (inputId.includes('Color')) {
        const preview = document.querySelector(`#${inputId} + .color-preview`);
        const span = document.querySelector(`#${inputId} + .color-preview + span`);
        if (preview) {
            preview.style.backgroundColor = colorValue;
        }
        if (span) {
            span.textContent = colorValue;
        }
    }
}

// Mark setting as changed
function markSettingAsChanged(settingId) {
    const element = document.getElementById(settingId);
    if (element) {
        element.style.borderColor = 'var(--brand)';
        element.style.boxShadow = '0 0 0 2px rgba(108, 140, 255, 0.2)';
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

// Load saved reports settings
function loadReportsSettings() {
    // Load settings from localStorage
    const settings = JSON.parse(localStorage.getItem('vsvReportsSettings')) || {};
    
    // Apply saved settings to form elements
    Object.keys(settings).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = settings[key];
            } else if (element.type === 'color') {
                element.value = settings[key];
                updateColorPreviews(key, settings[key]);
            } else {
                element.value = settings[key];
            }
        }
    });
    
    console.log('Reports settings loaded from storage');
}

// Save all reports settings
function saveAllSettings() {
    const settings = {};
    const formElements = document.querySelectorAll('input, select, textarea');
    
    // Collect all settings
    formElements.forEach(element => {
        if (element.type === 'checkbox') {
            settings[element.id] = element.checked;
        } else {
            settings[element.id] = element.value;
        }
        
        // Reset visual changes
        element.style.borderColor = '';
        element.style.boxShadow = '';
    });
    
    // Save to localStorage
    localStorage.setItem('vsvReportsSettings', JSON.stringify(settings));
    
    showNotification('All reports settings saved successfully!', 'success');
    console.log('Reports settings saved:', settings);
    
    // Also update main settings if needed
    updateMainSettings(settings);
}

// Update main settings with reports configuration
function updateMainSettings(reportsSettings) {
    const mainSettings = JSON.parse(localStorage.getItem('vsvSettings')) || {};
    
    // Sync relevant settings
    mainSettings.refreshInterval = reportsSettings.refreshInterval;
    mainSettings.dataRetention = reportsSettings.dataRetention;
    mainSettings.cacheData = reportsSettings.cacheData;
    mainSettings.exportFormat = reportsSettings.exportFormat;
    mainSettings.exportCharts = reportsSettings.exportCharts;
    mainSettings.exportTables = reportsSettings.exportTables;
    mainSettings.exportMetadata = reportsSettings.exportMetadata;
    
    localStorage.setItem('vsvSettings', JSON.stringify(mainSettings));
}

// Reset to defaults
function resetToDefaults() {
    if (confirm('Are you sure you want to reset all reports settings to default values? This action cannot be undone.')) {
        // Clear saved settings
        localStorage.removeItem('vsvReportsSettings');
        
        // Reload the page to reset form elements
        location.reload();
    }
}

// Test scheduling
function testScheduling() {
    showNotification('Test schedule executed successfully! A sample report has been generated.', 'success');
    console.log('Test scheduling triggered');
    
    // Simulate schedule test
    setTimeout(() => {
        showNotification('Sample report ready for download', 'info');
    }, 2000);
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

// Auto-save functionality
let autoSaveTimeout;
function scheduleAutoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        saveAllSettings();
    }, 2000);
}

// Add auto-save listeners
document.addEventListener('change', scheduleAutoSave);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    clearTimeout(autoSaveTimeout);
});

// Export settings for use in reports
function getReportsSettings() {
    return JSON.parse(localStorage.getItem('vsvReportsSettings')) || {};
}

// Check if specific report type is enabled
function isReportTypeEnabled(reportType) {
    const settings = getReportsSettings();
    switch (reportType) {
        case 'sales':
            return settings.enableSalesReports !== false;
        case 'customers':
            return settings.enableCustomerReports !== false;
        case 'inventory':
            return settings.enableInventoryReports !== false;
        case 'performance':
            return settings.enablePerformanceReports !== false;
        default:
            return true;
    }
}

// Get chart preferences
function getChartPreferences() {
    const settings = getReportsSettings();
    return {
        type: settings.defaultChartType || 'bar',
        showLabels: settings.showDataLabels !== false,
        showGrid: settings.showGridLines !== false,
        dataPoints: parseInt(settings.dataPointsCount) || 30,
        colors: {
            primary: settings.primaryColor || '#6c8cff',
            secondary: settings.secondaryColor || '#15c39a',
            accent: settings.accentColor || '#f59f00'
        }
    };
}
