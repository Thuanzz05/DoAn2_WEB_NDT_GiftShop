document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Lấy các phần tử DOM
    const cartEmptyMessage = document.querySelector('.cart-empty');
    const cartHasItemsMessage = document.querySelector('.cart-has-items');
    
    // Kiểm tra nếu giỏ hàng trống
    if (cart.length === 0) {
        if (cartEmptyMessage) cartEmptyMessage.style.display = 'block';
        if (cartHasItemsMessage) cartHasItemsMessage.style.display = 'none';
    } else {
        if (cartEmptyMessage) cartEmptyMessage.style.display = 'none';
        if (cartHasItemsMessage) cartHasItemsMessage.style.display = 'block';
        updateCartDisplay();
    }
    
    // Sự kiện cập nhật giỏ hàng
    const updateCartButton = document.querySelector('.cart-update');
    if (updateCartButton) {
        updateCartButton.addEventListener('click', () => {
            updateCartDisplay();
            alert('Giỏ hàng đã được cập nhật!');
        });
    }
    
    // Sự kiện áp dụng mã giảm giá
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
});

// Cập nhật giao diện giỏ hàng
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.querySelector('.cart-table tbody');
    
    if (!cartTableBody) return;
    
    cartTableBody.innerHTML = '';
    
    // Thêm từng sản phẩm vào bảng giỏ hàng
    cart.forEach((item, index) => {
        // Đảm bảo price và quantity là số hợp lệ
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        const subtotal = price * quantity;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="cart-product" data-label="Sản phẩm">
                <div class="cart-product-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-product-name"><a href="#">${item.name}</a></div>
            </td>
            <td class="cart-price" data-label="Giá">${price.toLocaleString()}₫</td>
            <td class="cart-quantity" data-label="Số lượng">
                <button class="quantity-btn" onclick="updateQuantity(${index}, ${quantity - 1})">-</button>
                <input type="number" value="${quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                <button class="quantity-btn" onclick="updateQuantity(${index}, ${quantity + 1})">+</button>
            </td>
            <td class="cart-subtotal" data-label="Tổng">${subtotal.toLocaleString()}₫</td>
            <td class="cart-remove" data-label="Xóa">
                <button onclick="removeItem(${index})">Xóa</button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });
    updateCartSummary();
}

// Cập nhật số lượng sản phẩm
function updateQuantity(index, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    quantity = parseInt(quantity); 
    if (isNaN(quantity) || quantity < 1) quantity = 1;     // Kiểm tra và xác nhận giá trị nhập vào
    
    // Kiểm tra tồn kho
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const currentProduct = products.find(p => String(p.id) === String(cart[index].id));
    const stock = currentProduct ? parseInt(currentProduct.stock) || 0 : 0;
    
    if (quantity > stock) {
        alert(`Tồn kho không đủ! Chỉ còn ${stock} sản phẩm.`);
        // Đặt lại số lượng bằng stock hiện tại
        cart[index].quantity = Math.min(cart[index].quantity, stock);
        if (cart[index].quantity === 0) {
            cart.splice(index, 1);
        }
    } else {
        cart[index].quantity = quantity;     // Cập nhật số lượng sản phẩm trong giỏ hàng
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));     // Lưu lại giỏ hàng vào localStorage
    updateCartDisplay();
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart.splice(index, 1);     // Xóa sản phẩm khỏi giỏ hàng
    
    localStorage.setItem('cart', JSON.stringify(cart));     
    
    // Kiểm tra nếu giỏ hàng trống
    if (cart.length === 0) {
        const cartEmptyMessage = document.querySelector('.cart-empty');
        const cartHasItemsMessage = document.querySelector('.cart-has-items');
        
        if (cartEmptyMessage) cartEmptyMessage.style.display = 'block';
        if (cartHasItemsMessage) cartHasItemsMessage.style.display = 'none';
    } else {
        updateCartDisplay();
    }
}

//cập nhật tổng tiền
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const shipping = subtotal >= 500000 ? 0 : 30000;
    const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon')) || null;
    const discount = calculateDiscount(subtotal, appliedCoupon);
    
    const total = subtotal - discount + shipping;
    
    //cập nhật 
    const subtotalElement = document.getElementById('subtotal');
    const discountRow = document.getElementById('discount-row');
    const discountElement = document.getElementById('discount-amount');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = subtotal.toLocaleString() + '₫';
    if (shippingElement) shippingElement.textContent = shipping.toLocaleString() + '₫';
    if (totalElement) totalElement.textContent = total.toLocaleString() + '₫';
    
    // Hiển thị/ẩn dòng giảm giá
    if (discount > 0) {
        if (discountRow) discountRow.style.display = '';
        if (discountElement) discountElement.textContent = '-' + discount.toLocaleString() + '₫';
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }
}

// Áp dụng mã giảm giá
function applyCoupon() {
    const couponCode = document.getElementById('coupon-code').value.trim().toUpperCase();
    const messageElement = document.getElementById('coupon-message');
    
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
        updateCartDisplay();
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
            updateCartDisplay();
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
    
    updateCartDisplay();
}

// Tính giảm giá
function calculateDiscount(subtotal, coupon) {
    if (!coupon) return 0;
    
    let discount = 0;
    if (coupon.type === 'percent') {
        discount = Math.floor(subtotal * coupon.value / 100);
    } else if (coupon.type === 'amount') {
        discount = coupon.value;
    }
    
    return Math.min(discount, subtotal);
}
