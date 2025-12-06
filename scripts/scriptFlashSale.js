// Flash Sale Christmas Product Data and Handlers

// Flash Sale Products Data
const flashSaleProducts = {
    'fs-1': {
        id: 'fs-1',
        name: 'Bộ đồ chơi lego lắp ráp chủ đề Giáng Sinh',
        categoryId: 3,
        price: 200000,
        oldPrice: 250000,
        discount: -20,
        image: 'images/flash_sale_1.webp',
        sold: 20,
        progress: 20,
        stock: 100,
        description: 'Bộ đồ chơi lego cao cấp lắp ráp chủ đề Giáng Sinh, phù hợp cho trẻ em và người lớn. Gồm các mô hình trang trí Noel, cây thông, ông già Noel và nhiều chi tiết khác. Chất liệu an toàn, không độc hại.',
        category: 'Đồ chơi'
    },
    'fs-2': {
        id: 'fs-2',
        name: 'Set mô hình 5 Ông già Noel dễ thương',
        categoryId: 4,
        price: 140000,
        oldPrice: 200000,
        discount: -30,
        image: 'images/flash_sale_2.webp',
        sold: 25,
        progress: 25,
        stock: 100,
        description: 'Set 5 mô hình ông già Noel dễ thương với các biểu cảm khác nhau. Chất liệu PVC cao cấp, màu sắc sáng, độc đáo. Dùng để trang trí nhà cửa, cửa hàng, bàn làm việc.',
        category: 'Trang trí'
    },
    'fs-3': {
        id: 'fs-3',
        name: 'Cốc ly hình cây thông Giáng Sinh 3D',
        categoryId: 5,
        price: 160000,
        oldPrice: 200000,
        discount: -20,
        image: 'images/flash_sale_3.webp',
        sold: 35,
        progress: 35,
        stock: 100,
        description: 'Cốc ly hình cây thông Giáng Sinh 3D với thiết kế độc đáo, nắp và khay giữ. Chất liệu sứ cao cấp, in hình đẹp mắt, không độc hại. Phù hợp làm quà tặng.',
        category: 'Cốc tách'
    },
    'fs-4': {
        id: 'fs-4',
        name: 'Cốc ly sứ Christmas hộp quà tặng ngôi sao',
        categoryId: 5,
        price: 200000,
        oldPrice: 300000,
        discount: -33,
        image: 'images/flash_sale_4.webp',
        sold: 18,
        progress: 18,
        stock: 100,
        description: 'Cốc ly sứ cao cấp với họa tiết Christmas ngôi sao lấp lánh. Đi kèm hộp quà đẹp, in logo nhãn hiệu. Dùng đựng nước, cà phê, trà, là quà tặng tuyệt vời.',
        category: 'Cốc tách'
    },
    'fs-5': {
        id: 'fs-5',
        name: 'Đèn LED trang trí cây thông Giáng Sinh',
        categoryId: 4,
        price: 150000,
        oldPrice: 200000,
        discount: -25,
        image: 'images/flash_sale_5.webp',
        sold: 32,
        progress: 32,
        stock: 100,
        description: 'Đèn LED trang trí cây thông Giáng Sinh với 100 bóng LED sáng đa màu, dây dài 10m. Tiết kiệm điện, sáng lâu, an toàn tuyệt đối. Chế độ nhấp nháy tự động.',
        category: 'Trang trí'
    },
    'fs-6': {
        id: 'fs-6',
        name: 'Set hộp quà trang trí Noel cao cấp',
        categoryId: 6,
        price: 180000,
        oldPrice: 300000,
        discount: -40,
        image: 'images/flash_sale_6.webp',
        sold: 28,
        progress: 28,
        stock: 100,
        description: 'Set 3 hộp quà trang trí Noel cao cấp với họa tiết đặc biệt, màu sắc rực rỡ. Chất liệu carton dày, bền bỉ. Dùng đựng quà tặng hoặc trang trí nhà cửa.',
        category: 'Hộp quà'
    },
    'fs-7': {
        id: 'fs-7',
        name: 'Tất treo Giáng Sinh họa tiết đáng yêu',
        categoryId: 4,
        price: 85000,
        oldPrice: 100000,
        discount: -15,
        image: 'images/flash_sale_7.webp',
        sold: 42,
        progress: 42,
        stock: 100,
        description: 'Tất treo Giáng Sinh họa tiết đáng yêu với màu đỏ, xanh, trắng. Chất liệu cotton mềm mại, ấm áp. Treo trên cây thông, tường, cửa sổ để trang trí.',
        category: 'Trang trí'
    },
    'fs-8': {
        id: 'fs-8',
        name: 'Set chuông vàng trang trí Giáng Sinh',
        categoryId: 4,
        price: 130000,
        oldPrice: 200000,
        discount: -35,
        image: 'images/flash_sale_8.webp',
        sold: 31,
        progress: 31,
        stock: 100,
        description: 'Set 5 chuông vàng trang trí Giáng Sinh với âm thanh rung chuông dễ nghe. Chất liệu kim loại cao cấp, bền bỉ, sáng bóng. Treo trên cây thông hoặc tường.',
        category: 'Trang trí'
    }
};

// Khởi tạo Flash Sale Products vào localStorage
// NOTE: Khởi tạo đã được thực hiện ở scriptIndex.js, hàm này KHÔNG dùng
// function khoiTaoFlashSaleProducts() {
//     // Lấy danh sách sản phẩm hiện tại
//     let products = JSON.parse(localStorage.getItem('products')) || [];
//     
//     // Kiểm tra xem Flash Sale products đã có trong localStorage chưa
//     const flashSaleExists = products.some(p => String(p.id) === 'fs-1');
//     
//     // Nếu chưa có, thêm vào. Nếu có rồi, không thêm lại
//     if (!flashSaleExists) {
//         Object.values(flashSaleProducts).forEach(product => {
//             products.push(product);
//         });
//         
//         // Lưu vào localStorage
//         localStorage.setItem('products', JSON.stringify(products));
//     }
// }

// Xử lý khi bấm nút "Thêm vào giỏ" cho Flash Sale
document.addEventListener('DOMContentLoaded', function() {
    // khoiTaoFlashSaleProducts(); // Đã được khởi tạo ở scriptIndex.js, không cần gọi lại ở đây
    
    // Gán sự kiện cho tất cả nút "Thêm vào giỏ" trong Flash Sale
    const addToCartButtons = document.querySelectorAll('#flash-sale-christmas .fs-add-to-cart-btn');
    
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Lấy product ID từ button attribute
            const flashSaleId = this.getAttribute('data-product-id');
            
            if (flashSaleId) {
                // Lấy sản phẩm từ localStorage thay vì từ object cứng
                const products = JSON.parse(localStorage.getItem('products') || '[]');
                
                const product = products.find(p => String(p.id) === String(flashSaleId));
                
                if (product) {
                    // Thêm vào giỏ
                    addToCart(product);
                }
            }
        });
    });
});

// Hàm thêm sản phẩm vào giỏ
function addToCart(product) {
    const stock = parseInt(product.stock) || 0;
    
    if (stock === 0) {
        alert('Sản phẩm đã hết hàng! Không thể thêm vào giỏ hàng.');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => String(item.id) === String(product.id));
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > stock) {
            alert(`Tồn kho không đủ! Chỉ còn ${stock} sản phẩm.`);
            return;
        }
        existingItem.quantity = newQuantity;
    } else {
        if (1 > stock) {
            alert(`Tồn kho không đủ! Chỉ còn ${stock} sản phẩm.`);
            return;
        }
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} đã được thêm vào giỏ hàng!`);
}
