// Flash Sale Christmas Product Data and Handlers

// Flash Sale Products Data
const flashSaleProducts = {
    'fs-1': {
        id: 'fs-1',
        name: 'Bộ đồ chơi lego lắp ráp chủ đề Giáng Sinh',
        price: 200000,
        oldPrice: 250000,
        discount: -20,
        image: 'images/flash_sale_1.webp',
        sold: 205,
        progress: 82,
        description: 'Bộ đồ chơi lego cao cấp lắp ráp chủ đề Giáng Sinh, phù hợp cho trẻ em và người lớn. Gồm các mô hình trang trí Noel, cây thông, ông già Noel và nhiều chi tiết khác. Chất liệu an toàn, không độc hại.',
        category: 'Đồ chơi'
    },
    'fs-2': {
        id: 'fs-2',
        name: 'Set mô hình 5 Ông già Noel dễ thương',
        price: 140000,
        oldPrice: 200000,
        discount: -30,
        image: 'images/flash_sale_2.webp',
        sold: 55,
        progress: 55,
        description: 'Set 5 mô hình ông già Noel dễ thương với các biểu cảm khác nhau. Chất liệu PVC cao cấp, màu sắc sáng, độc đáo. Dùng để trang trí nhà cửa, cửa hàng, bàn làm việc.',
        category: 'Trang trí'
    },
    'fs-3': {
        id: 'fs-3',
        name: 'Cốc ly hình cây thông Giáng Sinh 3D',
        price: 160000,
        oldPrice: 200000,
        discount: -20,
        image: 'images/flash_sale_3.webp',
        sold: 90,
        progress: 72,
        description: 'Cốc ly hình cây thông Giáng Sinh 3D với thiết kế độc đáo, nắp và khay giữ. Chất liệu sứ cao cấp, in hình đẹp mắt, không độc hại. Phù hợp làm quà tặng.',
        category: 'Cốc tách'
    },
    'fs-4': {
        id: 'fs-4',
        name: 'Cốc ly sứ Christmas hộp quà tặng ngôi sao',
        price: 200000,
        oldPrice: 300000,
        discount: -33,
        image: 'images/flash_sale_4.webp',
        sold: 52,
        progress: 52,
        description: 'Cốc ly sứ cao cấp với họa tiết Christmas ngôi sao lấp lánh. Đi kèm hộp quà đẹp, in logo nhãn hiệu. Dùng đựng nước, cà phê, trà, là quà tặng tuyệt vời.',
        category: 'Cốc tách'
    },
    'fs-5': {
        id: 'fs-5',
        name: 'Đèn LED trang trí cây thông Giáng Sinh',
        price: 150000,
        oldPrice: 200000,
        discount: -25,
        image: 'images/flash_sale_5.webp',
        sold: 85,
        progress: 68,
        description: 'Đèn LED trang trí cây thông Giáng Sinh với 100 bóng LED sáng đa màu, dây dài 10m. Tiết kiệm điện, sáng lâu, an toàn tuyệt đối. Chế độ nhấp nháy tự động.',
        category: 'Trang trí'
    },
    'fs-6': {
        id: 'fs-6',
        name: 'Set hộp quà trang trí Noel cao cấp',
        price: 180000,
        oldPrice: 300000,
        discount: -40,
        image: 'images/flash_sale_6.webp',
        sold: 45,
        progress: 45,
        description: 'Set 3 hộp quà trang trí Noel cao cấp với họa tiết đặc biệt, màu sắc rực rỡ. Chất liệu carton dày, bền bỉ. Dùng đựng quà tặng hoặc trang trí nhà cửa.',
        category: 'Hộp quà'
    },
    'fs-7': {
        id: 'fs-7',
        name: 'Tất treo Giáng Sinh họa tiết đáng yêu',
        price: 85000,
        oldPrice: 100000,
        discount: -15,
        image: 'images/flash_sale_7.webp',
        sold: 95,
        progress: 76,
        description: 'Tất treo Giáng Sinh họa tiết đáng yêu với màu đỏ, xanh, trắng. Chất liệu cotton mềm mại, ấm áp. Treo trên cây thông, tường, cửa sổ để trang trí.',
        category: 'Trang trí'
    },
    'fs-8': {
        id: 'fs-8',
        name: 'Set chuông vàng trang trí Giáng Sinh',
        price: 130000,
        oldPrice: 200000,
        discount: -35,
        image: 'images/flash_sale_8.webp',
        sold: 60,
        progress: 60,
        description: 'Set 5 chuông vàng trang trí Giáng Sinh với âm thanh rung chuông dễ nghe. Chất liệu kim loại cao cấp, bền bỉ, sáng bóng. Treo trên cây thông hoặc tường.',
        category: 'Trang trí'
    }
};

// Khởi tạo Flash Sale Products vào localStorage
function khoiTaoFlashSaleProducts() {
    // Lấy danh sách sản phẩm hiện tại
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Xóa Flash Sale products cũ (nếu có) để update lại
    products = products.filter(p => !p.id || (typeof p.id !== 'string' || !p.id.startsWith('fs-')));
    
    // Thêm tất cả flash sale products mới
    Object.values(flashSaleProducts).forEach(product => {
        products.push(product);
    });
    
    // Lưu vào localStorage
    localStorage.setItem('products', JSON.stringify(products));
}

// Xử lý khi bấm nút "Thêm vào giỏ" cho Flash Sale
document.addEventListener('DOMContentLoaded', function() {
    khoiTaoFlashSaleProducts();
    
    // Gán sự kiện cho tất cả nút "Thêm vào giỏ" trong Flash Sale
    const addToCartButtons = document.querySelectorAll('#flash-sale-christmas .fs-add-to-cart-btn');
    
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Tìm card chứa button này
            const card = button.closest('.fs-product-card');
            const flashSaleId = card.getAttribute('data-flash-sale-id');
            
            if (flashSaleId) {
                const product = flashSaleProducts[flashSaleId];
                
                if (product) {
                    // Thêm vào giỏ
                    addToCart(product);
                    
                    // Hiển thị thông báo
                    showNotification('Đã thêm "' + product.name + '" vào giỏ hàng!');
                }
            }
        });
    });
});

// Hàm thêm sản phẩm vào giỏ
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Hàm hiển thị thông báo (notification)
function showNotification(message) {
    // Tạo phần tử thông báo nếu chưa tồn tại
    let notification = document.getElementById('notification-toast');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification-toast';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-size: 14px;
            max-width: 350px;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}
