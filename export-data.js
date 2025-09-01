// Export Data Page Functionality
class ExportManager {
    constructor() {
        this.exportData = {
            sales: this.getSalesData(),
            customers: this.getCustomerData(),
            inventory: this.getInventoryData(),
            performance: this.getPerformanceData()
        };
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.setupThemeToggle();
            this.setupSidebarToggle();
            this.setupDateDefaults();
        });
    }

    setupEventListeners() {
        // Format change listener
        document.getElementById('exportFormat').addEventListener('change', () => {
            this.refreshPreview();
        });

        // Data type change listener
        document.getElementById('dataType').addEventListener('change', () => {
            this.refreshPreview();
        });

        // Date range listeners
        document.getElementById('fromDate').addEventListener('change', () => {
            this.refreshPreview();
        });

        document.getElementById('toDate').addEventListener('change', () => {
            this.refreshPreview();
        });

        // Category checkbox listeners
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.refreshPreview();
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.search input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.filterPreview(e.target.value.trim().toLowerCase());
            }, 300));
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const root = document.documentElement;
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'light') {
            root.classList.add('light');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }

        themeToggle?.addEventListener('click', () => {
            root.classList.toggle('light');
            const isLight = root.classList.contains('light');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        });
    }

    setupSidebarToggle() {
        const navToggle = document.getElementById('navToggle');
        const sidebar = document.getElementById('sidebar');
        
        // Show toggle button on mobile
        if (window.innerWidth <= 768) {
            navToggle.style.display = 'block';
        }

        navToggle?.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                navToggle.style.display = 'block';
            } else {
                navToggle.style.display = 'none';
                sidebar.classList.remove('open');
                document.body.classList.remove('nav-open');
            }
        });
    }

    setupDateDefaults() {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        document.getElementById('fromDate').value = oneMonthAgo.toISOString().split('T')[0];
        document.getElementById('toDate').value = today.toISOString().split('T')[0];
    }

    refreshPreview() {
        const format = document.getElementById('exportFormat').value;
        const dataType = document.getElementById('dataType').value;
        const selectedCategories = this.getSelectedCategories();
        
        const previewContent = document.getElementById('previewContent');
        
        if (dataType === 'all') {
            this.showAllDataPreview(previewContent, format, selectedCategories);
        } else {
            this.showSingleDataPreview(previewContent, dataType, format, selectedCategories);
        }
    }

    showAllDataPreview(container, format, categories) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fa-solid fa-database" style="font-size: 48px; color: var(--muted); margin-bottom: 16px;"></i>
                <h3 style="margin: 0 0 8px 0; color: var(--text);">Complete Report Export</h3>
                <p style="color: var(--muted); margin: 0;">
                    Exporting all data types: Sales, Customers, Inventory, and Performance Metrics
                </p>
                <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                    <div style="background: rgba(108,140,255,.1); padding: 12px; border-radius: 8px;">
                        <div style="font-weight: 600; color: var(--brand);">Sales Data</div>
                        <div style="font-size: 14px; color: var(--muted);">${this.exportData.sales.length} records</div>
                    </div>
                    <div style="background: rgba(21,195,154,.1); padding: 12px; border-radius: 8px;">
                        <div style="font-weight: 600; color: var(--brand-2);">Customer Data</div>
                        <div style="font-size: 14px; color: var(--muted);">${this.exportData.customers.length} records</div>
                    </div>
                    <div style="background: rgba(245,159,0,.1); padding: 12px; border-radius: 8px;">
                        <div style="font-weight: 600; color: var(--accent);">Inventory Data</div>
                        <div style="font-size: 14px; color: var(--muted);">${this.exportData.inventory.length} records</div>
                    </div>
                    <div style="background: rgba(16,185,129,.1); padding: 12px; border-radius: 8px;">
                        <div style="font-weight: 600; color: var(--success);">Performance Data</div>
                        <div style="font-size: 14px; color: var(--muted);">${this.exportData.performance.length} metrics</div>
                    </div>
                </div>
                <p style="margin-top: 20px; color: var(--muted); font-size: 14px;">
                    Format: ${format.toUpperCase()} | Categories: ${categories.join(', ')}
                </p>
            </div>
        `;
    }

    showSingleDataPreview(container, dataType, format, categories) {
        const data = this.exportData[dataType];
        const headers = Object.keys(data[0] || {});
        
        if (data.length === 0) {
            container.innerHTML = `
                <p style="text-align: center; color: var(--muted); padding: 40px 0;">
                    <i class="fa-solid fa-database"></i><br>
                    No data available for ${dataType}
                </p>
            `;
            return;
        }

        let previewHTML = `
            <div style="margin-bottom: 16px; color: var(--muted); font-size: 14px;">
                Showing ${Math.min(data.length, 10)} of ${data.length} records | Format: ${format.toUpperCase()}
            </div>
            <table class="preview-table">
                <thead>
                    <tr>
                        ${headers.map(header => `<th>${this.formatHeader(header)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        // Show first 10 records for preview
        data.slice(0, 10).forEach(item => {
            previewHTML += '<tr>';
            headers.forEach(header => {
                previewHTML += `<td>${this.formatValue(item[header], header)}</td>`;
            });
            previewHTML += '</tr>';
        });

        previewHTML += `
                </tbody>
            </table>
        `;

        container.innerHTML = previewHTML;
    }

    formatHeader(header) {
        return header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    formatValue(value, header) {
        if (typeof value === 'number') {
            if (header.toLowerCase().includes('revenue') || header.toLowerCase().includes('value')) {
                return `₹${value.toLocaleString()}`;
            }
            if (header.toLowerCase().includes('percent') || header.toLowerCase().includes('rate')) {
                return `${value}%`;
            }
            return value.toLocaleString();
        }
        return value;
    }

    getSelectedCategories() {
        const categories = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            categories.push(checkbox.value);
        });
        return categories.length > 0 ? categories : ['all'];
    }

    filterPreview(searchTerm) {
        const previewContent = document.getElementById('previewContent');
        const tables = previewContent.querySelectorAll('table');
        
        if (searchTerm.length === 0) {
            tables.forEach(table => {
                table.style.display = '';
                table.querySelectorAll('tr').forEach(row => {
                    row.style.display = '';
                });
            });
            return;
        }

        let anyVisible = false;
        tables.forEach(table => {
            let tableHasVisible = false;
            table.querySelectorAll('tbody tr').forEach(row => {
                const rowText = row.textContent.toLowerCase();
                if (rowText.includes(searchTerm)) {
                    row.style.display = '';
                    tableHasVisible = true;
                    anyVisible = true;
                } else {
                    row.style.display = 'none';
                }
            });
            table.style.display = tableHasVisible ? '' : 'none';
        });

        if (!anyVisible && tables.length > 0) {
            previewContent.innerHTML += `
                <div style="text-align: center; color: var(--muted); padding: 20px;">
                    No matching results found for "${searchTerm}"
                </div>
            `;
        }
    }

    exportData() {
        const format = document.getElementById('exportFormat').value;
        const dataType = document.getElementById('dataType').value;
        const selectedCategories = this.getSelectedCategories();
        
        const exportButton = document.getElementById('exportButton');
        const originalText = exportButton.innerHTML;
        
        // Show loading state
        exportButton.innerHTML = `
            <span class="loading">
                <span class="loading-spinner"></span>
                Exporting...
            </span>
        `;
        exportButton.disabled = true;

        setTimeout(() => {
            let data, filename;
            
            if (dataType === 'all') {
                data = this.prepareAllData(selectedCategories);
                filename = `vsv-complete-report-${new Date().toISOString().split('T')[0]}`;
            } else {
                data = this.prepareSingleData(dataType, selectedCategories);
                filename = `vsv-${dataType}-report-${new Date().toISOString().split('T')[0]}`;
            }

            switch (format) {
                case 'csv':
                    this.exportAsCSV(data, filename);
                    break;
                case 'excel':
                    this.exportAsExcel(data, filename);
                    break;
                case 'pdf':
                    this.exportAsPDF(data, filename);
                    break;
                case 'json':
                    this.exportAsJSON(data, filename);
                    break;
            }

            // Restore button state
            exportButton.innerHTML = originalText;
            exportButton.disabled = false;

            this.showNotification('Export completed successfully!', 'success');
        }, 1500);
    }

    prepareAllData(categories) {
        return {
            sales: this.filterByCategories(this.exportData.sales, categories),
            customers: this.exportData.customers,
            inventory: this.filterByCategories(this.exportData.inventory, categories),
            performance: this.exportData.performance,
            metadata: {
                exportedAt: new Date().toISOString(),
                categories: categories,
                totalRecords: this.exportData.sales.length + this.exportData.customers.length + 
                             this.exportData.inventory.length + this.exportData.performance.length
            }
        };
    }

    prepareSingleData(dataType, categories) {
        let data = this.exportData[dataType];
        if (dataType === 'sales' || dataType === 'inventory') {
            data = this.filterByCategories(data, categories);
        }
        return {
            data: data,
            metadata: {
                type: dataType,
                exportedAt: new Date().toISOString(),
                categories: categories,
                totalRecords: data.length
            }
        };
    }

    filterByCategories(data, categories) {
        if (categories.includes('all')) return data;
        return data.filter(item => 
            categories.includes(item.category?.toLowerCase() || item.Category?.toLowerCase() || '')
        );
    }

    exportAsCSV(data, filename) {
        let csvContent = '';
        
        if (filename.includes('complete')) {
            // Export all data types
            Object.keys(data).forEach(key => {
                if (key !== 'metadata' && Array.isArray(data[key])) {
                    csvContent += `${key.toUpperCase()} DATA\n`;
                    if (data[key].length > 0) {
                        const headers = Object.keys(data[key][0]);
                        csvContent += headers.join(',') + '\n';
                        data[key].forEach(row => {
                            csvContent += headers.map(header => `"${row[header]}"`).join(',') + '\n';
                        });
                    }
                    csvContent += '\n\n';
                }
            });
        } else {
            // Export single data type
            const headers = Object.keys(data.data[0]);
            csvContent = headers.join(',') + '\n';
            data.data.forEach(row => {
                csvContent += headers.map(header => `"${row[header]}"`).join(',') + '\n';
            });
        }

        this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
    }

    exportAsExcel(data, filename) {
        try {
            const wb = XLSX.utils.book_new();
            
            if (filename.includes('complete')) {
                Object.keys(data).forEach(key => {
                    if (key !== 'metadata' && Array.isArray(data[key])) {
                        const ws = XLSX.utils.json_to_sheet(data[key]);
                        XLSX.utils.book_append_sheet(wb, ws, key.charAt(0).toUpperCase() + key.slice(1));
                    }
                });
            } else {
                const ws = XLSX.utils.json_to_sheet(data.data);
                XLSX.utils.book_append_sheet(wb, ws, data.metadata.type.charAt(0).toUpperCase() + data.metadata.type.slice(1));
            }

            XLSX.writeFile(wb, `${filename}.xlsx`);
        } catch (error) {
            console.error('Excel export error:', error);
            this.showNotification('Excel export failed. Please try again.', 'danger');
        }
    }

    exportAsPDF(data, filename) {
        // Simple PDF export - in a real implementation, you might use jsPDF or similar library
        const pdfContent = `
            VSV Easy Shop - Data Export
            Generated: ${new Date().toLocaleString()}
            
            ${JSON.stringify(data, null, 2)}
        `;
        this.downloadFile(pdfContent, `${filename}.pdf`, 'application/pdf');
    }

    exportAsJSON(data, filename) {
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 
                       type === 'danger' ? 'var(--danger)' : 'var(--brand)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: var(--shadow);
        `;
        notification.innerHTML = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    resetForm() {
        document.getElementById('exportFormat').value = 'csv';
        document.getElementById('dataType').value = 'sales';
        document.getElementById('fromDate').value = '';
        document.getElementById('toDate').value = '';
        
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        
        this.refreshPreview();
        this.showNotification('Form reset to default values', 'info');
    }

    // Sample data generation methods
    getSalesData() {
        return [
            { Category: 'Fashion', Revenue: 1340000, Orders: 1245, AvgOrderValue: 1076, Growth: 18.2, Status: 'Growing' },
            { Category: 'Electronics', Revenue: 1130000, Orders: 892, AvgOrderValue: 1267, Growth: 12.4, Status: 'Steady' },
            { Category: 'Home & Decor', Revenue: 756000, Orders: 678, AvgOrderValue: 1115, Growth: 8.7, Status: 'Stable' },
            { Category: 'Sports', Revenue: 588000, Orders: 523, AvgOrderValue: 1124, Growth: 5.3, Status: 'Slow' },
            { Category: 'Kids', Revenue: 312000, Orders: 445, AvgOrderValue: 701, Growth: 12.8, Status: 'Steady' }
        ];
    }

    getCustomerData() {
        return [
            { Month: 'January', NewCustomers: 45, ReturningCustomers: 120, TotalRevenue: 220000 },
            { Month: 'February', NewCustomers: 52, ReturningCustomers: 135, TotalRevenue: 240000 },
            { Month: 'March', NewCustomers: 48, ReturningCustomers: 128, TotalRevenue: 235000 },
            { Month: 'April', NewCustomers: 65, ReturningCustomers: 145, TotalRevenue: 290000 },
            { Month: 'May', NewCustomers: 78, ReturningCustomers: 158, TotalRevenue: 310000 }
        ];
    }

    getInventoryData() {
        return [
            { Product: 'Wireless Earbuds Pro', Category: 'Electronics', CurrentStock: 156, SoldThisMonth: 89, ReorderLevel: 50, StockValue: 46800, Status: 'In Stock' },
            { Product: 'Running Shoes Ultra', Category: 'Sports', CurrentStock: 23, SoldThisMonth: 67, ReorderLevel: 30, StockValue: 6900, Status: 'Low Stock' },
            { Product: 'Smart Watch Series 5', Category: 'Electronics', CurrentStock: 78, SoldThisMonth: 45, ReorderLevel: 25, StockValue: 31200, Status: 'In Stock' },
            { Product: 'Kids Backpack Dino', Category: 'Kids', CurrentStock: 8, SoldThisMonth: 32, ReorderLevel: 15, StockValue: 1200, Status: 'Critical' },
            { Product: 'Designer Handbag', Category: 'Fashion', CurrentStock: 45, SoldThisMonth: 28, ReorderLevel: 20, StockValue: 22500, Status: 'In Stock' }
        ];
    }

    getPerformanceData() {
        return [
            { Metric: 'Conversion Rate', Value: 3.7, Trend: 'up', Change: 0.8 },
            { Metric: 'Average Order Value', Value: 2847, Trend: 'up', Change: 12.3 },
            { Metric: 'Cart Abandonment', Value: 68.2, Trend: 'down', Change: -5.1 },
            { Metric: 'Return Rate', Value: 2.4, Trend: 'down', Change: -0.7 },
            { Metric: 'Customer Satisfaction', Value: 4.8, Trend: 'up', Change: 0.3 }
        ];
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global functions for HTML onclick attributes
function exportData() {
    window.exportManager.exportData();
}

function resetForm() {
    window.exportManager.resetForm();
}

function refreshPreview() {
    window.exportManager.refreshPreview();
}

// Initialize the export manager
window.exportManager = new ExportManager();
