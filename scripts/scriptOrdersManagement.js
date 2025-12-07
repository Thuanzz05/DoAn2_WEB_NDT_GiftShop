let allOrders = [];
let currentFilter = 'all';
let currentUserEmail = '';

document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
        const container = document.getElementById('ordersContainer');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; grid-column: 1/-1;">
                    <i class="fas fa-sign-in-alt" style="font-size: 48px; color: #ddd; margin-bottom: 15px; display: block;"></i>
                    <p style="color: #666; font-size: 16px;">Vui lòng <a href="login-register.html">đăng nhập</a> để xem đơn hàng</p>
                </div>
            `;
        }
        return;
    }
    
    currentUserEmail = userData.email;
    loadOrders();
    setupEventListeners();
});


function loadOrders() {
    try {
        syncOrdersFromAdmin(currentUserEmail);
        
        const storedOrders = localStorage.getItem(`orders_${currentUserEmail}`);
        if (storedOrders) {
            allOrders = JSON.parse(storedOrders);
        } else {
            allOrders = [];
        }
        displayOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
        allOrders = [];
    }
}

/* Đồng bộ đơn hàng từ admin về user*/
function syncOrdersFromAdmin(email) {
    try {
        const userOrders = JSON.parse(localStorage.getItem(`orders_${email}`)) || [];
        const adminOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
        
        let updated = false;
        
        userOrders.forEach(userOrder => {
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
    } catch (error) {
        console.error('Error syncing orders from admin:', error);
    }
}

/*Hiển thị danh sách đơn hàng */
function displayOrders() {
    const container = document.getElementById('ordersContainer');
    if (!container) return;

    // Áp dụng bộ lọc
    let filteredOrders = allOrders;
    if (currentFilter !== 'all') {
        filteredOrders = allOrders.filter(order => order.status === currentFilter);
    }

    // Áp dụng tìm kiếm
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.toLowerCase().trim();
        filteredOrders = filteredOrders.filter(order => {
            return (
                order.id.toString().includes(searchTerm) ||
                order.customerInfo.email.toLowerCase().includes(searchTerm) ||
                order.customerInfo.phone.includes(searchTerm) ||
                order.customerInfo.fullname.toLowerCase().includes(searchTerm)
            );
        });
    }

    // Hiển thị trạng thái trống
    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-box-open" style="font-size: 48px; color: #ddd; margin-bottom: 15px; display: block;"></i>
                <p style="color: #666; font-size: 16px;">Bạn chưa có đơn hàng nào</p>
            </div>
        `;
        return;
    }

    // Hiển thị danh sách đơn hàng
    let ordersHTML = '';
    
    filteredOrders.forEach(order => {
        const orderDate = new Date(order.orderDate).toLocaleDateString('vi-VN');
        const statusText = getOrderStatusText(order.status);
        const statusClass = getOrderStatusClass(order.status);
        
        ordersHTML += `
            <div style="border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; border-radius: 8px; background: white; grid-column: 1/-1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <h4 style="margin: 0; color: #333;">Mã đơn hàng: ${order.id}</h4>
                        <p style="margin: 5px 0; color: #666; font-size: 14px;">Ngày đặt: ${orderDate}</p>
                    </div>
                    <span class="status-badge ${statusClass}" style="padding: 8px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                        ${statusText}
                    </span>
                </div>
                
                <div style="margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
                    <p style="margin: 5px 0;"><strong>Người nhận:</strong> ${order.customerInfo.fullname}</p>
                    <p style="margin: 5px 0;"><strong>SĐT:</strong> ${order.customerInfo.phone}</p>
                    <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> ${order.customerInfo.address}</p>
                    <p style="margin: 5px 0;"><strong>Thanh toán:</strong> ${getPaymentMethodText(order.paymentMethod)}</p>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <h5 style="margin: 10px 0; color: #333;">Sản phẩm:</h5>
                    ${order.items.map(item => `
                        <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 4px;">
                            <div style="flex: 1;">
                                <p style="margin: 0; font-weight: bold;">${item.name}</p>
                                <p style="margin: 5px 0; color: #666; font-size: 14px;">Số lượng: ${item.quantity} | Giá: ${item.price.toLocaleString()}₫</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="margin: 0; font-weight: bold; color: #e74c3c;">
                                    ${(item.price * item.quantity).toLocaleString()}₫
                                </p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="text-align: right; padding-top: 15px; border-top: 1px solid #ddd;">
                    <p style="margin: 5px 0;">Phí vận chuyển: ${order.shippingFee.toLocaleString()}₫</p>
                    <p style="margin: 10px 0; font-size: 18px; font-weight: bold; color: #e74c3c;">
                        Tổng cộng: ${order.totalPrice.toLocaleString()}₫
                    </p>
                </div>
                
                ${order.note ? `
                <div style="margin-top: 10px; padding: 10px; background-color: #f9f9f9; border-radius: 4px;">
                    <p style="margin: 0; color: #666;"><strong>Ghi chú:</strong> ${order.note}</p>
                </div>
                ` : ''}
                
                <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                    ${getOrderActionButtons(order)}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = ordersHTML;
}

function getOrderActionButtons(order) {
    let buttons = '';
    
    // Chỉ pending cho phép hủy
    if (order.status === 'pending') {
        buttons += `
            <button onclick="handleCancelOrder('${order.id}', '${currentUserEmail}')" 
                style="flex: 1; min-width: 120px; padding: 8px 12px; background-color: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                Hủy đơn hàng
            </button>
        `;
    }
    
    if (order.status === 'shipping') {
        buttons += `
            <button onclick="handleConfirmDelivery('${order.id}', '${currentUserEmail}')" 
                style="flex: 1; min-width: 140px; padding: 8px 12px; background-color: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                Xác nhận nhận hàng
            </button>
        `;
    }
    
    if (order.status === 'completed') {
        buttons += `
            <button onclick="handleOpenReview('${order.id}', '${currentUserEmail}')" 
                style="flex: 1; min-width: 120px; padding: 8px 12px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                Đánh giá
            </button>
        `;
    }
    
    return buttons;
}

/*Hủy đơn hàng*/
function handleCancelOrder(orderId, email) {
    const userOrders = JSON.parse(localStorage.getItem(`orders_${email}`)) || [];
    const orderIndex = userOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        alert('Không tìm thấy đơn hàng');
        return;
    }
    
    const order = userOrders[orderIndex];
    
    // Kiểm tra có thể hủy hay không
    if (!['pending', 'processing', 'confirmed'].includes(order.status)) {
        alert(`Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xử lý" hoặc "Đã xác nhận". Đơn hàng hiện tại: ${getOrderStatusText(order.status)}`);
        return;
    }
    
    if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
        order.status = 'cancelled';
        order.cancelledDate = new Date().toISOString();
        
        localStorage.setItem(`orders_${email}`, JSON.stringify(userOrders));
        
        syncUserOrderToAdmin(orderId, email, 'cancelled');
        
        allOrders = userOrders;
        displayOrders();
        
        alert('Hủy đơn hàng thành công');
    }
}

/* Xác nhận nhận hàng */
function handleConfirmDelivery(orderId, email) {
    const userOrders = JSON.parse(localStorage.getItem(`orders_${email}`)) || [];
    const orderIndex = userOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
        alert('Không tìm thấy đơn hàng');
        return;
    }
    
    const order = userOrders[orderIndex];
    
    if (order.status !== 'shipping') {
        alert('Chỉ có thể xác nhận nhận hàng khi đang giao hàng');
        return;
    }
    
    if (confirm('Bạn đã nhận được hàng chưa?')) {
        order.status = 'completed';
        order.deliveredDate = new Date().toISOString();
        
        localStorage.setItem(`orders_${email}`, JSON.stringify(userOrders));
        
        syncUserOrderToAdmin(orderId, email, 'completed');
        
        allOrders = userOrders;
        displayOrders();
        
        alert('Xác nhận nhận hàng thành công');
    }
}

function handleOpenReview(orderId, email) {
    const userOrders = JSON.parse(localStorage.getItem(`orders_${email}`)) || [];
    const order = userOrders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Không tìm thấy đơn hàng');
        return;
    }
    
    if (order.status !== 'completed') {
        alert('Chỉ có thể đánh giá khi đơn hàng đã hoàn tất');
        return;
    }
    
    // Gọi hàm openReviewModal từ scriptAccount.js
    openReviewModal(orderId, email, order);
}

/*Đồng bộ thay đổi đơn hàng từ user về admin*/
function syncUserOrderToAdmin(userOrderId, email, newStatus) {
    try {
        const adminOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
        const adminOrderIndex = adminOrders.findIndex(ao => ao.code === userOrderId);
        
        if (adminOrderIndex === -1) {
            console.warn(`Admin order with code ${userOrderId} not found`);
            return;
        }
        
        // Cập nhật trạng thái
        adminOrders[adminOrderIndex].status = newStatus;
        if (newStatus === 'cancelled') {
            adminOrders[adminOrderIndex].cancelledDate = new Date().toISOString();
        }
        if (newStatus === 'completed') {
            adminOrders[adminOrderIndex].deliveredDate = new Date().toISOString();
        }
        
        // Lưu vào đơn hàng admin
        localStorage.setItem('adminOrders', JSON.stringify(adminOrders));
        console.log(`Synced to admin: ${userOrderId} → ${newStatus}`);
    } catch (error) {
        console.error('Error syncing to admin:', error);
    }
}


/* Cập nhật số lượng trong các tab bộ lọc dựa trên trạng thái đơn hàng*/
function updateTabCounts() {
    const counts = {
        'all': allOrders.length,
        'pending': allOrders.filter(o => o.status === 'pending').length,
        'shipping': allOrders.filter(o => o.status === 'shipping').length,
        'completed': allOrders.filter(o => o.status === 'completed').length,
        'cancelled': allOrders.filter(o => o.status === 'cancelled').length
    };
    
    Object.keys(counts).forEach(status => {
        const countEl = document.getElementById(`count-${status}`);
        if (countEl) {
            countEl.textContent = counts[status];
        }
    });
}

/*Thiết lập event listeners cho các tab bộ lọc và tìm kiếm*/
function setupEventListeners() {
    updateTabCounts();
    
    // Tab trạng thái
    const statusTabs = document.querySelectorAll('.status-tab');
    if (statusTabs.length > 0) {
        statusTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                statusTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.dataset.status || 'all';
                displayOrders();
            });
        });
        
        // Đặt tab đầu tiên là active
        statusTabs[0].classList.add('active');
    }
    
    // Ô tìm kiếm
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            displayOrders();
        });
    }
}

/**Lấy tên trạng thái đơn hàng bằng tiếng Việt*/
function getOrderStatusText(status) {
    const statusMap = {
        'pending': 'Đang xử lý',
        'shipping': 'Đang giao',
        'completed': 'Hoàn tất',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || 'Đang xử lý';
}

/*Lấy tên class CSS tương ứng với trạng thái đơn hàng*/
function getOrderStatusClass(status) {
    const classMap = {
        'pending': 'status-pending',
        'shipping': 'status-shipping',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    return classMap[status] || 'status-pending';
}

/* Lấy nội dung hiển thị cho phương thức thanh toán*/
function getPaymentMethodText(method) {
    const methodMap = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'bank': 'Chuyển khoản ngân hàng',
        'momo': 'Ví điện tử MoMo'
    };
    return methodMap[method] || 'COD';
}
