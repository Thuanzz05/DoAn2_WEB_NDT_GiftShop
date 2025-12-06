// Xử lý tìm kiếm sản phẩm
document.addEventListener('DOMContentLoaded', function() {
    performSearch();
    setupSearchForm();
    updateMenuByLoginStatus();
});

function performSearch() {
    // Lấy query parameter từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';
    
    // Hiển thị keyword tìm kiếm
    document.getElementById('search-keyword').textContent = searchQuery;
    document.getElementById('search-query').textContent = `"${searchQuery}"`;
    
    if (!searchQuery.trim()) {
        showNoResults();
        return;
    }
    
    // Lấy danh sách sản phẩm từ localStorage
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Tìm kiếm sản phẩm theo tên, mô tả, danh mục
    const results = products.filter(product => {
        const searchLower = searchQuery.toLowerCase();
        const name = (product.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const category = (product.category || '').toLowerCase();
        
        return name.includes(searchLower) || 
               description.includes(searchLower) || 
               category.includes(searchLower);
    });
    
    // Hiển thị kết quả
    if (results.length === 0) {
        showNoResults();
    } else {
        displaySearchResults(results);
    }
}

function displaySearchResults(products) {
    const resultsContainer = document.getElementById('search-results');
    const noResults = document.getElementById('no-results');
    
    resultsContainer.innerHTML = '';
    noResults.style.display = 'none';
    
    // Tạo grid sản phẩm - sử dụng cấu trúc giống index.html
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-item';
        
        // Kiểm tra có sale-tag không
        const saleTagHTML = product.originalPrice ? `<span class="sale-tag">${Math.round((1 - product.price/product.originalPrice) * 100)}%</span>` : '';
        
        productCard.innerHTML = `
            <div class="product-image">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    ${saleTagHTML}
                </a>
                <div class="product-buttons">
                    <button class="add-to-cart" onclick="addToCart(${product.id})"><i class="fa fa-shopping-cart"></i></button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-price">
                    <span class="current-price">${product.price.toLocaleString('vi-VN')}₫</span>
                    ${product.originalPrice ? `<span class="old-price">${product.originalPrice.toLocaleString('vi-VN')}₫</span>` : ''}
                </div>
            </div>
        `;
        resultsContainer.appendChild(productCard);
    });
}

function showNoResults() {
    const resultsContainer = document.getElementById('search-results');
    const noResults = document.getElementById('no-results');
    
    resultsContainer.innerHTML = '';
    noResults.style.display = 'block';
}

// Setup xử lý form tìm kiếm trên trang search-results
function setupSearchForm() {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            const query = searchInput.value.trim();
            
            if (query) {
                // Redirect với query parameter mới
                window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
}

// Thêm vào giỏ hàng
function addToCart(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => String(p.id) === String(productId));
    
    if (!product) {
        alert('Sản phẩm không tồn tại!');
        return;
    }
    
    const stock = parseInt(product.stock) || 0;
    
    if (stock === 0) {
        alert('Sản phẩm đã hết hàng! Không thể thêm vào giỏ hàng.');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = cart.find(item => String(item.id) === String(productId));
    
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
    alert('Đã thêm vào giỏ hàng!');
    
    // Cập nhật số lượng giỏ hàng trên header
    updateCartCount();
}

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartLink = document.getElementById('cart-link');
    
    if (cartLink) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartLink.innerHTML = `<i class="fas fa-shopping-cart"></i> Giỏ hàng <span style="background: #B53740; color: white; padding: 2px 6px; border-radius: 50%; font-size: 12px; margin-left: 5px;">${totalItems}</span>`;
        } else {
            cartLink.innerHTML = `<i class="fas fa-shopping-cart"></i> Giỏ hàng`;
        }
    }
}

// Kiểm tra trạng thái đăng nhập (sao chép từ scriptIndex.js)
function updateMenuByLoginStatus() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const isLoggedIn = userData && userData.isLoggedIn;
    
    const accountDropdown = document.querySelector('.account-dropdown');
    const accountSubmenu = document.querySelector('.account-submenu');
    const accountLink = accountDropdown?.querySelector('a');
    
    if (accountDropdown && accountSubmenu && accountLink) {
        if (isLoggedIn) {
            accountLink.innerHTML = `<i class="fas fa-user"></i> ${userData.name} <i class="fas fa-angle-down"></i>`;
            
            accountSubmenu.innerHTML = `
                <li><a href="account.html"><i class="fas fa-user-circle"></i> Quản lý tài khoản</a></li>
                <li><a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>`;
            
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
            accountLink.innerHTML = `<i class="fas fa-user"></i> Tài khoản <i class="fas fa-angle-down"></i>`;
            
            accountSubmenu.innerHTML = `
                <li><a href="login-register.html"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a></li>
                <li><a href="login-register.html#register" id="go-to-register"><i class="fas fa-user-plus"></i> Đăng ký</a></li>`;
        }
    }
}

// Cập nhật cart count và menu khi load trang
updateCartCount();

