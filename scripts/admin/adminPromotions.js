document.addEventListener('DOMContentLoaded', function() {
    loadPromotions();
    thietLapForm();
    setupSearch();
    setupTypeChange();
});

function setupTypeChange() {
    document.getElementById('promotion-type').addEventListener('change', function() {
        const hint = document.getElementById('value-hint');
        if (this.value === 'percent') {
            hint.textContent = 'Nhập % (0-100)';
        } else if (this.value === 'amount') {
            hint.textContent = 'Nhập số tiền (₫)';
        } else {
            hint.textContent = 'Để 0 nếu freeship';
        }
    });
}

function loadPromotions() {
    const promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
    const tbody = document.getElementById('promotion-list');
    
    if (promotions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Chưa có khuyến mãi nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    const today = new Date();
    
    promotions.forEach(promo => {
        const startDate = new Date(promo.startDate);
        const endDate = new Date(promo.endDate);
        
        let statusClass = '';
        let statusText = '';
        
        if (today < startDate) {
            statusClass = 'badge-info';
            statusText = 'Sắp diễn ra';
        } else if (today > endDate) {
            statusClass = 'badge-danger';
            statusText = 'Hết hạn';
        } else {
            statusClass = 'badge-success';
            statusText = 'Đang chạy';
        }
        
        const typeText = {
            'percent': 'Giảm %',
            'amount': 'Giảm tiền',
            'freeship': 'Freeship'
        };
        
        const valueDisplay = promo.type === 'percent' 
            ? promo.value + '%' 
            : promo.type === 'freeship'
            ? 'Miễn phí'
            : parseInt(promo.value).toLocaleString('vi-VN') + '₫';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${promo.code}</td>
            <td>${promo.name}</td>
            <td>${typeText[promo.type]}</td>
            <td>${valueDisplay}</td>
            <td>${promo.startDate} ~ ${promo.endDate}</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn-icon" onclick="editPromotion(${promo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-danger" onclick="deletePromotion(${promo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function thietLapForm() {
    document.getElementById('promotion-form').addEventListener('submit', function(e) {
        e.preventDefault();
        savePromotion();
    });
}

function savePromotion() {
    const id = document.getElementById('promotion-id').value;
    const code = document.getElementById('promotion-code').value.trim().toUpperCase();
    const name = document.getElementById('promotion-name').value.trim();
    const type = document.getElementById('promotion-type').value;
    const value = document.getElementById('promotion-value').value;
    const startDate = document.getElementById('promotion-startdate').value;
    const endDate = document.getElementById('promotion-enddate').value;
    const description = document.getElementById('promotion-description').value.trim();
    
    // Validate
    if (!code || !name || !value || !startDate || !endDate) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (parseFloat(value) < 0) {
        alert('Giá trị phải >= 0!');
        return;
    }
    
    if (type === 'percent' && parseFloat(value) > 100) {
        alert('Giảm % không được vượt quá 100!');
        return;
    }
    
    if (new Date(endDate) < new Date(startDate)) {
        alert('Ngày kết thúc phải sau ngày bắt đầu!');
        return;
    }
    
    let promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
    
    // Kiểm tra trùng mã
    if (!id && promotions.some(p => p.code === code)) {
        alert('Mã khuyến mãi đã tồn tại!');
        return;
    }
    
    if (id) {
        const index = promotions.findIndex(p => p.id == id);
        if (index !== -1) {
            promotions[index] = {
                id: parseInt(id),
                code, name, type,
                value: parseFloat(value),
                startDate, endDate, description
            };
            alert('Đã cập nhật khuyến mãi!');
        }
    } else {
        const newId = promotions.length > 0 ? Math.max(...promotions.map(p => p.id)) + 1 : 1;
        promotions.push({
            id: newId,
            code, name, type,
            value: parseFloat(value),
            startDate, endDate, description
        });
        alert('Đã tạo khuyến mãi!');
    }
    
    localStorage.setItem('promotions', JSON.stringify(promotions));
    datLaiForm();
    loadPromotions();
}

function editPromotion(id) {
    const promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
    const promo = promotions.find(p => p.id == id);
    
    if (promo) {
        document.getElementById('promotion-id').value = promo.id;
        document.getElementById('promotion-code').value = promo.code;
        document.getElementById('promotion-name').value = promo.name;
        document.getElementById('promotion-type').value = promo.type;
        document.getElementById('promotion-value').value = promo.value;
        document.getElementById('promotion-startdate').value = promo.startDate;
        document.getElementById('promotion-enddate').value = promo.endDate;
        document.getElementById('promotion-description').value = promo.description || '';
        document.getElementById('form-title').textContent = 'Chỉnh sửa khuyến mãi';
        document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
    }
}

function deletePromotion(id) {
    if (!confirm('Xóa khuyến mãi này?')) return;
    
    let promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
    promotions = promotions.filter(p => p.id != id);
    localStorage.setItem('promotions', JSON.stringify(promotions));
    
    alert('Đã xóa khuyến mãi!');
    loadPromotions();
}

function datLaiForm() {
    document.getElementById('promotion-form').reset();
    document.getElementById('promotion-id').value = '';
    document.getElementById('form-title').textContent = 'Tạo khuyến mãi mới';
}

function setupSearch() {
    document.getElementById('search-input').addEventListener('input', function() {
        const keyword = this.value.toLowerCase();
        document.querySelectorAll('#promotion-list tr').forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(keyword) || keyword === '' ? '' : 'none';
        });
    });
}

// Khởi tạo mã giảm giá demo
function khoiTaoMaGiamGia() {
    const existingPromotions = JSON.parse(localStorage.getItem('promotions') || '[]');
    
    // Nếu đã có mã giảm giá rồi, không tạo lại
    if (existingPromotions.length > 0) {
        return;
    }
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const demoPromotions = [
        {
            id: 1,
            code: 'SALE20',
            name: 'Giảm 20%',
            type: 'percent',
            value: 20,
            startDate: today.toISOString().split('T')[0],
            endDate: nextMonth.toISOString().split('T')[0],
            description: 'Mã giảm giá 20% cho tất cả sản phẩm'
        },
        {
            id: 2,
            code: 'SAVE100K',
            name: 'Giảm 100K',
            type: 'amount',
            value: 100000,
            startDate: today.toISOString().split('T')[0],
            endDate: nextMonth.toISOString().split('T')[0],
            description: 'Mã giảm giá 100.000đ cho đơn hàng trên 200K'
        },
        {
            id: 3,
            code: 'FREESHIP',
            name: 'Miễn phí vận chuyển',
            type: 'percent',
            value: 100,
            startDate: today.toISOString().split('T')[0],
            endDate: nextMonth.toISOString().split('T')[0],
            description: 'Miễn phí vận chuyển cho tất cả đơn hàng'
        }
    ];
    
    localStorage.setItem('promotions', JSON.stringify(demoPromotions));
}
