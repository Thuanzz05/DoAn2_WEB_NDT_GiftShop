document.addEventListener('DOMContentLoaded', function() {
    taiThongKe();
    setupReportExport();
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