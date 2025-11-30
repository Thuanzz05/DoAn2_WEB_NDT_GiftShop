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
    
    // Sự kiện áp dụng mã giảm giá
    const applyCheckoutCouponBtn = document.getElementById('checkout-apply-coupon');
    if (applyCheckoutCouponBtn) {
        applyCheckoutCouponBtn.addEventListener('click', applyCheckoutCoupon);
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
    
    // Tính giảm giá từ mã đã áp dụng
    const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon')) || null;
    let discount = 0;
    
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') {
            discount = Math.floor(subtotal * appliedCoupon.value / 100);
        } else if (appliedCoupon.type === 'amount') {
            discount = appliedCoupon.value;
        }
        discount = Math.min(discount, subtotal);
    }
    
    const total = subtotal - discount + shipping;     // Tổng cộng
    
    // Cập nhật thông tin giá
    const priceSummary = document.querySelector('.price-summary');
    if (priceSummary) {
        let priceHTML = `
            <div class="price-row">
                <span>Tạm tính</span>
                <span>${subtotal.toLocaleString()}₫</span>
            </div>`;
        
        if (discount > 0) {
            priceHTML += `
            <div class="price-row" style="color: #4caf50;">
                <span>Giảm giá</span>
                <span>-${discount.toLocaleString()}₫</span>
            </div>`;
        }
        
        priceHTML += `
            <div class="price-row">
                <span>Phí vận chuyển</span>
                <span>${shipping.toLocaleString()}₫</span>
            </div>
            <div class="price-row total">
                <span>Tổng cộng</span>
                <span>${total.toLocaleString()}₫</span>
            </div>`;
        
        priceSummary.innerHTML = priceHTML;
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
    
    // Tính giảm giá từ mã đã áp dụng
    const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon')) || null;
    let discount = 0;
    
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') {
            discount = Math.floor(subtotal * appliedCoupon.value / 100);
        } else if (appliedCoupon.type === 'amount') {
            discount = appliedCoupon.value;
        }
        discount = Math.min(discount, subtotal);
    }
    
    const total = subtotal - discount + shipping;

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
        subtotal: subtotal,
        discount: discount,
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
    
    // Xóa giỏ hàng và mã giảm giá sau khi đặt hàng thành công
    localStorage.removeItem('cart');
    localStorage.removeItem('appliedCoupon');
    
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
    // Lưu vào mảng user orders
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Nếu user đang đăng nhập, thêm vào đơn hàng của user đó
    if (order.userId !== 'guest') {
        let userOrders = JSON.parse(localStorage.getItem(`orders_${order.userId}`)) || [];
        userOrders.push(order);
        localStorage.setItem(`orders_${order.userId}`, JSON.stringify(userOrders));
    }
    
    // Đồng bộ với admin orders (lưu vào mảng riêng)
    syncOrderToAdmin(order);
}

// Đồng bộ đơn hàng với admin (lưu vào adminOrders riêng)
function syncOrderToAdmin(order) {
    let adminOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
    
    const adminOrder = {
        id: generateAdminId(),
        code: order.id,
        customerId: order.userId !== 'guest' ? 1 : 0,
        customerName: order.customerInfo.fullname,
        customerEmail: order.customerInfo.email,  // QUAN TRỌNG: Lưu email để sync sau này
        customerPhone: order.customerInfo.phone,
        customerAddress: order.customerInfo.address,
        items: order.items,
        total: order.totalPrice,
        payment: order.paymentMethod,
        status: order.status,
        date: new Date(order.orderDate).toISOString().split('T')[0],
        note: order.note
    };
    
    adminOrders.push(adminOrder);
    localStorage.setItem('adminOrders', JSON.stringify(adminOrders));
}

// Áp dụng mã giảm giá ở trang checkout
function applyCheckoutCoupon() {
    const couponCode = document.getElementById('checkout-coupon-code').value.trim().toUpperCase();
    const messageElement = document.getElementById('checkout-coupon-message');
    
    if (!couponCode) {
        if (messageElement) messageElement.textContent = 'Vui lòng nhập mã giảm giá';
        return;
    }
    
    // Lấy danh sách mã giảm giá từ admin
    const promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
    const coupon = promotions.find(p => p.code.toUpperCase() === couponCode);
    
    if (!coupon) {
        if (messageElement) messageElement.textContent = 'Mã giảm giá không hợp lệ hoặc đã hết hạn!';
        messageElement.style.color = '#d32f2f';
        localStorage.removeItem('appliedCoupon');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateOrderSummary(cart);
        return;
    }
    
    // Kiểm tra ngày hết hạn
    if (coupon.endDate) {
        const expiry = new Date(coupon.endDate);
        const today = new Date();
        if (today > expiry) {
            if (messageElement) messageElement.textContent = 'Mã giảm giá đã hết hạn!';
            messageElement.style.color = '#d32f2f';
            localStorage.removeItem('appliedCoupon');
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            updateOrderSummary(cart);
            return;
        }
    }
    
    // Lưu mã giảm giá đã áp dụng
    localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    
    let discountText = '';
    if (coupon.type === 'percent') {
        discountText = `Giảm ${coupon.value}%`;
    } else if (coupon.type === 'amount') {
        discountText = `Giảm ${coupon.value.toLocaleString()}₫`;
    }
    
    if (messageElement) messageElement.textContent = `Áp dụng thành công: ${discountText}`;
    messageElement.style.color = '#4caf50';
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateOrderSummary(cart);
}