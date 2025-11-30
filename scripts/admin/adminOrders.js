document.addEventListener('DOMContentLoaded', function() {
    loadCustomersToSelect();
    loadOrders();
    setupForm();
    setupFilter();
    setupSearch();
    
    // Set ngày hiện tại
    document.getElementById('order-date').valueAsDate = new Date();
});

function loadCustomersToSelect() {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const select = document.getElementById('order-customer');
    
    select.innerHTML = '<option value="">-- Chọn khách hàng --</option>';
    
    customers.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = `${c.name} (${c.phone})`;
        select.appendChild(option);
    });
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const tbody = document.getElementById('order-list');
    
    console.log('Loading orders:', orders); // Debug
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có đơn hàng nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        console.log('Processing order:', order); // Debug
        
        // Lấy tên khách hàng từ nhiều nguồn
        let customerName = '';
        if (order.customerName) {
            customerName = order.customerName;
        } else if (order.customerId) {
            const customers = JSON.parse(localStorage.getItem('customers') || '[]');
            const customer = customers.find(c => c.id == order.customerId);
            if (customer) customerName = customer.name;
        }
        
        const statusMap = {
            'pending': 'badge-warning',
            'shipping': 'badge-info',
            'completed': 'badge-success',
            'cancelled': 'badge-danger'
        };
        
        const statusText = {
            'pending': 'Đang xử lý',
            'shipping': 'Đang giao',
            'completed': 'Hoàn tất',
            'cancelled': 'Đã hủy'
        };
        
        // Đảm bảo có giá trị hợp lệ
        const orderCode = order.code || order.id || 'N/A';
        const orderDate = order.date || new Date().toISOString().split('T')[0];
        const orderTotal = parseInt(order.total || 0);
        const orderStatus = order.status || 'pending';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${orderCode}</td>
            <td>${customerName}</td>
            <td>${orderDate}</td>
            <td>${orderTotal.toLocaleString('vi-VN')}₫</td>
            <td><span class="badge ${statusMap[orderStatus]}">${statusText[orderStatus]}</span></td>
            <td>
                <button class="btn-icon" onclick="viewOrderDetails(${order.id})" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" onclick="editOrder(${order.id})" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-danger" onclick="deleteOrder(${order.id})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function setupForm() {
    document.getElementById('order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveOrder();
    });
}

function saveOrder() {
    const id = document.getElementById('order-id').value;
    const code = document.getElementById('order-code').value.trim();
    const customerId = document.getElementById('order-customer').value;
    const date = document.getElementById('order-date').value;
    const status = document.getElementById('order-status').value;
    const total = document.getElementById('order-total').value;
    const payment = document.getElementById('order-payment').value;
    const note = document.getElementById('order-note').value.trim();
    
    if (!code || !customerId || !date || !total) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    // Lấy tên khách hàng và email
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customer = customers.find(c => c.id == customerId);
    const customerName = customer ? customer.name : '';
    const customerEmail = customer ? customer.email : '';
    
    let orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    
    if (id) {
        // Cập nhật đơn hàng hiện có
        const index = orders.findIndex(o => o.id == id);
        if (index !== -1) {
            const oldStatus = orders[index].status;
            const newStatus = status;
            
            const updatedOrder = {
                ...orders[index],
                id: parseInt(id),
                code,
                customerId: parseInt(customerId),
                customerName,
                customerEmail,  // Lưu email để không cần lookup lần sau
                date,
                status: newStatus,
                total: parseInt(total),
                payment,
                note
            };
            orders[index] = updatedOrder;
            
            // ===== ĐỒNG BỘ NGƯỢC VỀ USER =====
            if (customerEmail && oldStatus !== newStatus) {
                syncAdminOrderToUser(code, customerEmail, newStatus);
            }
            
            alert('Đã cập nhật đơn hàng!');
        }
    } else {
        // Tạo đơn hàng mới
        const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
        orders.push({
            id: newId,
            code,
            customerId: parseInt(customerId),
            customerName,
            customerEmail,  // Lưu email để không cần lookup lần sau
            date,
            status,
            total: parseInt(total),
            payment,
            note
        });
        alert('Đã thêm đơn hàng!');
    }
    
    localStorage.setItem('adminOrders', JSON.stringify(orders));
    resetForm();
    loadOrders();
}

// ===== HÀM ĐỒNG BỘ =====
// Đồng bộ từ admin sang user (admin thay đổi → user nhìn thấy)
function syncAdminOrderToUser(userOrderId, email, newStatus) {
    try {
        const userOrdersKey = `orders_${email}`;
        let userOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
        
        const userOrderIndex = userOrders.findIndex(o => o.id === userOrderId);
        if (userOrderIndex === -1) {
            console.warn(`User order with id ${userOrderId} not found for ${email}`);
            return;
        }
        
        // Cập nhật status
        userOrders[userOrderIndex].status = newStatus;
        if (newStatus === 'cancelled') {
            userOrders[userOrderIndex].cancelledDate = new Date().toISOString();
        }
        if (newStatus === 'delivered') {
            userOrders[userOrderIndex].deliveredDate = new Date().toISOString();
        }
        
        localStorage.setItem(userOrdersKey, JSON.stringify(userOrders));
        console.log(`User order ${userOrderId} synced: status=${newStatus}, email=${email}`);
    } catch (err) {
        console.error('Error syncing admin order to user:', err);
    }
}

function editOrder(id) {
    const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const order = orders.find(o => o.id == id);
    
    if (order) {
        document.getElementById('order-id').value = order.id;
        document.getElementById('order-code').value = order.code || '';
        document.getElementById('order-customer').value = order.customerId || 0;
        document.getElementById('order-date').value = order.date || '';
        document.getElementById('order-status').value = order.status || 'pending';
        document.getElementById('order-total').value = order.total || 0;
        document.getElementById('order-payment').value = order.payment || 'cod';
        document.getElementById('order-note').value = order.note || '';
        document.getElementById('form-title').textContent = 'Chỉnh sửa đơn hàng';
        document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteOrder(id) {
    if (!confirm('Xóa đơn hàng này?')) return;
    
    let orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const orderToDelete = orders.find(o => o.id == id);
    
    // Xóa khỏi adminOrders
    orders = orders.filter(o => o.id != id);
    localStorage.setItem('adminOrders', JSON.stringify(orders));
    
    // Nếu đơn hàng có code (mã đơn hàng), cũng xóa khỏi orders_${email}
    if (orderToDelete && orderToDelete.code) {
        const allKeys = Object.keys(localStorage);
        const userOrdersKeys = allKeys.filter(key => key.startsWith('orders_'));
        
        userOrdersKeys.forEach(key => {
            let userOrders = JSON.parse(localStorage.getItem(key) || '[]');
            userOrders = userOrders.filter(o => o.id !== orderToDelete.code);
            if (userOrders.length > 0) {
                localStorage.setItem(key, JSON.stringify(userOrders));
            } else {
                localStorage.removeItem(key);
            }
        });
    }
    
    alert('Đã xóa đơn hàng!');
    loadOrders();
}

function resetForm() {
    document.getElementById('order-form').reset();
    document.getElementById('order-id').value = '';
    document.getElementById('form-title').textContent = 'Thêm đơn hàng mới';
    document.getElementById('order-date').valueAsDate = new Date();
}

function setupFilter() {
    document.getElementById('filter-status').addEventListener('change', function() {
        const status = this.value;
        document.querySelectorAll('#order-list tr').forEach(row => {
            if (!status) {
                row.style.display = '';
                return;
            }
            const badge = row.querySelector('.badge');
            if (badge) {
                const hasStatus = badge.classList.contains(`badge-${status}`) ||
                                (status === 'shipping' && badge.classList.contains('badge-info'));
                row.style.display = hasStatus ? '' : 'none';
            }
        });
    });
}

function setupSearch() {
    document.getElementById('search-input').addEventListener('input', function() {
        const keyword = this.value.toLowerCase();
        document.querySelectorAll('#order-list tr').forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(keyword) || keyword === '' ? '' : 'none';
        });
    });
}

// Xem chi tiết đơn hàng
function viewOrderDetails(id) {
    const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const order = orders.find(o => o.id == id);
    
    if (!order) {
        alert('Không tìm thấy đơn hàng!');
        return;
    }
    
    let details = `=== CHI TIẾT ĐƠN HÀNG ===\n\n`;
    details += `Mã đơn: ${order.code || 'N/A'}\n`;
    details += `Khách hàng: ${order.customerName || 'N/A'}\n`;
    details += `Email: ${order.customerEmail || 'N/A'}\n`;
    details += `SĐT: ${order.customerPhone || 'N/A'}\n`;
    details += `Địa chỉ: ${order.customerAddress || 'N/A'}\n`;
    details += `Ngày đặt: ${order.date || 'N/A'}\n`;
    details += `Tổng tiền: ${parseInt(order.total || 0).toLocaleString('vi-VN')}₫\n`;
    details += `Trạng thái: ${order.status || 'pending'}\n`;
    details += `Thanh toán: ${order.payment || 'cod'}\n`;
    
    if (order.items && order.items.length > 0) {
        details += `\n=== SẢN PHẨM ===\n`;
        order.items.forEach((item, index) => {
            details += `${index + 1}. ${item.name} - SL: ${item.quantity} - Giá: ${item.price.toLocaleString('vi-VN')}₫\n`;
        });
    }
    
    if (order.note) {
        details += `\nGhi chú: ${order.note}`;
    }
    
    alert(details);
}

