// qlsp
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadProducts();
    setupSearch();
    setupForm();
});

// Load danh mục vào dropdown
function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const select = document.getElementById('product-category');
    
    select.innerHTML = '<option value="">-- Chọn danh mục --</option>';
    
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

// Load danh sách sản phẩm (chỉ hiển thị sản phẩm admin - ID < 100)
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const tbody = document.getElementById('product-list');
    
    // Lọc chỉ lấy sản phẩm admin (ID < 100), bỏ qua sản phẩm demo (ID 100-107)
    const adminProducts = products.filter(p => p.id < 100);
    
    if (adminProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có sản phẩm nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    adminProducts.forEach(product => {
        const category = categories.find(c => c.id == product.categoryId);
        const categoryName = category ? category.name : 'N/A';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${categoryName}</td>
            <td>${parseInt(product.price).toLocaleString('vi-VN')}₫</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn-icon" onclick="editProduct(${product.id})" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-danger" onclick="deleteProduct(${product.id})" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Setup form submit
function setupForm() {
    const form = document.getElementById('product-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
}

// Lưu sản phẩm (Thêm hoặc Sửa)
function saveProduct() {
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const categoryId = document.getElementById('product-category').value;
    const price = document.getElementById('product-price').value;
    const stock = document.getElementById('product-stock').value;
    const image = document.getElementById('product-image').value.trim();
    const description = document.getElementById('product-description').value.trim();
    
    // Validate
    if (!name || !categoryId || !price || !stock) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    if (parseInt(price) <= 0) {
        alert('Giá phải lớn hơn 0!');
        return;
    }
    if (parseInt(stock) < 0) {
        alert('Tồn kho không được âm!');
        return;
    }
    
    // Lấy danh sách sản phẩm
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    
    if (id) {
        // Cập nhật sản phẩm
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = {
                id: parseInt(id),
                name: name,
                categoryId: parseInt(categoryId),
                price: parseInt(price),
                stock: parseInt(stock),
                image: image || 'images/default-product.jpg',
                description: description
            };
            alert('Đã cập nhật sản phẩm thành công!');
        }
    } else {
        // Thêm sản phẩm mới
        // Lọc chỉ lấy sản phẩm admin (ID < 100) để tạo ID mới
        const adminProducts = products.filter(p => p.id < 100);
        const newId = adminProducts.length > 0 ? Math.max(...adminProducts.map(p => p.id)) + 1 : 1;
        
        products.push({
            id: newId,
            name: name,
            categoryId: parseInt(categoryId),
            price: parseInt(price),
            stock: parseInt(stock),
            image: image || 'images/default-product.jpg',
            description: description
        });
        
        alert('Đã thêm sản phẩm thành công!');
    }
    
    // Lưu vào localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Reset form và reload
    resetForm();
    loadProducts();
}

// Sửa sản phẩm
function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id == id);
    
    if (!product) {
        alert('Không tìm thấy sản phẩm!');
        return;
    }
    
    // Điền dữ liệu vào form
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.categoryId;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-image').value = product.image || '';
    document.getElementById('product-description').value = product.description || '';
    
    // Đổi title form
    document.getElementById('form-title').textContent = 'Chỉnh sửa sản phẩm';
    
    // Scroll lên form
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

// Xóa sản phẩm
function deleteProduct(id) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    products = products.filter(p => p.id != id);
    
    localStorage.setItem('products', JSON.stringify(products));
    
    alert('Đã xóa sản phẩm thành công!');
    loadProducts();
}

// Reset form
function resetForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('form-title').textContent = 'Thêm sản phẩm mới';
}

// Tìm kiếm sản phẩm
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    
    searchInput.addEventListener('input', function() {
        const keyword = this.value.toLowerCase().trim();
        const rows = document.querySelectorAll('#product-list tr');
        
        rows.forEach(row => {
            const productName = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
            
            if (productName.includes(keyword) || keyword === '') {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}