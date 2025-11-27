document.addEventListener('DOMContentLoaded', function() {
    taiThongKe();
});

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
    // Cách tính hợp lý:
    // - Đơn hàng đã hoàn thành (completed): tính vào doanh thu thực tế
    // - Đơn hàng đang xử lý/giao (pending/shipping): tính vào doanh thu tiềm năng
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
    
    // Hiển thị doanh thu thực tế (hoàn thành)
    document.getElementById('total-revenue').textContent = tongDoanhThuThucTe.toLocaleString('vi-VN') + '₫';
    
    // Thêm thông tin chi tiết vào console để admin có thể xem
    console.log('=== THỐNG KÊ DOANH THU ===');
    console.log('Doanh thu thực tế (hoàn thành):', tongDoanhThuThucTe.toLocaleString('vi-VN') + '₫');
    console.log('Doanh thu tiềm năng (đang xử lý/giao):', tongDoanhThuTienNang.toLocaleString('vi-VN') + '₫');
    console.log('Chi tiết theo trạng thái:', {
        'Đang xử lý': totalByStatus.pending.toLocaleString('vi-VN') + '₫',
        'Đang giao': totalByStatus.shipping.toLocaleString('vi-VN') + '₫',
        'Hoàn tất': totalByStatus.completed.toLocaleString('vi-VN') + '₫',
        'Đã hủy': totalByStatus.cancelled.toLocaleString('vi-VN') + '₫'
    });
}