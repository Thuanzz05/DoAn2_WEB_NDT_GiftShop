document.addEventListener('DOMContentLoaded', function() {
    khoiTaoDanhMucMacDinh();
    taiDanhMuc();
    thietLapForm();
    thietLapTimKiem();
});

function khoiTaoDanhMucMacDinh() {
    let danhMucHienTai = JSON.parse(localStorage.getItem('categories') || '[]');
    
    // Danh mục mặc định 
    if (danhMucHienTai.length === 0) {
        const danhMucMacDinh = [
            { id: 1, name: 'Set quà tặng', description: 'Các bộ quà tặng độc đáo và ý nghĩa' },
            { id: 2, name: 'Phụ kiện trang trí', description: 'Đồ trang trí nhà cửa, phòng học' },
            { id: 3, name: 'Thú bông', description: 'Gấu bông và thú nhồi bông các loại' },
            { id: 4, name: 'Quà tặng giáng sinh', description: 'Phụ kiện và quà tặng mùa Giáng sinh' },
            { id: 5, name: 'Mèo thần tài', description: 'Tượng mèo thần tài may mắn' },
            { id: 6, name: 'Hộp mica', description: 'Hộp mica độc đáo và ý nghĩa' },
            { id: 7, name: 'Móc khóa', description: 'Móc khóa độc đáo và ý nghĩa' },
            { id: 8, name: 'Bút', description: 'Bút độc đáo và ý nghĩa' },
            { id: 9, name: 'Sổ vở', description: 'Sổ vở độc đáo và ý nghĩa' },
            { id: 10, name: 'Mô hình', description: 'Mô hình độc đáo và ý nghĩa' }
        ];
        localStorage.setItem('categories', JSON.stringify(danhMucMacDinh));
    }
}


function taiDanhMuc() {
    // Lấy dữ liệu từ localStorage
    const danhSachDanhMuc = JSON.parse(localStorage.getItem('categories') || '[]');
    const danhSachSanPham = JSON.parse(localStorage.getItem('products') || '[]');
    const bangDanhMuc = document.getElementById('category-list');
    
    if (danhSachDanhMuc.length === 0) {
        bangDanhMuc.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có danh mục nào</td></tr>';
        return;
    }
    
    // Hiển thị tất cả danh mục
    bangDanhMuc.innerHTML = '';
    
    danhSachDanhMuc.forEach(danhMuc => {
        const soLuongSanPham = danhSachSanPham.filter(sp => sp.categoryId == danhMuc.id).length;
        
        const dongMoi = document.createElement('tr');
        dongMoi.innerHTML = `
            <td>${danhMuc.id}</td>
            <td>${danhMuc.name}</td>
            <td>${danhMuc.description || ''}</td>
            <td>${soLuongSanPham}</td>
            <td>
                <button class="btn-icon" onclick="suaDanhMuc(${danhMuc.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-danger" onclick="xoaDanhMuc(${danhMuc.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        bangDanhMuc.appendChild(dongMoi);
    });
}


function thietLapForm() {
    document.getElementById('category-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Ngăn form reload trang
        luuDanhMuc();
    });
}


function luuDanhMuc() {
    // Lấy thông tin từ form
    const id = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value.trim();
    const description = document.getElementById('category-description').value.trim();
    
    if (!name) {
        alert('Vui lòng nhập tên danh mục!');
        return;
    }
    
    let danhSachDanhMuc = JSON.parse(localStorage.getItem('categories') || '[]');
    
    if (id) {
        const viTri = danhSachDanhMuc.findIndex(dm => dm.id == id);
        if (viTri !== -1) {
            danhSachDanhMuc[viTri] = { id: parseInt(id), name, description };
            alert('Đã cập nhật danh mục!');
        }
    } else {
        const idMoi = danhSachDanhMuc.length > 0 ? Math.max(...danhSachDanhMuc.map(dm => dm.id)) + 1 : 1;
        danhSachDanhMuc.push({ id: idMoi, name, description });
        alert('Đã thêm danh mục!');
    }
    
    localStorage.setItem('categories', JSON.stringify(danhSachDanhMuc));
    
    // Thêm timestamp vào localStorage để báo hiệu có thay đổi
    localStorage.setItem('categoriesUpdatedAt', new Date().getTime().toString());
    
    datLaiForm();
    taiDanhMuc();
}


function suaDanhMuc(id) {
    // Tìm danh mục trong localStorage
    const danhSachDanhMuc = JSON.parse(localStorage.getItem('categories') || '[]');
    const danhMuc = danhSachDanhMuc.find(dm => dm.id == id);
    
    if (danhMuc) {
        document.getElementById('category-id').value = danhMuc.id;
        document.getElementById('category-name').value = danhMuc.name;
        document.getElementById('category-description').value = danhMuc.description || '';
        document.getElementById('form-title').textContent = 'Chỉnh sửa danh mục';
    }
}


function xoaDanhMuc(id) {
    // Kiểm tra có sản phẩm trong danh mục không
    const danhSachSanPham = JSON.parse(localStorage.getItem('products') || '[]');
    const coSanPham = danhSachSanPham.some(sp => sp.categoryId == id);
    
    if (coSanPham) {
        alert('Không thể xóa danh mục đang có sản phẩm!');
        return;
    }
    
    if (!confirm('Xóa danh mục này?')) return;
    
    let danhSachDanhMuc = JSON.parse(localStorage.getItem('categories') || '[]');
    danhSachDanhMuc = danhSachDanhMuc.filter(dm => dm.id != id);
    localStorage.setItem('categories', JSON.stringify(danhSachDanhMuc));
    
    // Thêm timestamp vào localStorage để báo hiệu có thay đổi
    localStorage.setItem('categoriesUpdatedAt', new Date().getTime().toString());
    
    alert('Đã xóa danh mục!');
    taiDanhMuc();
}


function datLaiForm() {
    document.getElementById('category-form').reset(); // Xóa dl form
    document.getElementById('category-id').value = ''; // Xóa ID
    document.getElementById('form-title').textContent = 'Thêm danh mục mới'; // Đổi tiêu đề
}


function thietLapTimKiem() {
    document.getElementById('search-input').addEventListener('input', function() {
        const tuKhoa = this.value.toLowerCase(); 
        
        // Duyệt từng dòng 
        document.querySelectorAll('#category-list tr').forEach(dongDanhMuc => {
            const tenDanhMuc = dongDanhMuc.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
            // Ẩn/hiện dựa trên việc tên có chứa từ khóa không
            dongDanhMuc.style.display = tenDanhMuc.includes(tuKhoa) || tuKhoa === '' ? '' : 'none';
        });
    });
}