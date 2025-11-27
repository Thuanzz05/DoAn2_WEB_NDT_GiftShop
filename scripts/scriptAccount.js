document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    const isLoggedIn = checkLogin();
    if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để sử dụng chức năng này!');
        window.location.href = 'login-register.html';
        return;
    }

    // Load dữ liệu người dùng
    loadUserData();

    // Xử lý menu sidebar
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });

    // Reload dữ liệu đơn hàng khi tab được focus lại
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && document.getElementById('orders')?.classList.contains('active')) {
            loadOrders();
        }
    });
    
    // Reload dữ liệu khi quay lại trang account
    window.addEventListener('focus', function() {
        if (document.getElementById('orders')?.classList.contains('active')) {
            loadOrders();
        }
    });

    // Xử lý form chỉnh sửa thông tin
    document.getElementById('edit-form').addEventListener('submit', handleEditSubmit);

    // Xử lý form đổi mật khẩu
    document.getElementById('password-form').addEventListener('submit', handlePasswordSubmit);
});

// Kiểm tra đăng nhập
function checkLogin() {
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUserData) {
        try {
            const parsedData = JSON.parse(storedUserData);
            if (parsedData.isLoggedIn) {
                return true;
            }
        } catch (e) {
            console.error('Lỗi parse userData:', e);
        }
    }
    
    return false;
}

// Load dữ liệu người dùng từ localStorage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) return;
    
    // Hiển thị thông tin trên tab "Thông tin tài khoản"
    document.getElementById('display-name').textContent = userData.name || 'Chưa cập nhật';
    document.getElementById('display-email').textContent = userData.email || 'Chưa cập nhật';
    document.getElementById('display-phone').textContent = userData.phone || 'Chưa cập nhật';
    document.getElementById('display-address').textContent = userData.address || 'Chưa cập nhật';
    document.getElementById('display-joindate').textContent = userData.joinDate || 'Chưa cập nhật';

    // Load vào form edit
    document.getElementById('edit-name').value = userData.name || '';
    document.getElementById('edit-phone').value = userData.phone || '';
    document.getElementById('edit-address').value = userData.address || '';
}

// Chuyển section
function switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    hideAllAlerts();
    
    // Nếu chuyển đến section đơn hàng, load danh sách đơn hàng
    if (sectionId === 'orders') {
        loadOrders();
    }
}

// Xử lý cập nhật thông tin
function handleEditSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('edit-name').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const address = document.getElementById('edit-address').value.trim();

    // Validate số điện thoại
    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone)) {
        showAlert('edit-error');
        return;
    }

    // Validate tên không rỗng
    if (!name) {
        showAlert('edit-error');
        return;
    }

    // Lấy dữ liệu hiện tại
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    // Cập nhật thông tin mới
    userData.name = name;
    userData.phone = phone;
    userData.address = address;
    
    // Lưu lại
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Cập nhật vào danh sách accounts
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const accountIndex = accounts.findIndex(acc => acc.email === userData.email);
    
    if (accountIndex !== -1) {
        accounts[accountIndex].name = name;
        accounts[accountIndex].phone = phone;
        accounts[accountIndex].address = address;
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }
    
    // Đồng bộ với danh sách customers của admin
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customerIndex = customers.findIndex(c => c.email === userData.email);
    
    if (customerIndex !== -1) {
        customers[customerIndex].name = name;
        customers[customerIndex].phone = phone;
        customers[customerIndex].address = address;
        localStorage.setItem('customers', JSON.stringify(customers));
    } else {
        // Nếu chưa có trong customers, thêm mới (trường hợp khách hàng đăng ký trước khi có tính năng đồng bộ)
        const newCustomerId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
        customers.push({
            id: newCustomerId,
            name: name,
            email: userData.email,
            phone: phone,
            address: address,
            joinDate: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('customers', JSON.stringify(customers));
    }

    // Cập nhật hiển thị
    loadUserData();

    // Hiển thị thông báo thành công
    showAlert('edit-success');

    // Chuyển về tab xem thông tin sau 1.5s
    setTimeout(() => {
        switchSection('info');
    }, 1500);
}

// Xử lý đổi mật khẩu
function handlePasswordSubmit(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate mật khẩu mới phải khớp
    if (newPassword !== confirmPassword) {
        showAlert('password-error');
        return;
    }

    // Validate độ dài mật khẩu
    if (newPassword.length < 6) {
        showAlert('password-error');
        return;
    }

    // Lấy thông tin user hiện tại
    const userData = JSON.parse(localStorage.getItem('userData'));
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    
    // Tìm account trong danh sách
    const accountIndex = accounts.findIndex(acc => acc.email === userData.email);
    
    if (accountIndex !== -1) {
        // Kiểm tra mật khẩu cũ
        if (accounts[accountIndex].password !== currentPassword) {
            alert('Mật khẩu hiện tại không đúng!');
            showAlert('password-error');
            return;
        }
        
        // Cập nhật mật khẩu mới
        accounts[accountIndex].password = newPassword;
        localStorage.setItem('accounts', JSON.stringify(accounts));
        
        // Hiển thị thông báo thành công
        showAlert('password-success');
        
        // Reset form
        document.getElementById('password-form').reset();
        
        alert('Đổi mật khẩu thành công!');
    }
}

// Hiển thị alert
function showAlert(alertId) {
    hideAllAlerts();
    const alert = document.getElementById(alertId);
    if (alert) {
        alert.classList.add('show');

        setTimeout(() => {
            alert.classList.remove('show');
        }, 3000);
    }
}

// Ẩn tất cả alert
function hideAllAlerts() {
    document.querySelectorAll('.alert').forEach(a => a.classList.remove('show'));
}

// Hủy chỉnh sửa
function cancelEdit() {
    loadUserData();
    switchSection('info');
}

// Đăng xuất
function handleLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        // Xóa session
        localStorage.removeItem('userData');
        
        // localStorage.removeItem('cart');

        alert('Đăng xuất thành công!');
        window.location.href = 'index.html';
    }
}

// Hàm đăng xuất từ trang index (dùng chung)
window.handleLogoutFromIndex = handleLogout;

// Load đơn hàng 
function loadOrders() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;
    
    // Lấy đơn hàng của user hiện tại
    const userOrders = JSON.parse(localStorage.getItem(`orders_${userData.email}`)) || [];
    
    const ordersContainer = document.getElementById('orders-container');
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
            <p style="text-align: center; color: #666; padding: 40px 0;">
                <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                Bạn chưa có đơn hàng nào
            </p>
        `;
        return;
    }
    
    // Hiển thị danh sách đơn hàng
    let ordersHTML = '';
    
    userOrders.forEach(order => {
        const orderDate = new Date(order.orderDate).toLocaleDateString('vi-VN');
        const statusText = getOrderStatusText(order.status);
        const statusClass = getOrderStatusClass(order.status);
        
        ordersHTML += `
            <div class="order-item" style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
                <div class="order-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <h4 style="margin: 0; color: #333;">Mã đơn hàng: ${order.id}</h4>
                        <p style="margin: 5px 0; color: #666; font-size: 14px;">Ngày đặt: ${orderDate}</p>
                    </div>
                    <div class="order-status">
                        <span class="status-badge ${statusClass}" style="padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                            ${statusText}
                        </span>
                    </div>
                </div>
                
                <div class="order-info" style="margin-bottom: 15px;">
                    <p style="margin: 5px 0;"><strong>Người nhận:</strong> ${order.customerInfo.fullname}</p>
                    <p style="margin: 5px 0;"><strong>SĐT:</strong> ${order.customerInfo.phone}</p>
                    <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> ${order.customerInfo.address}</p>
                    <p style="margin: 5px 0;"><strong>Thanh toán:</strong> ${getPaymentMethodText(order.paymentMethod)}</p>
                </div>
                
                <div class="order-items">
                    <h5 style="margin: 10px 0;">Sản phẩm:</h5>
        `;
        
        order.items.forEach(item => {
            ordersHTML += `
                <div class="order-product" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                    <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 4px;">
                    <div style="flex: 1;">
                        <p style="margin: 0; font-weight: bold;">${item.name}</p>
                        <p style="margin: 5px 0; color: #666;">Số lượng: ${item.quantity} | Giá: ${item.price.toLocaleString()}₫</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0; font-weight: bold; color: #e74c3c;">
                            ${(item.price * item.quantity).toLocaleString()}₫
                        </p>
                    </div>
                </div>
            `;
        });
        
        ordersHTML += `
                </div>
                
                <div class="order-total" style="text-align: right; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <p style="margin: 5px 0;">Phí vận chuyển: ${order.shippingFee.toLocaleString()}₫</p>
                    <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #e74c3c;">
                        Tổng cộng: ${order.totalPrice.toLocaleString()}₫
                    </p>
                </div>
                
                ${order.note ? `
                <div class="order-note" style="margin-top: 10px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;">
                    <p style="margin: 0; color: #666;"><strong>Ghi chú:</strong> ${order.note}</p>
                </div>
                ` : ''}
            </div>
        `;
    });
    
    ordersContainer.innerHTML = ordersHTML;
}

// Lấy text trạng thái đơn hàng
function getOrderStatusText(status) {
    const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipping': 'Đang giao hàng',
        'delivered': 'Đã giao hàng',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || 'Chờ xử lý';
}

// Lấy class CSS cho trạng thái đơn hàng
function getOrderStatusClass(status) {
    const classMap = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'shipping': 'status-shipping',
        'delivered': 'status-delivered',
        'cancelled': 'status-cancelled'
    };
    return classMap[status] || 'status-pending';
}

// Lấy text phương thức thanh toán
function getPaymentMethodText(method) {
    const methodMap = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'bank': 'Chuyển khoản ngân hàng',
        'momo': 'Ví điện tử MoMo'
    };
    return methodMap[method] || 'COD';
}