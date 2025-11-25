// Lấy các phần tử
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const goToRegisterButton = document.getElementById('go-to-register');

// Chỉ chạy code nếu các element tồn tại
if (loginTab && registerTab && loginForm && registerForm) {
    document.addEventListener('DOMContentLoaded', function() {
        if (window.location.hash === '#register') {
            activateRegisterTab();
        }
    });

    function activateRegisterTab() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }

    function activateLoginTab() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    }

    loginTab.addEventListener('click', function() {
        activateLoginTab();
        history.pushState(null, null, 'login-register.html#login');
    });

    registerTab.addEventListener('click', function() {
        activateRegisterTab();
        history.pushState(null, null, 'login-register.html#register');
    });

    // XỬ LÝ ĐĂNG NHẬP
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailElement = document.getElementById('login-email');
        const passwordElement = document.getElementById('login-password');
        
        if (emailElement && passwordElement) {
            const emailOrUsername = emailElement.value.trim();
            const password = passwordElement.value;
            
            // Lấy danh sách tài khoản từ localStorage
            const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
            
            // Tìm tài khoản khớp
            const account = accounts.find(acc => 
                (acc.email === emailOrUsername || acc.name === emailOrUsername) && 
                acc.password === password
            );
            
            if (account) {
                // Lưu trạng thái đăng nhập
                const userData = {
                    isLoggedIn: true,
                    name: account.name,
                    email: account.email,
                    phone: account.phone || '',
                    address: account.address || '',
                    joinDate: account.joinDate
                };
                
                localStorage.setItem('userData', JSON.stringify(userData));
                
                alert('Đăng nhập thành công!');
                
                // Kiểm tra xem có redirect URL không (từ checkout)
                const redirectUrl = localStorage.getItem('redirectAfterLogin');
                if (redirectUrl) {
                    localStorage.removeItem('redirectAfterLogin'); // Xóa sau khi dùng
                    window.location.href = redirectUrl;
                } else {
                    window.location.href = "index.html";
                }
            } else {
                alert('Email/Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        }
    });

    // XỬ LÝ ĐĂNG KÝ
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameElement = document.getElementById('register-name');
        const emailElement = document.getElementById('register-email');
        const passwordElement = document.getElementById('register-password');
        const confirmElement = document.getElementById('register-confirm');
        
        if (nameElement && emailElement && passwordElement && confirmElement) {
            const name = nameElement.value.trim();
            const email = emailElement.value.trim();
            const password = passwordElement.value;
            const confirm = confirmElement.value;
            
            // Kiểm tra mật khẩu khớp
            if (password !== confirm) {
                alert('Mật khẩu không khớp!');
                return;
            }
            
            // Kiểm tra độ dài mật khẩu
            if (password.length < 6) {
                alert('Mật khẩu phải có ít nhất 6 ký tự!');
                return;
            }
            
            // Lấy danh sách tài khoản hiện có
            const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
            
            // Kiểm tra email đã tồn tại
            if (accounts.some(acc => acc.email === email)) {
                alert('Email này đã được đăng ký!');
                return;
            }
            
            // Kiểm tra tên đã tồn tại
            if (accounts.some(acc => acc.name === name)) {
                alert('Tên người dùng này đã tồn tại!');
                return;
            }
            
            // Tạo tài khoản mới
            const newAccount = {
                name: name,
                email: email,
                password: password,
                phone: '',
                address: '',
                joinDate: new Date().toLocaleDateString('vi-VN')
            };
            
            // Thêm vào danh sách và lưu
            accounts.push(newAccount);
            localStorage.setItem('accounts', JSON.stringify(accounts));
            
            // Đồng bộ với danh sách customers của admin
            const customers = JSON.parse(localStorage.getItem('customers') || '[]');
            // Kiểm tra xem đã có trong customers chưa (theo email)
            if (!customers.some(c => c.email === email)) {
                const newCustomerId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
                customers.push({
                    id: newCustomerId,
                    name: name,
                    email: email,
                    phone: '',
                    address: '',
                    joinDate: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
                });
                localStorage.setItem('customers', JSON.stringify(customers));
            }
            
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            
            // Chuyển sang tab đăng nhập
            activateLoginTab();
            registerForm.reset();
        }
    });
}
// Xử lý sự kiện click cho nút đăng ký trên thanh điều hướng
// if (goToRegisterButton) {
//     goToRegisterButton.addEventListener('click', function(e) {
        
//     });
// }


// HIỂN THỊ TÊN NGƯỜI DÙNG TRÊN INDEX.HTML
// Chạy khi trang index.html load
document.addEventListener('DOMContentLoaded', function() {
    updateUserDisplay();
});

// Hàm cập nhật hiển thị tên người dùng
function updateUserDisplay() {
    const userData = localStorage.getItem('userData');
    
    if (userData) {
        try {
            const user = JSON.parse(userData);
            
            if (user.isLoggedIn) {
                // Tìm phần tử dropdown account
                const accountDropdown = document.querySelector('.account-dropdown');
                
                if (accountDropdown) {
                    const accountLink = accountDropdown.querySelector('a');
                    const accountSubmenu = accountDropdown.querySelector('.account-submenu');
                    
                    if (accountLink && accountSubmenu) {
                        // Thay đổi text hiển thị
                        accountLink.innerHTML = `<i class="fas fa-user-circle"></i> ${user.name} <i class="fas fa-angle-down"></i>`;
                        
                        // Thay đổi menu con
                        accountSubmenu.innerHTML = `
                            <li><a href="account.html"><i class="fas fa-user-circle"></i> Quản lý tài khoản</a></li>
                            <li><a href="#" onclick="handleLogoutFromIndex()"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>
                        `;
                    }
                }
            }
        } catch (e) {
            console.error('Lỗi parse userData:', e);
        }
    }
}

// Hàm đăng xuất từ trang index
function handleLogoutFromIndex() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('userData');
        alert('Đăng xuất thành công!');
        window.location.reload();
    }
}