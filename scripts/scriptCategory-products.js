// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    loadCategoryProducts();
    setupSortListener();
    updateMenuByLoginStatus();
    updateActiveCategoryLink();
});

// Tải sản phẩm theo danh mục
function loadCategoryProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id') || 1; // Mặc định danh mục 1 nếu không có ID
    
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const category = categories.find(c => c.id == categoryId);
    
    // Cập nhật tiêu đề danh mục
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle && category) {
        categoryTitle.textContent = category.name;
        document.title = category.name + ' - NDT Gift Shop';
    }
    
    // Lấy tất cả sản phẩm
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Lọc sản phẩm theo danh mục
    let categoryProducts = products.filter(p => p.categoryId == categoryId);
    
    // Sắp xếp mặc định theo giá tăng dần
    categoryProducts.sort((a, b) => a.price - b.price);
    
    // Hiển thị sản phẩm
    displayProducts(categoryProducts);
}

// Hiển thị sản phẩm lên trang
function displayProducts(products) {
    const categoryProductsContainer = document.querySelector('.category-products');
    
    if (!categoryProductsContainer) return;
    
    // Xóa sản phẩm cũ
    categoryProductsContainer.innerHTML = '';
    
    if (products.length === 0) {
        categoryProductsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Không có sản phẩm nào trong danh mục này</p>';
        return;
    }
    
    // Thêm sản phẩm mới
    products.forEach(product => {
        const productHTML = createProductCard(product);
        categoryProductsContainer.insertAdjacentHTML('beforeend', productHTML);
    });
    
    // Thêm event listener cho nút "Thêm vào giỏ"
    setupAddToCartButtons();
}

// Tạo HTML card sản phẩm
function createProductCard(product) {
    return `
        <div class="product-item" data-product-id="${product.id}">
            <div class="product-image">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/default-product.jpg'">
                </a>
                <div class="product-buttons">
                    <button class="add-to-cart" data-product-id="${product.id}"><i class="fa fa-shopping-cart"></i></button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name"><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
                <div class="product-price">
                    <span class="current-price">${product.price.toLocaleString('vi-VN')}₫</span>
                </div>
            </div>
        </div>
    `;
}

// Thiết lập event listener cho sắp xếp
function setupSortListener() {
    const sortSelect = document.getElementById('sort-by');
    
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function(e) {
        const sortValue = e.target.value;
        sortProducts(sortValue);
    });
}

// Sắp xếp sản phẩm theo lựa chọn
function sortProducts(sortType) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id') || 1;
    
    // Lấy tất cả sản phẩm
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Lọc sản phẩm theo danh mục
    let categoryProducts = products.filter(p => p.categoryId == categoryId);
    
    // Sắp xếp theo loại đã chọn
    switch(sortType) {
        case 'price-asc':
            // Giá tăng dần
            categoryProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            // Giá giảm dần
            categoryProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            // Tên A-Z
            categoryProducts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
            break;
        case 'name-desc':
            // Tên Z-A
            categoryProducts.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
            break;
        case 'default':
            // Mặc định (giá tăng dần)
            categoryProducts.sort((a, b) => a.price - b.price);
            break;
    }
    
    // Hiển thị sản phẩm đã sắp xếp
    displayProducts(categoryProducts);
}

// Thiết lập nút "Thêm vào giỏ"
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.product-item .add-to-cart');
    
    addToCartButtons.forEach(button => {
        // Xóa event listener cũ (nếu có)
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Thêm event listener mới
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id == productId);
    
    if (!product) {
        alert('Không tìm thấy sản phẩm!');
        return;
    }
    
    // Lấy giỏ hàng hiện tại
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Nếu đã có, tăng số lượng
        cart[existingProductIndex].quantity += 1;
    } else {
        // Nếu chưa có, thêm sản phẩm mới
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Lưu giỏ hàng
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} đã được thêm vào giỏ hàng!`);
    
    // Cập nhật số lượng giỏ hàng trên menu
    updateCartCount();
}

// Cập nhật số lượng giỏ hàng trên menu
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    
    const cartLinks = document.querySelectorAll('a[href*="cart"], a[href*="gio-hang"]');
    
    cartLinks.forEach(link => {
        if (link.textContent.includes('(')) {
            link.textContent = link.textContent.replace(/\(\d+\)/, `(${totalItems})`);
        } else {
            link.textContent = `${link.textContent} (${totalItems})`;
        }
    });
}

// Cập nhật active state cho sidebar category link
function updateActiveCategoryLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = parseInt(urlParams.get('id')) || 1;
    
    // Xóa class active từ tất cả sidebar links
    const sidebarLinks = document.querySelectorAll('.category-list a');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Thêm class active cho link hiện tại
    const activeLink = document.querySelector(`.category-list a[href*="id=${categoryId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Kiểm tra trạng thái đăng nhập và cập nhật menu
function updateMenuByLoginStatus() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const isLoggedIn = userData && userData.isLoggedIn;
    
    const accountSubmenu = document.querySelector('.account-submenu');
    
    if (accountSubmenu) {
        if (isLoggedIn) {
            // Đã đăng nhập: Hiện "Quản lý tài khoản", ẩn "Đăng ký"
            accountSubmenu.innerHTML = `
                <li><a href="account.html"><i class="fas fa-user-circle"></i> Quản lý tài khoản</a></li>
                <li><a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
            `;
            
            // Thêm sự kiện đăng xuất
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('Bạn có chắc muốn đăng xuất?')) {
                        localStorage.removeItem('userData');
                        alert('Đăng xuất thành công!');
                        location.reload();
                    }
                });
            }
        } else {
            // Chưa đăng nhập: Ẩn "Quản lý tài khoản", hiện "Đăng nhập" và "Đăng ký"
            accountSubmenu.innerHTML = `
                <li><a href="login-register.html"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a></li>
                <li><a href="login-register.html#register" id="go-to-register"><i class="fas fa-user-plus"></i> Đăng ký</a></li>
            `;
        }
    }
}
