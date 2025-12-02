let currentFilter = 'all';

/**
 * Render mã giảm giá
 * @param {string} filter - Loại filter ('all', 'active', 'expired', 'percent', 'amount')
 */
function renderPromos(filter = 'all') {
    const promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
    const promoList = document.getElementById('promo-list');

    if (promotions.length === 0) {
        promoList.innerHTML = `
            <div class="no-promos" style="grid-column: 1 / -1;">
                <i class="fas fa-inbox"></i>
                <h3>Không có mã giảm giá</h3>
                <p>Vui lòng quay lại sau để xem các mã giảm giá mới</p>
            </div>`;
        return;
    }

    let filteredPromos = promotions;

    if (filter === 'active') {
        filteredPromos = promotions.filter(p => new Date(p.endDate) > new Date());
    } else if (filter === 'expired') {
        filteredPromos = promotions.filter(p => new Date(p.endDate) <= new Date());
    } else if (filter === 'percent') {
        filteredPromos = promotions.filter(p => p.type === 'percent');
    } else if (filter === 'amount') {
        filteredPromos = promotions.filter(p => p.type === 'amount');
    }

    if (filteredPromos.length === 0) {
        promoList.innerHTML = `
            <div class="no-promos" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>Không tìm thấy mã giảm giá</h3>
                <p>Không có mã giảm giá phù hợp với bộ lọc của bạn</p>
            </div>`;
        return;
    }

    promoList.innerHTML = filteredPromos.map(promo => {
        const isActive = new Date(promo.endDate) > new Date();
        const badgeClass = isActive ? 'badge-active' : 'badge-expired';
        const badgeText = isActive ? 'Còn hiệu lực' : 'Đã hết hạn';

        return `
            <div class="promo-card">
                <div class="promo-card-header">
                    <div class="promo-code">${promo.code}</div>
                    <span class="promo-badge ${badgeClass}">${badgeText}</span>
                </div>
                <p class="promo-description">${promo.description || 'Mã giảm giá'}</p>
                <div class="promo-value">
                    ${promo.type === 'percent' ? promo.value + '%' : promo.value.toLocaleString() + '₫'}
                </div>
                <div class="promo-end-date">
                    <i class="fas fa-calendar"></i> Hết hạn: ${new Date(promo.endDate).toLocaleDateString('vi-VN')}
                </div>
                <button class="copy-btn" onclick="copyCode('${promo.code}')">
                    <i class="fas fa-copy"></i> Sao chép mã
                </button>
            </div>`;
    }).join('');
}

/**
 * Lọc mã giảm giá theo filter
 * @param {string} filter - Loại filter
 */
function filterPromos(filter) {
    currentFilter = filter;
    
    // Cập nhật active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderPromos(filter);
}

/**
 * Sao chép mã giảm giá vào clipboard
 * @param {string} code - Mã giảm giá
 */
function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        alert(`Đã sao chép mã: ${code}`);
    }).catch(() => {
        // Fallback cho trình duyệt cũ
        const temp = document.createElement('textarea');
        temp.value = code;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        alert(`Đã sao chép mã: ${code}`);
    });
}

// Load promotions on page load
document.addEventListener('DOMContentLoaded', function() {
    renderPromos();
});
