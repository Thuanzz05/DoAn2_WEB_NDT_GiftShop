document.addEventListener('DOMContentLoaded', function() {
    taiDanhMuc();
    taiSanPham();
    thietLapTimKiem();
    thietLapForm();
});

/*  - Lấy danh mục từ localStorage - Hiển thị vào dropdown để chọn */
function taiDanhMuc() {
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

/* - Lấy sản phẩm từ localStorage- Hiển thị thông tin sản phẩm và danh mục- Tạo nút sửa/xóa cho mỗi sản phẩm */
function taiSanPham() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const tbody = document.getElementById('product-list');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có sản phẩm nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const category = categories.find(c => c.id == product.categoryId);
        const categoryName = category ? category.name : 'N/A';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${categoryName}</td>
            <td>${parseInt(product.price).toLocaleString('vi-VN')}₫</td>
            <td>${product.stock || 0}</td>
            <td>
                <button class="btn-icon" onclick="suaSanPham('${product.id}')" title="Sửa">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-danger" onclick="xoaSanPham('${product.id}')" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/* 
   - Gọi hàm luuSanPham khi submit
   */
function thietLapForm() {
        const formSanPham = document.getElementById('product-form');
    
    formSanPham.addEventListener('submit', function(e) {
        e.preventDefault();
        luuSanPham();
    });
}

/* 
   - Lấy thông tin từ form
   - Kiểm tra dữ liệu hợp lệ
   - Thêm mới hoặc cập nhật sản phẩm
   */
function luuSanPham() {
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
        // Cập nhật sản phẩm - dùng String() để so sánh chính xác
        const index = products.findIndex(p => String(p.id) === String(id));
        if (index !== -1) {
            // Giữ nguyên ID (có thể là số hoặc string như "fs-1")
            products[index] = {
                id: isNaN(parseInt(id)) ? id : parseInt(id),
                name: name,
                categoryId: parseInt(categoryId),
                price: parseInt(price),
                stock: parseInt(stock),
                image: image || 'images/default-product.jpg',
                description: description
            };
            alert('Đã cập nhật sản phẩm thành công!');
        } else {
            alert('Không tìm thấy sản phẩm để cập nhật!');
        }
    } else {
        // Thêm sản phẩm mới
        // Lấy ID max từ sản phẩm admin (ID < 100), đảm bảo không bị chồng ID với demo
        const adminProducts = products.filter(p => typeof p.id === 'number' && p.id < 100);
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
    
    // Đặt lại form và tải lại danh sách
    datLaiForm();
    taiSanPham();
}

/* 
   - Tìm sản phẩm theo ID
   - Điền thông tin vào form
   - Chuyển form sang chế độ sửa
  */
function suaSanPham(id) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => String(p.id) === String(id));
    
    if (!product) {
        alert('Không tìm thấy sản phẩm!');
        return;
    }
    
    // Điền dữ liệu vào form
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.categoryId;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock || 0;
    document.getElementById('product-image').value = product.image || '';
    document.getElementById('product-description').value = product.description || '';
    
    // Đổi title form
    document.getElementById('form-title').textContent = 'Chỉnh sửa sản phẩm';
    
    // Scroll lên form
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

/* 
   - Xác nhận trước khi xóa
   - Xóa sản phẩm khỏi localStorage
   - Cập nhật lại danh sách
   */
function xoaSanPham(id) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    products = products.filter(p => String(p.id) !== String(id));
    
    localStorage.setItem('products', JSON.stringify(products));
    
    alert('Đã xóa sản phẩm thành công!');
    taiSanPham();
}

/* 
   ĐẶT LẠI FORM
   - Xóa tất cả dữ liệu trong form
   - Đặt lại tiêu đề form
  */
function datLaiForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('form-title').textContent = 'Thêm sản phẩm mới';
}

/* 
   THIẾT LẬP TÌM KIẾM
   - Tìm kiếm theo tên sản phẩm
   - Lọc kết quả realtime khi gõ
   - Ẩn/hiện các dòng phù hợp
 */
function thietLapTimKiem() {
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