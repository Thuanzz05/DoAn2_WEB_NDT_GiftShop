document.addEventListener('DOMContentLoaded', function() {
    syncAccountsToCustomers(); // Đồng bộ accounts sang customers
    loadCustomers();
    setupForm();
    setupSearch();
});

// Đồng bộ tài khoản đã đăng ký sang danh sách khách hàng
function syncAccountsToCustomers() {
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    let hasNewCustomers = false;
    
    accounts.forEach(account => {
        // Kiểm tra xem account này có trong customers chưa
        if (!customers.some(c => c.email === account.email)) {
            const newCustomerId = customers.length > 0 ? Math.max(...customers.map(c => c.id || 0)) + 1 : 1;
            customers.push({
                id: newCustomerId,
                name: account.name,
                email: account.email,
                phone: account.phone || '',
                address: account.address || '',
                joinDate: account.joinDate || new Date().toISOString().split('T')[0]
            });
            hasNewCustomers = true;
            console.log('Đã thêm khách hàng từ account:', account.name);
        }
    });
    
    if (hasNewCustomers) {
        localStorage.setItem('customers', JSON.stringify(customers));
        console.log('Đã cập nhật danh sách khách hàng');
    }
}

function loadCustomers() {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const tbody = document.getElementById('customer-list');
    
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Chưa có khách hàng nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address || ''}</td>
            <td>${customer.joinDate || ''}</td>
            <td>
                <button class="btn-icon" onclick="editCustomer(${customer.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-danger" onclick="deleteCustomer(${customer.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function setupForm() {
    document.getElementById('customer-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveCustomer();
    });
}

function saveCustomer() {
    const id = document.getElementById('customer-id').value;
    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const joinDate = document.getElementById('customer-joindate').value || new Date().toISOString().split('T')[0];
    
    // Validate
    if (!name || !email || !phone) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ!');
        return;
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại phải là 10 chữ số!');
        return;
    }
    
    let customers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    if (id) {
        const index = customers.findIndex(c => c.id == id);
        if (index !== -1) {
            const oldCustomer = customers[index];
            customers[index] = { id: parseInt(id), name, email, phone, address, joinDate };
            alert('Đã cập nhật khách hàng!');
            
            // Đồng bộ ngược lại với accounts nếu khách hàng đã có tài khoản
            const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
            const accountIndex = accounts.findIndex(acc => acc.email === oldCustomer.email);
            if (accountIndex !== -1) {
                accounts[accountIndex].name = name;
                accounts[accountIndex].phone = phone;
                accounts[accountIndex].address = address;
                // Nếu email thay đổi, cập nhật email trong accounts và userData
                if (email !== oldCustomer.email) {
                    accounts[accountIndex].email = email;
                    // Cập nhật userData nếu đang đăng nhập
                    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
                    if (userData && userData.email === oldCustomer.email) {
                        userData.email = email;
                        userData.name = name;
                        userData.phone = phone;
                        userData.address = address;
                        localStorage.setItem('userData', JSON.stringify(userData));
                    }
                }
                localStorage.setItem('accounts', JSON.stringify(accounts));
            }
        }
    } else {
        const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
        customers.push({ id: newId, name, email, phone, address, joinDate });
        alert('Đã thêm khách hàng!');
    }
    
    localStorage.setItem('customers', JSON.stringify(customers));
    resetForm();
    loadCustomers();
}

function editCustomer(id) {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customer = customers.find(c => c.id == id);
    
    if (customer) {
        document.getElementById('customer-id').value = customer.id;
        document.getElementById('customer-name').value = customer.name;
        document.getElementById('customer-email').value = customer.email;
        document.getElementById('customer-phone').value = customer.phone;
        document.getElementById('customer-address').value = customer.address || '';
        document.getElementById('customer-joindate').value = customer.joinDate || '';
        document.getElementById('form-title').textContent = 'Chỉnh sửa khách hàng';
        document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteCustomer(id) {
    if (!confirm('Xóa khách hàng này?')) return;
    
    let customers = JSON.parse(localStorage.getItem('customers') || '[]');
    customers = customers.filter(c => c.id != id);
    localStorage.setItem('customers', JSON.stringify(customers));
    
    alert('Đã xóa khách hàng!');
    loadCustomers();
}

function resetForm() {
    document.getElementById('customer-form').reset();
    document.getElementById('customer-id').value = '';
    document.getElementById('form-title').textContent = 'Thêm khách hàng mới';
}

function setupSearch() {
    document.getElementById('search-input').addEventListener('input', function() {
        const keyword = this.value.toLowerCase();
        document.querySelectorAll('#customer-list tr').forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(keyword) || keyword === '' ? '' : 'none';
        });
    });
}

