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
            syncOrdersFromAdmin();
            loadOrders();
        }
    });
    
    // Reload dữ liệu khi quay lại trang account
    window.addEventListener('focus', function() {
        if (document.getElementById('orders')?.classList.contains('active')) {
            syncOrdersFromAdmin();
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
    
    // Sync với admin trước khi hiển thị
    syncOrdersFromAdmin();
    
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
                
                <div class="order-actions" style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="btn-action" onclick="handleCancelOrder('${order.id}', '${userData.email}')" style="flex: 1; min-width: 120px; padding: 8px 12px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        Hủy đơn hàng
                    </button>
                    
                    <button class="btn-action" onclick="handleConfirmDelivery('${order.id}', '${userData.email}')" style="flex: 1; min-width: 140px; padding: 8px 12px; background-color: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        Xác nhận nhận hàng
                    </button>
                    
                    <button class="btn-action" onclick="handleOpenReview('${order.id}', '${userData.email}')" style="flex: 1; min-width: 120px; padding: 8px 12px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        Đánh giá
                    </button>
                </div>
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

// Hủy đơn hàng - với cảnh báo
function handleCancelOrder(orderId, email) {
    const userOrders = JSON.parse(localStorage.getItem(`orders_${email}`)) || [];
    const order = userOrders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Không tìm thấy đơn hàng');
        return;
    }
    
    // Kiểm tra trạng thái
    if (order.status !== 'pending') {
        alert(`Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xử lý". Đơn hàng hiện tại: ${getOrderStatusText(order.status)}`);
        return;
    }
    
    // Xác nhận từ user
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
        return;
    }
    
    // Cập nhật trạng thái ở user
    const orderIndex = userOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        userOrders[orderIndex].status = 'cancelled';
        userOrders[orderIndex].cancelledDate = new Date().toISOString();
        localStorage.setItem(`orders_${email}`, JSON.stringify(userOrders));
    }
    
    // Đồng bộ ngay tới admin
    syncUserOrderToAdmin(orderId, email, 'cancelled');
    
    alert('Đơn hàng đã được hủy thành công!');
    loadOrders();
}

// Xác nhận nhận hàng - với cảnh báo
function handleConfirmDelivery(orderId, email) {
    const userOrders = JSON.parse(localStorage.getItem(`orders_${email}`)) || [];
    const order = userOrders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Không tìm thấy đơn hàng');
        return;
    }
    
    // Kiểm tra trạng thái
    if (order.status !== 'shipping') {
        alert(`Chỉ có thể xác nhận nhận hàng khi đơn đang được giao. Đơn hàng hiện tại: ${getOrderStatusText(order.status)}`);
        return;
    }
    
    // Xác nhận từ user
    if (!confirm('Xác nhận rằng bạn đã nhận được đơn hàng?')) {
        return;
    }
    
    // Cập nhật trạng thái ở user
    const orderIndex = userOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        userOrders[orderIndex].status = 'delivered';
        userOrders[orderIndex].deliveredDate = new Date().toISOString();
        localStorage.setItem(`orders_${email}`, JSON.stringify(userOrders));
    }
    
    // Đồng bộ ngay tới admin
    syncUserOrderToAdmin(orderId, email, 'delivered');
    
    alert('Xác nhận nhận hàng thành công! Bây giờ bạn có thể đánh giá sản phẩm.');
    loadOrders();
}

// Đánh giá sản phẩm - với cảnh báo
function handleOpenReview(orderId, email) {
    const userOrders = JSON.parse(localStorage.getItem(`orders_${email}`)) || [];
    const order = userOrders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Không tìm thấy đơn hàng');
        return;
    }
    
    // Kiểm tra trạng thái
    if (order.status !== 'delivered') {
        alert(`Chỉ có thể đánh giá sản phẩm khi đơn hàng đã được giao. Đơn hàng hiện tại: ${getOrderStatusText(order.status)}`);
        return;
    }
    
    // Tạo modal đánh giá
    openReviewModal(orderId, email, order);
}

// ===== HÀM ĐỒNG BỘ ĐƠN HÀNG =====

// Đồng bộ trạng thái từ adminOrders xuống user orders (admin thay đổi → user nhìn thấy)
function syncOrdersFromAdmin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;
    
    const email = userData.email;
    const userOrders = JSON.parse(localStorage.getItem(`orders_${email}`)) || [];
    const adminOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
    
    let updated = false;
    
    userOrders.forEach(userOrder => {
        // Tìm order tương ứng ở admin qua code (code ở admin = id ở user)
        const adminOrder = adminOrders.find(ao => ao.code === userOrder.id);
        
        if (adminOrder && adminOrder.status !== userOrder.status) {
            console.log(`Syncing order ${userOrder.id}: ${userOrder.status} → ${adminOrder.status}`);
            userOrder.status = adminOrder.status;
            if (adminOrder.cancelledDate) userOrder.cancelledDate = adminOrder.cancelledDate;
            if (adminOrder.deliveredDate) userOrder.deliveredDate = adminOrder.deliveredDate;
            updated = true;
        }
    });
    
    if (updated) {
        localStorage.setItem(`orders_${email}`, JSON.stringify(userOrders));
        console.log('User orders synced from admin');
    }
}

// Đồng bộ từ user sang admin (user thay đổi → admin nhìn thấy)
function syncUserOrderToAdmin(userOrderId, email, newStatus) {
    try {
        // Lấy thông tin admin order
        const adminOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
        const adminOrderIndex = adminOrders.findIndex(ao => ao.code === userOrderId);
        
        if (adminOrderIndex === -1) {
            console.warn(`Admin order with code ${userOrderId} not found`);
            return;
        }
        
        // Cập nhật status
        adminOrders[adminOrderIndex].status = newStatus;
        if (newStatus === 'cancelled') {
            adminOrders[adminOrderIndex].cancelledDate = new Date().toISOString();
        }
        if (newStatus === 'delivered') {
            adminOrders[adminOrderIndex].deliveredDate = new Date().toISOString();
        }
        
        localStorage.setItem('adminOrders', JSON.stringify(adminOrders));
        console.log(`Admin order ${userOrderId} synced: status=${newStatus}`);
    } catch (err) {
        console.error('Error syncing user order to admin:', err);
    }
}

// Mở modal đánh giá sản phẩm
function openReviewModal(orderId, email, order) {
    // Tạo modal HTML
    const modalHTML = `
        <div id="review-modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000;">
            <div style="background: white; padding: 30px; border-radius: 8px; max-width: 600px; width: 90%; max-height: 85vh; overflow-y: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; font-size: 20px; color: #333;">Đánh giá sản phẩm</h3>
                    <button onclick="closeReviewModal()" style="border: none; background: none; font-size: 28px; cursor: pointer; padding: 0; color: #999;">&times;</button>
                </div>
                <div id="review-items-container" style="margin-bottom: 20px;"></div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                    <button onclick="closeReviewModal()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Hủy</button>
                    <button onclick="submitReview('${orderId}', '${email}')" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Gửi đánh giá</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Tạo form đánh giá cho từng sản phẩm
    const container = document.getElementById('review-items-container');
    container.innerHTML = '';
    
    order.items.forEach((item, index) => {
        const itemHTML = `
            <div style="border: 1px solid #e0e0e0; padding: 15px; margin-bottom: 15px; border-radius: 6px; background: #fafafa;">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <img src="${item.image}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;">
                    <div style="flex: 1;">
                        <p style="margin: 0; font-weight: bold; color: #333; font-size: 14px;">${item.name}</p>
                        <p style="margin: 5px 0; color: #666; font-size: 13px;">Số lượng: ${item.quantity}</p>
                    </div>
                </div>
                
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333; font-size: 14px;">Đánh giá <span style="color: #e74c3c;">*</span></label>
                    <div style="display: flex; gap: 8px;">
                        ${[1,2,3,4,5].map(star => `
                            <input type="radio" name="rating_${index}" value="${star}" id="star_${index}_${star}" style="display: none;">
                            <label for="star_${index}_${star}" onclick="updateStarDisplay(${index}, ${star})" style="font-size: 28px; cursor: pointer; color: #ddd; transition: color 0.2s;" class="star-label" data-index="${index}" data-value="${star}">★</label>
                        `).join('')}
                    </div>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 6px; font-weight: bold; color: #333; font-size: 14px;">Bình luận (Tùy chọn)</label>
                    <textarea name="comment_${index}" placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..." style="width: 100%; min-height: 70px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: Arial, sans-serif; font-size: 13px; resize: vertical; box-sizing: border-box;"></textarea>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHTML);
    });
}

// Cập nhật hiển thị sao khi click
function updateStarDisplay(index, rating) {
    const labels = document.querySelectorAll(`.star-label[data-index="${index}"]`);
    labels.forEach(label => {
        if (parseInt(label.getAttribute('data-value')) <= rating) {
            label.style.color = '#f39c12';
        } else {
            label.style.color = '#ddd';
        }
    });
}

// Đóng modal đánh giá
function closeReviewModal() {
    const modal = document.getElementById('review-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Gửi đánh giá
function submitReview(orderId, email) {
    const userOrders = JSON.parse(localStorage.getItem(`orders_${email}`)) || [];
    const order = userOrders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Lỗi: không tìm thấy thông tin đơn hàng');
        return;
    }
    
    let hasError = false;
    const reviews = [];
    const itemCount = order.items.length;
    
    // Thu thập dữ liệu đánh giá từ form
    for (let i = 0; i < itemCount; i++) {
        const rating = document.querySelector(`input[name="rating_${i}"]:checked`);
        if (!rating) {
            alert('Vui lòng đánh giá tất cả sản phẩm!');
            hasError = true;
            break;
        }
        
        const comment = document.querySelector(`textarea[name="comment_${i}"]`).value.trim();
        reviews.push({
            rating: parseInt(rating.value),
            comment: comment
        });
    }
    
    if (hasError) return;
    
    // Cập nhật reviews ở user order
    const orderIndex = userOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        userOrders[orderIndex].reviews = reviews;
        userOrders[orderIndex].reviewedDate = new Date().toISOString();
        localStorage.setItem(`orders_${email}`, JSON.stringify(userOrders));
        
        // Lưu review vào danh sách đánh giá tập trung
        const allReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
        order.items.forEach((item, idx) => {
            allReviews.push({
                orderId: orderId,
                productId: item.id,
                productName: item.name,
                rating: reviews[idx].rating,
                comment: reviews[idx].comment,
                reviewDate: new Date().toISOString(),
                reviewerName: JSON.parse(localStorage.getItem('userData')).name,
                reviewerEmail: email
            });
        });
        localStorage.setItem('productReviews', JSON.stringify(allReviews));
        
        alert('Cảm ơn bạn đã đánh giá! Đánh giá của bạn sẽ giúp cải thiện chất lượng dịch vụ.');
        closeReviewModal();
        loadOrders();
    }
}