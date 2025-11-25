// Tài khoản admin 
const ADMIN_ACCOUNTS = [
    { 
        username: 'admin', 
        password: 'admin123', 
        name: 'Admin', 
        role: 'admin' 
    },
    { 
        username: 'manager', 
        password: 'manager123', 
        name: 'Quản lý', 
        role: 'manager' 
    }
];

// Xử lý đăng nhập khi submit form
document.getElementById('admin-login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Ngăn form reload trang

    // Lấy giá trị input
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;

    // Kiểm tra tài khoản có tồn tại không
    const admin = ADMIN_ACCOUNTS.find(acc => 
        acc.username === username && acc.password === password
    );

    if (admin) {
        // ✅ ĐĂNG NHẬP THÀNH CÔNG
        
        // Tạo object lưu thông tin admin
        const adminData = {
            username: admin.username,
            name: admin.name,
            role: admin.role,
            isAdmin: true,
            loginTime: new Date().toISOString()
        };

        // Lưu vào localStorage
        localStorage.setItem('adminData', JSON.stringify(adminData));

        // Hiển thị thông báo
        alert('Đăng nhập thành công! Chào mừng ' + admin.name);
        
        // Chuyển đến trang dashboard
        window.location.href = 'admin-dashboard.html';
        
    } else {
        // Hiển thị alert lỗi
        const errorAlert = document.getElementById('error-alert');
        errorAlert.classList.add('show');
        
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            errorAlert.classList.remove('show');
        }, 3000);
    }
});