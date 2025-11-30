// Khai báo biến global productData
let productData = {};

// Flash Sale Products Data (để sẵn sàng nếu cần)
const flashSaleProductsData = {
    'fs-1': { id: 'fs-1', name: 'Bộ đồ chơi lego lắp ráp chủ đề Giáng Sinh', price: 200000, oldPrice: 250000, discount: -20, image: 'images/flash_sale_1.webp', sold: 205, progress: 82, description: 'Bộ đồ chơi lego cao cấp lắp ráp chủ đề Giáng Sinh, phù hợp cho trẻ em và người lớn. Gồm các mô hình trang trí Noel, cây thông, ông già Noel và nhiều chi tiết khác. Chất liệu an toàn, không độc hại.', category: 'Đồ chơi' },
    'fs-2': { id: 'fs-2', name: 'Set mô hình 5 Ông già Noel dễ thương', price: 140000, oldPrice: 200000, discount: -30, image: 'images/flash_sale_2.webp', sold: 55, progress: 55, description: 'Set 5 mô hình ông già Noel dễ thương với các biểu cảm khác nhau. Chất liệu PVC cao cấp, màu sắc sáng, độc đáo. Dùng để trang trí nhà cửa, cửa hàng, bàn làm việc.', category: 'Trang trí' },
    'fs-3': { id: 'fs-3', name: 'Cốc ly hình cây thông Giáng Sinh 3D', price: 160000, oldPrice: 200000, discount: -20, image: 'images/flash_sale_3.webp', sold: 90, progress: 72, description: 'Cốc ly hình cây thông Giáng Sinh 3D với thiết kế độc đáo, nắp và khay giữ. Chất liệu sứ cao cấp, in hình đẹp mắt, không độc hại. Phù hợp làm quà tặng.', category: 'Cốc tách' },
    'fs-4': { id: 'fs-4', name: 'Cốc ly sứ Christmas hộp quà tặng ngôi sao', price: 200000, oldPrice: 300000, discount: -33, image: 'images/flash_sale_4.webp', sold: 52, progress: 52, description: 'Cốc ly sứ cao cấp với họa tiết Christmas ngôi sao lấp lánh. Đi kèm hộp quà đẹp, in logo nhãn hiệu. Dùng đựng nước, cà phê, trà, là quà tặng tuyệt vời.', category: 'Cốc tách' },
    'fs-5': { id: 'fs-5', name: 'Đèn LED trang trí cây thông Giáng Sinh', price: 150000, oldPrice: 200000, discount: -25, image: 'images/flash_sale_5.webp', sold: 85, progress: 68, description: 'Đèn LED trang trí cây thông Giáng Sinh với 100 bóng LED sáng đa màu, dây dài 10m. Tiết kiệm điện, sáng lâu, an toàn tuyệt đối. Chế độ nhấp nháy tự động.', category: 'Trang trí' },
    'fs-6': { id: 'fs-6', name: 'Set hộp quà trang trí Noel cao cấp', price: 180000, oldPrice: 300000, discount: -40, image: 'images/flash_sale_6.webp', sold: 45, progress: 45, description: 'Set 3 hộp quà trang trí Noel cao cấp với họa tiết đặc biệt, màu sắc rực rỡ. Chất liệu carton dày, bền bỉ. Dùng đựng quà tặng hoặc trang trí nhà cửa.', category: 'Hộp quà' },
    'fs-7': { id: 'fs-7', name: 'Tất treo Giáng Sinh họa tiết đáng yêu', price: 85000, oldPrice: 100000, discount: -15, image: 'images/flash_sale_7.webp', sold: 95, progress: 76, description: 'Tất treo Giáng Sinh họa tiết đáng yêu với màu đỏ, xanh, trắng. Chất liệu cotton mềm mại, ấm áp. Treo trên cây thông, tường, cửa sổ để trang trí.', category: 'Trang trí' },
    'fs-8': { id: 'fs-8', name: 'Set chuông vàng trang trí Giáng Sinh', price: 130000, oldPrice: 200000, discount: -35, image: 'images/flash_sale_8.webp', sold: 60, progress: 60, description: 'Set 5 chuông vàng trang trí Giáng Sinh với âm thanh rung chuông dễ nghe. Chất liệu kim loại cao cấp, bền bỉ, sáng bóng. Treo trên cây thông hoặc tường.', category: 'Trang trí' }
};

// Hàm khởi tạo Flash Sale products vào localStorage nếu chưa có
function ensureFlashSaleProductsInStorage() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Kiểm tra xem Flash Sale products đã có trong localStorage chưa
    const flashSaleExists = products.some(p => p.id && typeof p.id === 'string' && p.id.startsWith('fs-'));
    
    if (!flashSaleExists) {
        // Thêm các Flash Sale products vào localStorage
        Object.values(flashSaleProductsData).forEach(product => {
            products.push(product);
        });
        localStorage.setItem('products', JSON.stringify(products));
    }
}

// Hàm khởi tạo demo products (100-117) nếu chưa có
function ensureDemoProductsInStorage() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Kiểm tra xem demo products đã có không
    const demoExists = products.some(p => p.id >= 100 && p.id <= 117);
    
    if (!demoExists) {
        // Khởi tạo demo products
        const demoProducts = [
            // SẢN PHẨM BÁN CHẠY (ID 100-107)
            { id: 100, name: 'Set 4 mô hình em bé hổ tài lộc lắc đầu biểu cảm', price: 180000, image: 'images/product1.webp', category: 'Trang trí', description: 'Set 4 mô hình em bé hổ tài lộc lắc đầu biểu cảm dễ thương nhiều màu sắc trang trí nhà cửa, bàn làm việc. Sản phẩm làm từ chất liệu nhựa cao cấp, bền đẹp theo thời gian.' },
            { id: 101, name: 'Mô hình tượng Shin bút chì cosplay Phật Tổ', price: 300000, oldPrice: 430000, image: 'images/product2.webp', category: 'Trang trí', description: 'Mô hình tượng Shin bút chì cosplay Phật Tổ vô cùng độc đáo và dễ thương. Sản phẩm làm từ chất liệu cao cấp, màu sắc tươi sáng.' },
            { id: 102, name: 'Set 6 mô hình lợn hồng heo hồng đế bàn mini', price: 70000, oldPrice: 100000, image: 'images/product3.webp', category: 'Trang trí', description: 'Set 6 mô hình lợn hồng heo hồng đế bàn mini dễ thương. Thiết kế nhỏ gọn, vừa vặn trên bàn làm việc hoặc bàn học.' },
            { id: 103, name: 'Mô hình mông Silicon Gấu Thỏ Chó Heo Rắp đồ chơi', price: 75000, oldPrice: 150000, image: 'images/product4.webp', category: 'Đồ chơi', description: 'Mô hình mông Silicon Gấu Thỏ Chó Heo Rắp đồ chơi. Chất liệu silicone mềm mại, an toàn cho trẻ em. Hình dáng dễ thương, sinh động.' },
            { id: 104, name: 'Tượng mèo thần tài trắng khăn xanh', price: 130000, image: 'images/product5.webp', category: 'Trang trí', description: 'Tượng mèo thần tài trắng khăn xanh may mắn. Hình tượng truyền thống, mang lại may mắn và tài lộc. Thiết kế tinh tế, phù hợp để trang trí.' },
            { id: 105, name: 'Mô hình Blind Box mèo Xiêm Thái Lan', price: 63000, image: 'images/product6.webp', category: 'Đồ chơi', description: 'Mô hình Blind Box mèo Xiêm Thái Lan độc đáo. Mỗi hộp là một bất ngờ, có thể nhận được nhiều mẫu khác nhau.' },
            { id: 106, name: 'Set 4 mô hình mèo thần tài tròn', price: 60000, image: 'images/product7.webp', category: 'Trang trí', description: 'Set 4 mô hình mèo thần tài tròn may mắn. Bộ sưu tập 4 mèo với màu sắc khác nhau, mang lại không khí vui vẻ.' },
            { id: 107, name: 'Mô hình 4 mèo thần tài may mắn', price: 50000, image: 'images/product8.webp', category: 'Trang trí', description: 'Mô hình 4 mèo thần tài may mắn. Tập hợp 4 chú mèo với biểu cảm dễ thương, phù hợp làm quà tặng.' },
            // SẢN PHẨM MỚI (ID 108-117)
            { id: 108, name: 'Set mô hình Shiba thần tài hoa anh đào', price: 150000, image: 'images/new-product1.webp', category: 'Trang trí', description: 'Set mô hình Shiba thần tài hoa anh đào độc đáo. Kết hợp giữa chó Shiba dễ thương và hoa anh đào, mang lại cảm giác mùa xuân.' },
            { id: 109, name: 'Set 3 mô hình chú vịt vàng cosplay Phi công', price: 210000, image: 'images/new-product2.webp', category: 'Đồ chơi', description: 'Set 3 mô hình chú vịt vàng cosplay Phi công. Hình ảnh độc đáo, mang tính hài hước. Phù hợp làm quà tặng vui vẻ.' },
            { id: 110, name: 'Set 4 mô hình cừu Dory', price: 215000, image: 'images/new-product3.webp', category: 'Đồ chơi', description: 'Set 4 mô hình cừu Dory. Bộ sưu tập 4 chú cừu với biểu cảm khác nhau, thích hợp để sưu tầm.' },
            { id: 111, name: 'Set mô hình Phúc Lộc Thọ Thần Tài', price: 80000, image: 'images/new-product4.webp', category: 'Trang trí', description: 'Set mô hình Phúc Lộc Thọ Thần Tài. Tượng truyền thống mang ý nghĩa may mắn, tài lộc, sức khỏe. Quà tặng ý nghĩa cho gia đình.' },
            { id: 112, name: 'Mô hình gấu dâu Lotso mini', price: 204000, oldPrice: 240000, image: 'images/new-product5.webp', category: 'Đồ chơi', description: 'Mô hình gấu dâu Lotso mini. Hình gấu bông dâu rất dễ thương, nhỏ gọn, dễ mang theo. Quà tặng hoàn hảo cho bé yêu.' },
            { id: 113, name: 'Set 4 mô hình thần tài trắng vui vẻ', price: 183000, image: 'images/new-product6.webp', category: 'Trang trí', description: 'Set 4 mô hình thần tài trắng vui vẻ. Bộ sưu tập tượng thần tài trắng với biểu cảm tươi cười, trang trí phòng khách.' },
            { id: 114, name: 'Mô hình gấu trúc Panda vịt vàng', price: 150000, image: 'images/new-product7.webp', category: 'Trang trí', description: 'Mô hình gấu trúc Panda vịt vàng. Sự kết hợp dễ thương giữa gấu trúc và vịt vàng, mang đến cảm giác vui vẻ.' },
            { id: 115, name: 'Tượng mèo thần tài trắng khăn xanh (Mẫu 2)', price: 130000, image: 'images/new-product8.webp', category: 'Trang trí', description: 'Tượng mèo thần tài trắng khăn xanh mẫu 2. Phiên bản khác của mèo thần tài may mắn, khác biệt trong chi tiết thiết kế.' },
            { id: 116, name: 'Set mô hình 5 Ông già Noel dễ thương', price: 140000, oldPrice: 200000, image: 'images/new-product9.webp', category: 'Trang trí', description: 'Set mô hình 5 Ông già Noel dễ thương. Bộ sưu tập các mẫu Ông già Noel với biểu cảm vui vẻ, phù hợp cho mùa lễ.' },
            { id: 117, name: 'Đèn led Quả cầu tuyết Ông già Noel, Tuần lộc', price: 180000, oldPrice: 280000, image: 'images/new-product10.webp', category: 'Trang trí', description: 'Đèn led Quả cầu tuyết Ông già Noel, Tuần lộc. Đèn trang trí lễ hội với hình ảnh ấm cúng, thích hợp cho mùa giáng sinh.' }
        ];
        demoProducts.forEach(product => {
            products.push(product);
        });
        localStorage.setItem('products', JSON.stringify(products));
    }
}

//load
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo tất cả dữ liệu sản phẩm nếu chưa có
    ensureDemoProductsInStorage();
    ensureFlashSaleProductsInStorage();
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Nếu là Flash Sale product, load từ localStorage
    if (productId && productId.startsWith('fs-')) {
        loadFlashSaleProductData(productId);
    } else if (productId) {
        // Load sản phẩm từ localStorage (ID 100-117 hoặc admin products)
        loadProductDataFromLocalStorage(productId);
    } else {
        // Chỉ load từ HTML nếu không có URL parameter
        initProductData();
    }
    
    setupEventListeners();
    updateCartCount();
    updateMenuByLoginStatus();
    
    // Load đánh giá sản phẩm
    if (productId) {
        loadProductReviews(productId);
    }
});

//Hàm load dữ liệu Flash Sale product từ localStorage
function loadFlashSaleProductData(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
        productData = {
            id: product.id,
            name: product.name,
            price: product.price,
            oldPrice: product.oldPrice,
            image: product.image,
            category: product.category,
            description: product.description,
            discount: product.discount,
            sold: product.sold,
            progress: product.progress
        };
        
        // Cập nhật HTML trang chi tiết sản phẩm
        updatePageWithFlashSaleData(product);
    }
}

//Hàm load dữ liệu sản phẩm từ localStorage (ID 100-117 hoặc admin products)
function loadProductDataFromLocalStorage(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Tìm sản phẩm theo ID - hỗ trợ cả số và chuỗi
    const product = products.find(p => {
        // So sánh số nguyên
        if (typeof p.id === 'number' && typeof productId === 'string') {
            return p.id === parseInt(productId);
        }
        // So sánh trực tiếp
        return p.id == productId;
    });
    
    if (product) {
        productData = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category || 'Không xác định',
            description: product.description || 'Mô tả sản phẩm',
            oldPrice: product.oldPrice || product.price
        };
        
        // Cập nhật HTML trang chi tiết sản phẩm
        updatePageWithProductData(product);
    } else {
        // Nếu không tìm thấy, vẫn set default productData để không gây lỗi
        productData = {
            id: productId,
            name: 'Sản phẩm không tìm thấy',
            price: 0,
            image: 'images/default-product.jpg',
            category: 'Không xác định',
            description: 'Sản phẩm này không tồn tại'
        };
    }
}

//Hàm cập nhật trang chi tiết với dữ liệu Flash Sale
function updatePageWithFlashSaleData(product) {
    try {
        // Cập nhật tiêu đề
        const titleElement = document.querySelector('.product-title');
        if (titleElement) titleElement.textContent = product.name;
        
        // Cập nhật hình ảnh
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) mainImage.src = product.image;
        
        // Cập nhật giá
        const priceElement = document.querySelector('.current-price');
        if (priceElement) priceElement.textContent = formatPrice(product.price);
        
        // Cập nhật giá cũ
        const oldPriceElement = document.querySelector('.old-price');
        if (oldPriceElement) {
            oldPriceElement.textContent = formatPrice(product.oldPrice);
            oldPriceElement.style.display = 'inline';
        }
        
        // Cập nhật % giảm giá
        const discountElement = document.querySelector('.discount-percentage');
        if (discountElement && product.discount) {
            discountElement.textContent = product.discount + '%';
        }
        
        // Cập nhật mô tả
        const descriptionElement = document.querySelector('.product-description');
        if (descriptionElement) descriptionElement.textContent = product.description;
        
        // Cập nhật danh mục
        const categoryLink = document.querySelector('.product-category a');
        if (categoryLink) categoryLink.textContent = product.category;
        
        // Cập nhật breadcrumb
        const breadcrumb = document.querySelector('.breadcrumb-product');
        if (breadcrumb) breadcrumb.textContent = product.name;
    } catch (e) {
        console.log('Không thể cập nhật trang chi tiết. Sử dụng dữ liệu mặc định.');
    }
}

//Hàm cập nhật trang chi tiết với dữ liệu sản phẩm thường
function updatePageWithProductData(product) {
    try {
        // Cập nhật tiêu đề
        const titleElement = document.querySelector('.product-title');
        if (titleElement) titleElement.textContent = product.name;
        
        // Cập nhật hình ảnh
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) mainImage.src = product.image;
        
        // Cập nhật giá hiện tại
        const priceElement = document.querySelector('.current-price');
        if (priceElement) priceElement.textContent = formatPrice(product.price);
        
        // Cập nhật giá cũ nếu có
        if (product.oldPrice && product.oldPrice > product.price) {
            const oldPriceElement = document.querySelector('.old-price');
            if (oldPriceElement) {
                oldPriceElement.textContent = formatPrice(product.oldPrice);
                oldPriceElement.style.display = 'inline';
            }
        }
        
        // Cập nhật mô tả
        const descriptionElement = document.querySelector('.product-description');
        if (descriptionElement) descriptionElement.textContent = product.description;
        
        // Cập nhật danh mục
        const categoryLink = document.querySelector('.product-category a');
        if (categoryLink) categoryLink.textContent = product.category;
        
        // Cập nhật breadcrumb
        const breadcrumb = document.querySelector('.breadcrumb-product');
        if (breadcrumb) breadcrumb.textContent = product.name;
    } catch (e) {
        // Bỏ qua lỗi
    }
}

// Hàm định dạng giá tiền
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + '₫';
}

//Hàm khởi tạo dl sp từ các phần tử HTML
function initProductData() {
    productData = {
        id: getProductIdFromUrl() || '1', 
        name: document.querySelector('.product-title').textContent,
        price: parseFloat(document.querySelector('.current-price').textContent.replace(/[^\d]/g, '')),
        image: document.getElementById('main-product-image').src,
        category: document.querySelector('.product-category a').textContent,
        description: document.querySelector('.product-description').textContent.trim()
    };
}

// Hàm lấy ID sản phẩm từ URL
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

//Hàm thiết lập tất cả các sự kiện
function setupEventListeners() {
    setupQuantityButtons();
    setupAddToCartButton();
}

//Hàm thiết lập các nút thay đổi số lượng
function setupQuantityButtons() {
    const decreaseBtn = document.querySelector('.quantity-selector .quantity-btn:first-child');
    const increaseBtn = document.querySelector('.quantity-selector .quantity-btn:last-child');
    const quantityInput = document.querySelector('.quantity-input');
    
    // Xóa bỏ tất cả event listener hiện có (nếu có)
    decreaseBtn.replaceWith(decreaseBtn.cloneNode(true));
    increaseBtn.replaceWith(increaseBtn.cloneNode(true));
    
    // Lấy lại các phần tử 
    const newDecreaseBtn = document.querySelector('.quantity-selector .quantity-btn:first-child');
    const newIncreaseBtn = document.querySelector('.quantity-selector .quantity-btn:last-child');
    
    newDecreaseBtn.addEventListener('click', function() {     // Thêm event listener mới
        decreaseQuantity();
    });
    
    newIncreaseBtn.addEventListener('click', function() {
        increaseQuantity();
    });
}

// Hàm thiết lập nút thêm vào giỏ hàng
function setupAddToCartButton() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    
    // Xóa bỏ tất cả event listener hiện có 
    addToCartBtn.replaceWith(addToCartBtn.cloneNode(true));
    buyNowBtn.replaceWith(buyNowBtn.cloneNode(true));
    
    // Lấy lại các phần tử sau khi clone
    const newAddToCartBtn = document.querySelector('.add-to-cart-btn');
    const newBuyNowBtn = document.querySelector('.buy-now-btn');
    
    // Thêm event listener mới
    newAddToCartBtn.addEventListener('click', function() {
        addToCartFromDetail();
    });
    
    newBuyNowBtn.addEventListener('click', function() {
        addToCartFromDetail();
        // Chuyển hướng đến trang giỏ hàng
        window.location.href = 'Cart.html';
    });
}

// Các hàm thay đổi số lượng
function increaseQuantity() {
    const quantityInput = document.querySelector('.quantity-input');
    let quantity = parseInt(quantityInput.value);
    quantityInput.value = quantity + 1;
}

function decreaseQuantity() {
    const quantityInput = document.querySelector('.quantity-input');
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
        quantityInput.value = quantity - 1;
    }
}

// Hàm thêm sản phẩm vào giỏ hàng từ trang chi tiết
function addToCartFromDetail() {
    const quantity = parseInt(document.querySelector('.quantity-input').value);
    
    if (productData && productData.id) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];         // Lấy giỏ hàng hiện tại hoặc khởi tạo giỏ hàng rỗng

        const selectedVariant = document.querySelector('.variant-option.active')?.textContent || 'Mặc định';         // Lấy biến thể đã chọn nếu có
        
        const product = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: productData.image,
            quantity: quantity,
            variant: selectedVariant
        };

        const existingProductIndex = cart.findIndex(item =>          // Kiểm tra xem sản phẩm đã có trong giỏ với biến thể giống nhau chưa
            item.id === product.id && item.variant === product.variant);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += quantity;           
        } else {
            cart.push(product); 
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${product.name} đã được thêm vào giỏ hàng!`);
    } else {
        alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
    }
}

// Hàm cập nhật số lượng giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    let totalItems = 0;     // Tính tổng số sản phẩm trong giỏ
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    
    const cartLinks = document.querySelectorAll('a[href*="cart"], a[href*="gio-hang"]');     // Tìm tất cả các liên kết giỏ hàng (nếu có nhiều liên kết trên header/menu)
    
    cartLinks.forEach(link => {
        if (link.textContent.includes('(')) {         //Kiểm tra nếu liên kết có chứa số lượng trong ngoặc
            link.textContent = link.textContent.replace(/\(\d+\)/, `(${totalItems})`);             // Thay thế số lượng cũ
        } else {
            link.textContent = `${link.textContent} (${totalItems})`;              // Thêm số lượng vào cuối văn bản
        }
    });
}

// Hàm cập nhật menu theo trạng thái đăng nhập
function updateMenuByLoginStatus() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const menuList = document.querySelector('.menu-account');
    
    if (menuList) {
        // Xóa menu cũ
        menuList.innerHTML = '';
        
        if (userData && userData.isLoggedIn) {
            // Hiển thị menu khi đã đăng nhập
            menuList.innerHTML = `
                <li><a href="account.html">Quản lý tài khoản</a></li>
                <li><a href="javascript:void(0);" onclick="logout()">Đăng xuất</a></li>
            `;
        } else {
            // Hiển thị menu khi chưa đăng nhập
            menuList.innerHTML = `
                <li><a href="login-register.html">Đăng nhập</a></li>
                <li><a href="login-register.html">Đăng ký</a></li>
            `;
        }
    }
}

// Hàm hiển thị đánh giá sản phẩm từ localStorage
function loadProductReviews(productId) {
    const allReviews = JSON.parse(localStorage.getItem('productReviews') || '[]');
    
    // Lọc đánh giá theo sản phẩm
    const productReviews = allReviews.filter(r => r.productId == productId || r.productName === productData.name);
    
    const container = document.getElementById('product-reviews-container');
    if (!container) return;
    
    if (productReviews.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Chưa có đánh giá nào. Hãy mua sản phẩm và chia sẻ cảm nhận của bạn!</p>';
        return;
    }
    
    // Tính điểm trung bình
    const avgRating = (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1);
    
    let reviewsHTML = `
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #ddd;">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 36px; font-weight: bold; color: #f39c12;">${avgRating}</div>
                <div>
                    <div style="margin-bottom: 5px;">
                        ${Array(5).fill(0).map((_, i) => `<span style="color: ${i < Math.round(avgRating) ? '#f39c12' : '#ddd'}; font-size: 20px;">★</span>`).join('')}
                    </div>
                    <p style="margin: 5px 0; color: #666;">Dựa trên ${productReviews.length} đánh giá</p>
                </div>
            </div>
        </div>
    `;
    
    // Hiển thị từng đánh giá
    productReviews.forEach(review => {
        const reviewDate = new Date(review.reviewDate).toLocaleDateString('vi-VN');
        reviewsHTML += `
            <div style="padding: 15px; border: 1px solid #eee; border-radius: 4px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <p style="margin: 0; font-weight: bold; color: #333;">${review.reviewerName}</p>
                        <p style="margin: 5px 0; font-size: 12px; color: #999;">${reviewDate}</p>
                    </div>
                    <div style="text-align: right;">
                        ${Array(5).fill(0).map((_, i) => `<span style="color: ${i < review.rating ? '#f39c12' : '#ddd'}; font-size: 16px;">★</span>`).join('')}
                    </div>
                </div>
                ${review.comment ? `<p style="margin: 10px 0; color: #555; line-height: 1.5;">${review.comment}</p>` : ''}
            </div>
        `;
    });
    
    container.innerHTML = reviewsHTML;
}