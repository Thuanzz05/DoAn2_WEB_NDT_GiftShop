document.addEventListener('DOMContentLoaded', function() {
    taiThongKe();
    setupReportExport();
    
    // Delay để đảm bảo canvas đã render
    setTimeout(function() {
        initCharts();
    }, 500);
});

function setupReportExport() {
    const btn = document.getElementById('export-report-btn');
    if (!btn) return;
    btn.addEventListener('click', function() {
        xuatBaoCaoDonHangCSV();
    });
}

function taiThongKe() {
    // Đếm sản phẩm từ localStorage
    const danhSachSanPham = JSON.parse(localStorage.getItem('products') || '[]');
    document.getElementById('total-products').textContent = danhSachSanPham.length;

    // Đếm đơn hàng từ adminOrders (đơn hàng của admin quản lý)
    const danhSachDonHang = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    document.getElementById('total-orders').textContent = danhSachDonHang.length;

    // Đếm khách hàng
    const danhSachKhachHang = JSON.parse(localStorage.getItem('customers') || '[]');
    document.getElementById('total-customers').textContent = danhSachKhachHang.length;

    // Tính doanh thu từ các đơn hàng
    let tongDoanhThuThucTe = 0;
    let tongDoanhThuTienNang = 0;
    let totalByStatus = {
        pending: 0,
        shipping: 0,
        completed: 0,
        cancelled: 0
    };
    
    danhSachDonHang.forEach(donHang => {
        const tien = donHang.total || 0;
        
        if (donHang.status === 'completed') {
            tongDoanhThuThucTe += tien;
            totalByStatus.completed += tien;
        } else if (donHang.status === 'cancelled') {
            totalByStatus.cancelled += tien; // Theo dõi đơn bị hủy
        } else if (donHang.status === 'pending') {
            tongDoanhThuTienNang += tien;
            totalByStatus.pending += tien;
        } else if (donHang.status === 'shipping') {
            tongDoanhThuTienNang += tien;
            totalByStatus.shipping += tien;
        }
    });
    
    //Hiển thị doanh thu thực tế 
    document.getElementById('total-revenue').textContent = tongDoanhThuThucTe.toLocaleString('vi-VN') + '₫';
}

// Xuất báo cáo đơn hàng thành CSV
function xuatBaoCaoDonHangCSV() {
    const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');

    if (!orders || orders.length === 0) {
        alert('Không có đơn hàng để xuất báo cáo.');
        return;
    }

    // Chuẩn bị header
    const headers = ['Order ID', 'Ngày', 'Khách hàng', 'Email', 'Tổng tiền', 'Trạng thái', 'Mặt hàng (tên x số lượng)'];

    // Chuyển orders sang dòng CSV
    const rows = orders.map(o => {
        const id = o.id ?? '';
        const date = o.date || o.createdAt || '';
        const customerName = o.customerName || o.customer?.name || o.customerId || '';
        const email = o.customer?.email || o.email || '';
        const total = (o.total || 0);

        // items: hỗ trợ cả mảng items hoặc object
        let itemsText = '';
        if (Array.isArray(o.items)) {
            itemsText = o.items.map(it => `${it.name || it.productName || it.productId} x${it.quantity||it.qty||1}`).join(' | ');
        } else if (o.items && typeof o.items === 'object') {
            try { itemsText = JSON.stringify(o.items); } catch(e) { itemsText = String(o.items); }
        }

        const escape = v => `"${String(v).replace(/"/g, '""')}"`;

        return [id, date, customerName, email, total, o.status || '', itemsText].map(escape).join(',');
    });

    // Thêm BOM UTF-8 để Excel trên Windows nhận diện đúng encoding
    const csvBody = [headers.join(','), ...rows].join('\r\n');
    const csvContent = '\uFEFF' + csvBody;

    // Tạo file blob và download (UTF-8 với BOM)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const filename = `report_orders_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.csv`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Đã tải xuống báo cáo: ' + filename);
}

// ============== CHARTS FUNCTIONS ==============

// Biến toàn cục để lưu trữ loại biểu đồ hiện tại
let currentRevenueChartType = 'day';

// Khởi tạo tất cả biểu đồ
function initCharts() {
    drawRevenueChart('day');
    drawTopProductsChart();
}

// Hàm thay đổi loại biểu đồ doanh thu
function changeRevenueChartType(type) {
    currentRevenueChartType = type;
    
    // Cập nhật active button
    document.getElementById('revenueByDay').classList.remove('active');
    document.getElementById('revenueByMonth').classList.remove('active');
    document.getElementById('revenueByYear').classList.remove('active');
    document.getElementById('revenueBy' + type.charAt(0).toUpperCase() + type.slice(1)).classList.add('active');
    
    // Vẽ lại biểu đồ
    drawRevenueChart(type);
}

// Biểu đồ 1: Doanh thu theo ngày/tháng/năm
function drawRevenueChart(type = 'day') {
    try {
        const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        const revenueData = {};
        
        orders.forEach(order => {
            if (order.status === 'completed') {
                const date = order.date || order.createdAt || new Date().toISOString().split('T')[0];
                const dateStr = date.substring(0, 10);
                let key;
                
                if (type === 'day') {
                    // Format: YYYY-MM-DD
                    key = dateStr;
                } else if (type === 'month') {
                    // Format: YYYY-MM (năm-tháng)
                    key = dateStr.substring(0, 7);
                } else if (type === 'year') {
                    // Format: YYYY (năm)
                    key = dateStr.substring(0, 4);
                }
                
                if (!revenueData[key]) {
                    revenueData[key] = 0;
                }
                revenueData[key] += order.total || 0;
            }
        });
        
        // Sắp xếp theo key và lấy dữ liệu
        const sortedKeys = Object.keys(revenueData).sort();
        let displayKeys = sortedKeys;
        
        // Giới hạn số điểm dữ liệu để biểu đồ không quá chật
        if (type === 'day' && sortedKeys.length > 30) {
            displayKeys = sortedKeys.slice(-30);
        } else if (type === 'month' && sortedKeys.length > 24) {
            displayKeys = sortedKeys.slice(-24);
        }
        
        const labels = displayKeys.length > 0 ? displayKeys : ['Không có dữ liệu'];
        const data = displayKeys.length > 0 ? displayKeys.map(key => revenueData[key]) : [0];
        
        const ctx = document.getElementById('revenueChart');
        if (!ctx) {
            console.error('Canvas element revenueChart not found');
            return;
        }
        
        // Nếu biểu đồ đã tồn tại, hủy nó trước
        if (window.revenueChart && typeof window.revenueChart.destroy === 'function') {
            window.revenueChart.destroy();
        }
        
        window.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Doanh thu (₫)',
                    data: data,
                    borderColor: '#B53740',
                    backgroundColor: 'rgba(181, 55, 64, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#B53740',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('vi-VN') + '₫';
                            }
                        }
                    }
                }
            }
        });
        console.log('Revenue chart created successfully for type:', type);
    } catch (error) {
        console.error('Error creating revenue chart:', error);
    }
}

// Biểu đồ 2: Top 5 sản phẩm bán chạy
function drawTopProductsChart() {
    try {
        const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Tính số lượng bán của mỗi sản phẩm (CHỈ từ các đơn hàng hoàn thành)
        const productSales = {};
        
        orders.forEach(order => {
            // CHỈ tính các đơn hàng có trạng thái 'completed'
            if (order.status === 'completed' && order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    // Sử dụng productId, nếu không có thì dùng name hoặc id
                    const productId = item.productId || item.id || item.name;
                    const productName = item.name || 'Sản phẩm không xác định';
                    const quantity = item.quantity || item.qty || 1;
                    
                    if (!productSales[productId]) {
                        productSales[productId] = { 
                            qty: 0, 
                            name: productName,
                            id: productId
                        };
                    }
                    productSales[productId].qty += quantity;
                });
            }
        });
        
        // Log dữ liệu để debug
        console.log('Product Sales Data:', productSales);
        console.log('Total products with sales:', Object.keys(productSales).length);
        
        // Sắp xếp và lấy top 5
        const sorted = Object.entries(productSales)
            .map(([id, data]) => ({ id, qty: data.qty, name: data.name }))
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 5);
        
        console.log('Top 5 Products:', sorted);
        console.log('Sorted length:', sorted.length);
        
        const labels = sorted.length > 0 ? sorted.map(p => p.name.substring(0, 25)) : ['Không có dữ liệu'];
        const data = sorted.length > 0 ? sorted.map(p => p.qty) : [0];
        
        console.log('Chart Labels:', labels);
        console.log('Chart Data:', data);
        
        const ctx = document.getElementById('topProductsChart');
        if (!ctx) {
            console.error('Canvas element topProductsChart not found');
            return;
        }
        
        if (window.topProductsChart && typeof window.topProductsChart.destroy === 'function') {
            window.topProductsChart.destroy();
        }
        
        // Điều chỉnh chiều cao container dựa trên số lượng sản phẩm
        const chartContainer = ctx.closest('.chart-container > div');
        if (chartContainer) {
            const heightPerProduct = 50;
            const minHeight = 300;
            const calculatedHeight = Math.max(minHeight, heightPerProduct * sorted.length);
            chartContainer.style.height = calculatedHeight + 'px';
        }
        
        window.topProductsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Số lượng bán',
                    data: data,
                    backgroundColor: '#B53740',
                    borderColor: '#8B2635',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    },
                    y: {
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
        console.log('Top products chart created successfully with', sorted.length, 'products');
    } catch (error) {
        console.error('Error creating top products chart:', error);
    }
}