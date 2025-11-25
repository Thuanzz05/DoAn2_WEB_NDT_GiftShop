document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập trước khi cho phép checkout
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
        alert('Vui lòng đăng nhập để đặt hàng!');
        // Lưu URL hiện tại để redirect về sau khi đăng nhập
        localStorage.setItem('redirectAfterLogin', 'checkout.html');
        window.location.href = 'login-register.html';
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length > 0) {
        updateOrderSummary(cart);     // Hiển thị thông tin đơn hàng ở phần checkout nếu có sản phẩm
        // Tự động điền thông tin từ tài khoản
        prefillUserInfo(userData);
    } else {
        alert('Giỏ hàng của bạn đang trống!');
        window.location.href = 'cart.html';
    }

    // Xử lý sự kiện submit form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) {             // Kiểm tra thông tin form
                processOrder(); // Xử lý đặt hàng
            }
        });
    }
});

// Tự động điền thông tin user vào form
function prefillUserInfo(userData) {
    if (userData.name) {
        document.getElementById('fullname').value = userData.name;
    }
    if (userData.email) {
        document.getElementById('email').value = userData.email;
    }
    if (userData.phone) {
        document.getElementById('phone').value = userData.phone;
    }
    if (userData.address) {
        document.getElementById('street').value = userData.address;
    }
}

// Cập nhật thông tin đơn hàng hiển thị
function updateOrderSummary(cart) {
    const productSummary = document.querySelector('.product-summary');
    if (!productSummary) return;
    
    productSummary.innerHTML = '';     // Xóa nội dung hiện tại
    
    let subtotal = 0;    // Tổng tiền tạm tính
    
    // Thêm từng sản phẩm vào phần tóm tắt đơn hàng
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;         // Tính tổng giá trị của mỗi sản phẩm
        subtotal += itemTotal;
        
        // Tạo HTML cho mỗi sản phẩm
        const productItemHTML = `
            <div class="product-item">
                <div class="product-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="product-details">
                    <h3>${item.name}</h3>
                    <p class="variant">Màu sắc: ${item.variant || 'Mặc định'}</p>
                    <p class="quantity">Số lượng: ${item.quantity}</p>
                    <p class="price">${item.price.toLocaleString()}₫</p>
                </div>
            </div>
        `;
        productSummary.innerHTML += productItemHTML;       
    });
    
    const shipping = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shipping;     // Tổng cộng
    
    // Cập nhật thông tin giá
    const priceSummary = document.querySelector('.price-summary');
    if (priceSummary) {
        priceSummary.innerHTML = `
            <div class="price-row">
                <span>Tạm tính</span>
                <span>${subtotal.toLocaleString()}₫</span>
            </div>
            <div class="price-row">
                <span>Phí vận chuyển</span>
                <span>${shipping.toLocaleString()}₫</span>
            </div>
            <div class="price-row total">
                <span>Tổng cộng</span>
                <span>${total.toLocaleString()}₫</span>
            </div>
        `;
    }
}

// Kiểm tra thông tin form
function validateForm() {
    const fullname = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const province = document.getElementById('province').value;
    const district = document.getElementById('district').value;
    const ward = document.getElementById('ward').value;
    const street = document.getElementById('street').value.trim();
    const chkAgree = document.getElementById('chkAgree').checked;

    // Validate các trường bắt buộc
    if (!fullname) {
        alert('Vui lòng nhập họ tên người nhận!');
        return false;
    }

    if (!phone) {
        alert('Vui lòng nhập số điện thoại!');
        return false;
    }

    // Validate định dạng số điện thoại
    const phoneRegex = /0\d{9}/;
    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại không hợp lệ! Vui lòng nhập theo định dạng 0xxxxxxxxx');
        return false;
    }

    if (!province || !district || !ward) {
        alert('Vui lòng chọn đầy đủ địa chỉ (tỉnh, huyện, xã)!');
        return false;
    }

    if (!street) {
        alert('Vui lòng nhập số nhà, tên đường!');
        return false;
    }

    if (!chkAgree) {
        alert('Vui lòng đồng ý với chính sách giao hàng!');
        return false;
    }

    return true;
}

// Xử lý đặt hàng
function processOrder() {
    // Lấy thông tin từ form
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const province = document.getElementById('province').value;
    const district = document.getElementById('district').value;
    const ward = document.getElementById('ward').value;
    const street = document.getElementById('street').value.trim();
    const note = document.getElementById('note').value.trim();
    
    // Lấy phương thức thanh toán
    const paymentMethod = document.querySelector('input[name="payment"]:checked').id;
    
    // Lấy giỏ hàng
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }

    // Tính tổng tiền
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    const shipping = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shipping;

    // Lấy thông tin user đang đăng nhập
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    // Tạo đơn hàng mới
    const newOrder = {
        id: generateOrderId(),
        userId: userData ? userData.email : 'guest',
        customerInfo: {
            fullname: fullname,
            email: email,
            phone: phone,
            address: `${street}, ${ward}, ${district}, ${province}`
        },
        items: cart,
        totalPrice: total,
        shippingFee: shipping,
        paymentMethod: paymentMethod,
        note: note,
        status: 'pending',
        orderDate: new Date().toISOString(),
        joinDate: new Date().toISOString().split('T')[0]
    };

    // Lưu đơn hàng vào localStorage
    saveOrder(newOrder);
    
    // Xóa giỏ hàng sau khi đặt hàng thành công
    localStorage.removeItem('cart');
    
    // Hiển thị thông báo thành công
    alert('Đặt hàng thành công! Đơn hàng của bạn sẽ được xử lý sớm nhất.');
    
    // Chuyển hướng về trang chủ hoặc trang tài khoản
    if (userData) {
        window.location.href = 'account.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Tạo ID đơn hàng ngẫu nhiên
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `DH${timestamp}${random}`;
}

// Tạo ID số cho admin (từ timestamp)
function generateAdminId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Lưu đơn hàng vào localStorage
function saveOrder(order) {
    // Lấy danh sách đơn hàng hiện tại
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Thêm đơn hàng mới
    orders.push(order);
    
    // Lưu lại
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Nếu user đang đăng nhập, thêm vào đơn hàng của user đó
    if (order.userId !== 'guest') {
        let userOrders = JSON.parse(localStorage.getItem(`orders_${order.userId}`)) || [];
        userOrders.push(order);
        localStorage.setItem(`orders_${order.userId}`, JSON.stringify(userOrders));
    }
    
    // Đồng bộ với admin orders
    syncOrderToAdmin(order);
}

// Đồng bộ đơn hàng với admin
function syncOrderToAdmin(order) {
    let adminOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const adminOrder = {
        id: generateAdminId(), // Tạo ID số duy nhất cho admin
        code: order.id, // Giữ mã đơn hàng đầy đủ DHxxxx
        customerId: order.userId !== 'guest' ? 1 : 0, // Tạm thời set customerId = 1 cho user đã đăng nhập
        customerName: order.customerInfo.fullname,
        customerEmail: order.customerInfo.email,
        customerPhone: order.customerInfo.phone,
        customerAddress: order.customerInfo.address,
        items: order.items,
        total: order.totalPrice,
        payment: order.paymentMethod,
        status: order.status,
        date: new Date(order.orderDate).toISOString().split('T')[0], // Format YYYY-MM-DD
        note: order.note
    };
    
    adminOrders.push(adminOrder);
    localStorage.setItem('orders', JSON.stringify(adminOrders));
}

