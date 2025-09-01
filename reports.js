// Reports page: activate all interactive features efficiently

class ReportsManager {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupSearch();
            this.setupThemeToggle();
            this.setupSidebarToggle();
            this.initializeCharts();
            this.setupReportGeneration();
            this.setupAutoRefresh();
        });
    }

    setupSearch() {
        const searchInput = document.querySelector('.search input');
        if (!searchInput) return;

        let noResultsMsg = document.getElementById('noResultsMsg');
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMsg';
            noResultsMsg.textContent = 'No matching results found.';
            noResultsMsg.style.cssText = 'color: #ff6b6b; font-weight: bold; margin: 16px 0; display: none; text-align:center;';
            document.querySelector('.content').parentNode.insertBefore(noResultsMsg, document.querySelector('.content').nextSibling);
        }

        searchInput.addEventListener('input', this.debounce((e) => {
            const filter = e.target.value.trim().toLowerCase();
            let anyVisible = false;
            
            document.querySelectorAll('table').forEach(table => {
                let tableHasVisible = false;
                table.querySelectorAll('tbody tr').forEach(row => {
                    // Remove previous highlights
                    row.querySelectorAll('td').forEach(td => {
                        td.innerHTML = td.textContent;
                    });
                    
                    const rowText = row.textContent.toLowerCase();
                    if (filter.length === 0 || rowText.includes(filter)) {
                        row.style.display = '';
                        tableHasVisible = true;
                        anyVisible = true;
                        
                        // Highlight matches
                        if (filter.length > 0) {
                            row.querySelectorAll('td').forEach(td => {
                                const text = td.textContent;
                                const idx = text.toLowerCase().indexOf(filter);
                                if (idx !== -1) {
                                    td.innerHTML = text.substring(0, idx) + 
                                        '<span style="background: #ffe066; color: #222;">' + 
                                        text.substring(idx, idx + filter.length) + 
                                        '</span>' + 
                                        text.substring(idx + filter.length);
                                }
                            });
                        }
                    } else {
                        row.style.display = 'none';
                    }
                });
                
                table.style.display = tableHasVisible || filter.length === 0 ? '' : 'none';
            });
            
            noResultsMsg.style.display = anyVisible || filter.length === 0 ? 'none' : 'block';
        }, 300));
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
            
            // Update charts with new theme colors
            this.updateChartColors();
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

    initializeCharts() {
        const styles = getComputedStyle(document.documentElement);
        const colors = {
            brand: styles.getPropertyValue('--brand').trim(),
            brand2: styles.getPropertyValue('--brand-2').trim(),
            accent: styles.getPropertyValue('--accent').trim(),
            danger: styles.getPropertyValue('--danger').trim(),
            success: styles.getPropertyValue('--success').trim()
        };

        // Sales Trend Chart
        const salesTrendCtx = document.getElementById('salesTrendChart');
        if (salesTrendCtx) {
            this.charts.salesTrend = new Chart(salesTrendCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'Revenue (₹K)',
                        data: [220, 240, 235, 290, 310, 325, 318, 360, 342, 390, 410, 455],
                        borderColor: colors.brand,
                        backgroundColor: colors.brand + '22',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2
                    }, {
                        label: 'Orders',
                        data: [85, 92, 88, 110, 118, 125, 120, 145, 138, 155, 162, 178],
                        borderColor: colors.brand2,
                        backgroundColor: colors.brand2 + '22',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.08)' } },
                        y1: { position: 'right', grid: { display: false } },
                        x: { grid: { display: false } }
                    },
                    plugins: { 
                        legend: { 
                            labels: { color: styles.getPropertyValue('--text').trim() } 
                        } 
                    }
                }
            });
        }

        // Revenue Breakdown Chart
        const revenueBreakdownCtx = document.getElementById('revenueBreakdownChart');
        if (revenueBreakdownCtx) {
            this.charts.revenueBreakdown = new Chart(revenueBreakdownCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Fashion', 'Electronics', 'Home & Decor', 'Sports', 'Kids', 'Beauty'],
                    datasets: [{
                        data: [32, 27, 18, 14, 9, 8],
                        backgroundColor: [colors.brand, colors.brand2, colors.accent, colors.danger, colors.success, '#8b5cf6']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: styles.getPropertyValue('--text').trim() }
                        }
                    }
                }
            });
        }

        // Customer Acquisition Chart
        const customerAcquisitionCtx = document.getElementById('customerAcquisitionChart');
        if (customerAcquisitionCtx) {
            this.charts.customerAcquisition = new Chart(customerAcquisitionCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [{
                        label: 'New Customers',
                        data: [45, 52, 48, 65, 78, 82, 75, 89, 92, 98, 105, 118],
                        backgroundColor: colors.brand,
                        borderRadius: 4
                    }, {
                        label: 'Returning Customers',
                        data: [120, 135, 128, 145, 158, 162, 155, 169, 172, 178, 185, 198],
                        backgroundColor: colors.brand2,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.08)' } },
                        x: { grid: { display: false } }
                    },
                    plugins: {
                        legend: {
                            labels: { color: styles.getPropertyValue('--text').trim() }
                        }
                    }
                }
            });
        }

        // Customer Lifetime Value Chart
        const clvCtx = document.getElementById('clvChart');
        if (clvCtx) {
            this.charts.clv = new Chart(clvCtx, {
                type: 'line',
                data: {
                    labels: ['0-30 days', '31-60 days', '61-90 days', '91-180 days', '181-365 days', '365+ days'],
                    datasets: [{
                        label: 'Average CLV (₹)',
                        data: [1250, 2850, 4200, 6800, 12500, 18900],
                        borderColor: colors.success,
                        backgroundColor: colors.success + '22',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,.08)' } },
                        x: { grid: { display: false } }
                    },
                    plugins: {
                        legend: {
                            labels: { color: styles.getPropertyValue('--text').trim() }
                        }
                    }
                }
            });
        }
    }

    updateChartColors() {
        const styles = getComputedStyle(document.documentElement);
        const colors = {
            brand: styles.getPropertyValue('--brand').trim(),
            brand2: styles.getPropertyValue('--brand-2').trim(),
            accent: styles.getPropertyValue('--accent').trim(),
            danger: styles.getPropertyValue('--danger').trim(),
            success: styles.getPropertyValue('--success').trim()
        };

        // Update all charts with new colors
        Object.values(this.charts).forEach(chart => {
            chart.destroy();
        });
        this.initializeCharts();
    }

    setupReportGeneration() {
        const generateBtn = document.querySelector('.btn.primary[onclick]');
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.style.opacity = '1';
            generateBtn.addEventListener('click', () => {
                this.generateReport();
            });
        }

        // Setup export buttons
        const exportPdfBtn = document.querySelector('.btn.secondary[onclick*="pdf"]');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => {
                this.exportReport('pdf');
            });
        }
    }

    generateReport() {
        const dateRange = document.getElementById('dateRange').value;
        const category = document.getElementById('categoryFilter').value;
        const reportType = document.getElementById('reportType').value;
        
        console.log(`Generating ${reportType} report for ${dateRange} in ${category}`);
        
        // Show loading state
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            this.updateCharts(dateRange, category, reportType);
            this.hideLoading();
        }, 1000);
    }

    updateCharts(dateRange, category, reportType) {
        // This would typically fetch new data from API
        console.log('Updating charts with:', { dateRange, category, reportType });
        
        // For demo, just show a success message
        this.showNotification('Report generated successfully!', 'success');
    }

    exportReport(format) {
        const dateRange = document.getElementById('dateRange').value;
        const reportType = document.getElementById('reportType').value;
        const category = document.getElementById('categoryFilter').value;
        
        console.log(`Exporting ${reportType} report as ${format} for ${dateRange} in ${category}`);
        
        // Show loading state
        this.showLoading();
        
        setTimeout(() => {
            let data, filename;
            
            // Generate appropriate data based on report type
            switch (reportType.toLowerCase()) {
                case 'summary':
                    data = this.generateSummaryData();
                    filename = `vsv-summary-report-${dateRange.replace(/\s+/g, '-').toLowerCase()}`;
                    break;
                case 'detailed':
                    data = this.generateDetailedData();
                    filename = `vsv-detailed-report-${dateRange.replace(/\s+/g, '-').toLowerCase()}`;
                    break;
                case 'export':
                    // Redirect to the dedicated export page
                    window.location.href = 'export-data.html';
                    this.hideLoading();
                    return;
                default:
                    data = this.generateSummaryData();
                    filename = `vsv-report-${dateRange.replace(/\s+/g, '-').toLowerCase()}`;
            }
            
            // Filter by category if not "All Categories"
            if (category !== 'All Categories') {
                data = this.filterDataByCategory(data, category);
            }
            
            // Export based on format
            switch (format.toLowerCase()) {
                case 'pdf':
                    this.exportAsPDF(data, `${filename}.pdf`);
                    break;
                case 'csv':
                    this.exportAsCSV(data, `${filename}.csv`);
                    break;
                case 'excel':
                    this.exportAsExcel(data, `${filename}.xlsx`);
                    break;
                case 'json':
                    this.exportAsJSON(data, `${filename}.json`);
                    break;
                default:
                    this.exportAsPDF(data, `${filename}.pdf`);
            }
            
            this.hideLoading();
            this.showNotification(`${reportType} report exported as ${format.toUpperCase()}`, 'success');
        }, 1000);
    }

    generateSummaryData() {
        // Generate summary data from the current report view
        return {
            generatedAt: new Date().toLocaleString(),
            reportType: 'Summary',
            overview: {
                totalRevenue: '₹4.2M',
                totalCustomers: '8,492',
                totalOrders: '3,783',
                growthRate: '+15.8%'
            },
            categoryBreakdown: [
                { category: 'Fashion', revenue: '₹1.34M', orders: 1245, growth: '+18.2%' },
                { category: 'Electronics', revenue: '₹1.13M', orders: 892, growth: '+12.4%' },
                { category: 'Home & Decor', revenue: '₹756K', orders: 678, growth: '+8.7%' },
                { category: 'Sports', revenue: '₹588K', orders: 523, growth: '+5.3%' },
                { category: 'Kids', revenue: '₹312K', orders: 445, growth: '+12.8%' }
            ],
            performanceMetrics: {
                conversionRate: '3.7%',
                avgOrderValue: '₹2,847',
                cartAbandonment: '68.2%',
                returnRate: '2.4%'
            }
        };
    }

    generateDetailedData() {
        // Generate detailed data including all tables and charts data
        return {
            generatedAt: new Date().toLocaleString(),
            reportType: 'Detailed',
            salesData: this.getSalesTableData(),
            inventoryData: this.getInventoryTableData(),
            customerData: this.getCustomerChartData(),
            performanceData: this.getPerformanceMetrics()
        };
    }

    getSalesTableData() {
        // Extract data from the sales table
        const table = document.querySelector('.table-container:first-child table');
        const data = [];
        if (table) {
            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
            table.querySelectorAll('tbody tr').forEach(row => {
                const rowData = {};
                Array.from(row.querySelectorAll('td')).forEach((td, index) => {
                    rowData[headers[index]] = td.textContent.trim();
                });
                data.push(rowData);
            });
        }
        return data;
    }

    getInventoryTableData() {
        // Extract data from the inventory table
        const table = document.querySelectorAll('.table-container')[1]?.querySelector('table');
        const data = [];
        if (table) {
            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
            table.querySelectorAll('tbody tr').forEach(row => {
                const rowData = {};
                Array.from(row.querySelectorAll('td')).forEach((td, index) => {
                    rowData[headers[index]] = td.textContent.trim();
                });
                data.push(rowData);
            });
        }
        return data;
    }

    getCustomerChartData() {
        // Get data from customer charts
        const acquisitionChart = this.charts.customerAcquisition;
        const clvChart = this.charts.clv;
        
        return {
            customerAcquisition: acquisitionChart ? acquisitionChart.data : null,
            customerLifetimeValue: clvChart ? clvChart.data : null
        };
    }

    getPerformanceMetrics() {
        // Extract performance metrics from KPI cards
        const metrics = {};
        document.querySelectorAll('.grid.kpi .card').forEach(card => {
            const title = card.querySelector('h3').textContent.trim();
            const value = card.querySelector('.value').textContent.trim();
            const trend = card.querySelector('.trend').textContent.trim();
            metrics[title] = { value, trend };
        });
        return metrics;
    }

    filterDataByCategory(data, category) {
        // Filter data based on selected category
        if (data.categoryBreakdown) {
            data.categoryBreakdown = data.categoryBreakdown.filter(item => 
                item.category.toLowerCase() === category.toLowerCase()
            );
        }
        if (data.salesData) {
            data.salesData = data.salesData.filter(item => 
                item.Category?.toLowerCase() === category.toLowerCase()
            );
        }
        return data;
    }

    exportAsCSV(data, filename) {
        let csvContent = '';
        
        if (Array.isArray(data)) {
            // Array data
            if (data.length > 0) {
                const headers = Object.keys(data[0]);
                csvContent = headers.join(',') + '\n';
                data.forEach(row => {
                    csvContent += headers.map(header => `"${row[header]}"`).join(',') + '\n';
                });
            }
        } else {
            // Object data
            Object.keys(data).forEach(key => {
                if (Array.isArray(data[key])) {
                    csvContent += `${key.toUpperCase()}\n`;
                    if (data[key].length > 0) {
                        const headers = Object.keys(data[key][0]);
                        csvContent += headers.join(',') + '\n';
                        data[key].forEach(row => {
                            csvContent += headers.map(header => `"${row[header]}"`).join(',') + '\n';
                        });
                    }
                    csvContent += '\n';
                } else {
                    csvContent += `${key},${JSON.stringify(data[key])}\n`;
                }
            });
        }
        
        this.downloadFile(csvContent, filename, 'text/csv');
    }

    exportAsExcel(data, filename) {
        try {
            const wb = XLSX.utils.book_new();
            
            if (Array.isArray(data)) {
                const ws = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(wb, ws, 'Data');
            } else {
                Object.keys(data).forEach((key, index) => {
                    if (Array.isArray(data[key])) {
                        const ws = XLSX.utils.json_to_sheet(data[key]);
                        XLSX.utils.book_append_sheet(wb, ws, key.slice(0, 30)); // Sheet name limit
                    }
                });
            }
            
            XLSX.writeFile(wb, filename);
        } catch (error) {
            console.error('Excel export error:', error);
            this.showNotification('Excel export failed. Please try again.', 'danger');
        }
    }

    exportAsPDF(data, filename) {
        // Simple PDF export - in a real implementation, use jsPDF
        const pdfContent = `
            VSV Easy Shop - Report Export
            Generated: ${new Date().toLocaleString()}
            
            ${JSON.stringify(data, null, 2)}
        `;
        this.downloadFile(pdfContent, filename, 'application/pdf');
    }

    exportAsJSON(data, filename) {
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, filename, 'application/json');
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

    setupAutoRefresh() {
        // Auto-refresh data every 5 minutes
        setInterval(() => {
            this.generateReport();
        }, 300000);
    }

    showLoading() {
        // Create or show loading indicator
        let loading = document.getElementById('loadingIndicator');
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'loadingIndicator';
            loading.style.cssText = 'position:fixed; top:20px; right:20px; background:var(--brand); color:white; padding:10px 20px; border-radius:8px; z-index:1000;';
            loading.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating report...';
            document.body.appendChild(loading);
        }
        loading.style.display = 'block';
    }

    hideLoading() {
        const loading = document.getElementById('loadingIndicator');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--brand)'};
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

// Initialize the reports manager
new ReportsManager();
