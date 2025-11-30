// Kiểm tra trạng thái đăng nhập và cập nhật menu
function updateMenuByLoginStatus() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const isLoggedIn = userData && userData.isLoggedIn;
    
    const accountDropdown = document.querySelector('.account-dropdown');
    const accountSubmenu = document.querySelector('.account-submenu');
    const accountLink = accountDropdown?.querySelector('a');
    
    if (accountDropdown && accountSubmenu && accountLink) {
        if (isLoggedIn) {
            // Đã đăng nhập: Hiển thị tên người dùng, hiện "Quản lý tài khoản", ẩn "Đăng ký"
            accountLink.innerHTML = `<i class="fas fa-user"></i> ${userData.name} <i class="fas fa-angle-down"></i>`;
            
            accountSubmenu.innerHTML = `
                <li><a href="account.html"><i class="fas fa-user-circle"></i> Quản lý tài khoản</a></li>
                <li><a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a></li>`;
            
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
            // Chưa đăng nhập: Hiện chữ "Tài khoản", hiển thị "Đăng nhập" và "Đăng ký"
            accountLink.innerHTML = `<i class="fas fa-user"></i> Tài khoản <i class="fas fa-angle-down"></i>`;
            
            accountSubmenu.innerHTML = `
                <li><a href="login-register.html"><i class="fas fa-sign-in-alt"></i> Đăng nhập</a></li>
                <li><a href="login-register.html#register" id="go-to-register"><i class="fas fa-user-plus"></i> Đăng ký</a></li>
            `;
        }
    }
}

// Gọi hàm khi load trang
document.addEventListener('DOMContentLoaded', function() {
    updateMenuByLoginStatus();
    setupSearchForm();
});

// Setup xử lý form tìm kiếm
function setupSearchForm() {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            const query = searchInput.value.trim();
            
            if (query) {
                // Redirect tới trang search-results với query parameter
                window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
            }
        });
    }
}


// --slideshow--
var n = 5;
var i = 1;

function next(){
    if(i==n)
        i = 1;
    else
        i++;
    
    document.getElementById("slide").setAttribute("src","images/slide_"+i+".png")
}

function back(){
    if(i==1)
        i = n;
    else
        i--;
    
    document.getElementById("slide").setAttribute("src","images/slide_"+i+".png")
}

function autoPlay(){
    setInterval(next,3000);
}

// --back to top--
$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#backtop').fadeIn();
        } else {
            $('#backtop').fadeOut();
        }
    });
    $('#backtop').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });
});

// sk cuộn trang để ghim menu
window.onscroll = function() {
    const header = document.getElementById('header-bot');
    const sticky = header.offsetTop;

    if (window.pageYOffset > sticky) { 
        header.classList.add('fixed');
    } else {
        header.classList.remove('fixed');
    }
};

// Thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} đã được thêm vào giỏ hàng!`);
}

// Hàm cập nhật số lượng giỏ hàng hiển thị
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        if (cartLink.textContent.includes('(')) {
            cartLink.textContent = cartLink.textContent.replace(/\(\d+\)/, `(${totalItems})`);
        } else {
            cartLink.innerHTML = `${cartLink.innerHTML} (${totalItems})`;
        }
    }
}

// ===== LOAD TRANG =====
document.addEventListener('DOMContentLoaded', function() {
	// Xử lý account dropdown cho mobile
	const accountDropdown = document.querySelector('.account-dropdown');
	if (accountDropdown) {
		const accountLink = accountDropdown.querySelector('a');
		
		accountLink.addEventListener('click', function(e) {
			if (window.innerWidth <= 768) {
				e.preventDefault();
				accountDropdown.classList.toggle('active');
				
				const icon = this.querySelector('.fa-angle-down');
				if (icon) {
					if (accountDropdown.classList.contains('active')) {
						icon.style.transform = 'rotate(180deg)';
					} else {
						icon.style.transform = 'rotate(0deg)';
					}
				}
			}
		});
	}
	
    
    // 1. XỬ LÝ MENU VÀ SIDEBAR CHO MOBILE
    const menuContainer = document.querySelector('#menu .container');
    if (menuContainer) {
        const menuToggle = document.createElement('div');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i> Menu chính';

        const headerBot = document.getElementById('header-bot');
        if (headerBot) {
            headerBot.insertBefore(menuToggle, headerBot.firstChild);
        }

        menuToggle.addEventListener('click', function() {
            menuContainer.classList.toggle('menu-active');
            const icon = this.querySelector('i');
            if (menuContainer.classList.contains('menu-active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }

    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        const sidebarToggle = document.createElement('div');
        sidebarToggle.className = 'sidebar-toggle';
        sidebarToggle.innerHTML = '<i class="fas fa-th-list"></i> Danh mục';

        if (sidebar.parentNode) {
            sidebar.parentNode.insertBefore(sidebarToggle, sidebar);
        }

        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('sidebar-active');
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('sidebar-active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-th-list';
            }
        });
    }

    // Xử lý dropdown cho menu mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.parentNode.classList.toggle('dropdown-active');
                
                const icon = this.querySelector('i');
                if (this.parentNode.classList.contains('dropdown-active')) {
                    icon.className = 'fas fa-angle-up';
                } else {
                    icon.className = 'fas fa-angle-down';
                }
            }
        });
    });

    // 2. XỬ LÝ THÊM SẢN PHẨM VÀO GIỎ HÀNG - SẢN PHẨM BÁN CHẠY & SẢN PHẨM MỚI
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productItem = this.closest('.product-item') || this.closest('.new-product-item');
            
            if (productItem) {
                const productNameElement = productItem.querySelector('.product-name a') || 
                                         productItem.querySelector('.new-product-name a');
                
                if (!productNameElement) {
                    console.error('Không tìm thấy tên sản phẩm');
                    return;
                }
                
                const productName = productNameElement.textContent.trim();
                const productImage = productItem.querySelector('img').src;
                const priceElement = productItem.querySelector('.current-price');
                
                if (!priceElement) {
                    console.error('Không tìm thấy giá sản phẩm');
                    return;
                }
                
                const priceText = priceElement.textContent;
                const productPrice = parseInt(priceText.replace(/\D/g, ''));
                const productId = productName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };
                
                addToCart(product);
            } else {
                console.error('Không tìm thấy thông tin sản phẩm');
            }
        });
    });

    // 3. XỬ LÝ FLASH SALE CAROUSEL
    let currentSlide = 0;
    const totalSlides = 2;

    const productsWrapper = document.getElementById('productsWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function updateSlide() {
        if (!productsWrapper || !prevBtn || !nextBtn) return;
        
        productsWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
        prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // 4. XỬ LÝ THÊM SẢN PHẨM FLASH SALE VÀO GIỎ HÀNG
    const flashSaleAddToCartBtns = document.querySelectorAll('.fs-add-to-cart-btn');
    
    flashSaleAddToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const productCard = this.closest('.fs-product-card');
            if (!productCard) {
                console.error('Không tìm thấy fs-product-card');
                return;
            }

            const productNameElement = productCard.querySelector('.fs-product-name');
            const productImageElement = productCard.querySelector('.fs-product-image');
            const priceElement = productCard.querySelector('.fs-current-price');
            
            if (!productNameElement || !productImageElement || !priceElement) {
                console.error('Không tìm thấy các element cần thiết trong Flash Sale card');
                return;
            }

            const productName = productNameElement.textContent.trim();
            const productImage = productImageElement.src;
            const priceText = priceElement.textContent;
            const productPrice = parseInt(priceText.replace(/\D/g, ''));
            const productId = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            addToCart(product);

            // // Hiệu ứng visual feedback
            // const originalContent = this.innerHTML;
            // this.innerHTML = '<i class="fas fa-check"></i> Đã thêm!';
            // this.style.background = '#28a745';
            // this.style.borderColor = '#28a745';
            // this.style.color = 'white';
            
            // setTimeout(() => {
            //     this.innerHTML = originalContent;
            //     this.style.background = 'transparent';
            //     this.style.borderColor = '#c94a52';
            //     this.style.color = '#c94a52';
            // }, 2000);
        });
    });
    
    // 5. KHỞI TẠO CAROUSEL
    updateSlide();

    // 6. HỖ TRỢ TOUCH/SWIPE TRÊN MOBILE
    let touchStartX = 0;
    let touchEndX = 0;

    const flashSaleSection = document.getElementById('flash-sale-christmas');
    if (flashSaleSection) {
        flashSaleSection.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        flashSaleSection.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 50) nextSlide();
            if (touchEndX > touchStartX + 50) prevSlide();
        });
    }

    // 7. AUTO-PLAY CAROUSEL
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(function() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateSlide();
        }, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    startAutoPlay();
    
    if (flashSaleSection) {
        flashSaleSection.addEventListener('mouseenter', stopAutoPlay);
        flashSaleSection.addEventListener('mouseleave', startAutoPlay);
    }

    // 8. CẬP NHẬT SỐ LƯỢNG GIỎ HÀNG KHI LOAD TRANG
    updateCartCount();
});




// Khởi tạo 18 sản phẩm demo từ HTML vào localStorage
// ID 100-107: SẢN PHẨM BÁN CHẠY (8 sản phẩm)
// ID 108-117: SẢN PHẨM MỚI (10 sản phẩm)
function khoiTaoSanPhamCu() {
    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Chỉ khởi tạo nếu chưa có sản phẩm nào hoặc chỉ có sản phẩm từ admin (ID < 100)
    const hasOldProducts = existingProducts.some(p => p.id >= 100);
    
    if (hasOldProducts) return; // Đã khởi tạo rồi, không cần làm lại
    
    // ============ SẢN PHẨM BÁN CHẠY (ID 100-107) ============
    const sanPhamBanChay = [
        {
            id: 100,
            name: 'Set 4 mô hình em bé hổ tài lộc lắc đầu biểu cảm',
            price: 180000,
            image: 'images/product1.webp',
            categoryId: 3,
            stock: 999,
            description: 'Set 4 mô hình em bé hổ tài lộc lắc đầu biểu cảm dễ thương nhiều màu sắc trang trí nhà cửa, bàn làm việc. Sản phẩm làm từ chất liệu nhựa cao cấp, bền đẹp theo thời gian.',
            section: 'bestsellers' // Đánh dấu từ SẢN PHẨM BÁN CHẠY
        },
        {
            id: 101,
            name: 'Mô hình tượng Shin bút chì cosplay Phật Tổ',
            price: 300000,
            image: 'images/product2.webp',
            categoryId: 6,
            stock: 999,
            description: 'Mô hình tượng Shin bút chì cosplay Phật Tổ vô cùng độc đáo và dễ thương. Sản phẩm làm từ chất liệu cao cấp, màu sắc tươi sáng.',
            section: 'bestsellers'
        },
        {
            id: 102,
            name: 'Set 6 mô hình lợn hồng heo hồng đế bàn mini',
            price: 70000,
            image: 'images/product3.webp',
            categoryId: 3,
            stock: 999,
            description: 'Set 6 mô hình lợn hồng heo hồng đế bàn mini dễ thương. Thiết kế nhỏ gọn, vừa vặn trên bàn làm việc hoặc bàn học.',
            section: 'bestsellers'
        },
        {
            id: 103,
            name: 'Mô hình mông Silicon Gấu Thỏ Chó Heo Rắp đồ chơi',
            price: 75000,
            image: 'images/product4.webp',
            categoryId: 3,
            stock: 999,
            description: 'Mô hình mông Silicon Gấu Thỏ Chó Heo Rắp đồ chơi. Chất liệu silicone mềm mại, an toàn cho trẻ em. Hình dáng dễ thương, sinh động.',
            section: 'bestsellers'
        },
        {
            id: 104,
            name: 'Tượng mèo thần tài trắng khăn xanh',
            price: 130000,
            image: 'images/product5.webp',
            categoryId: 5,
            stock: 999,
            description: 'Tượng mèo thần tài trắng khăn xanh may mắn. Hình tượng truyền thống, mang lại may mắn và tài lộc. Thiết kế tinh tế, phù hợp để trang trí.',
            section: 'bestsellers'
        },
        {
            id: 105,
            name: 'Mô hình Blind Box mèo Xiêm Thái Lan',
            price: 63000,
            image: 'images/product6.webp',
            categoryId: 6,
            stock: 999,
            description: 'Mô hình Blind Box mèo Xiêm Thái Lan độc đáo. Mỗi hộp là một bất ngờ, có thể nhận được nhiều mẫu khác nhau.',
            section: 'bestsellers'
        },
        {
            id: 106,
            name: 'Set 4 mô hình mèo thần tài tròn',
            price: 60000,
            image: 'images/product7.webp',
            categoryId: 5,
            stock: 999,
            description: 'Set 4 mô hình mèo thần tài tròn may mắn. Bộ sưu tập 4 mèo với màu sắc khác nhau, mang lại không khí vui vẻ.',
            section: 'bestsellers'
        },
        {
            id: 107,
            name: 'Mô hình 4 mèo thần tài may mắn',
            price: 50000,
            image: 'images/product8.webp',
            categoryId: 5,
            stock: 999,
            description: 'Mô hình 4 mèo thần tài may mắn. Tập hợp 4 chú mèo với biểu cảm dễ thương, phù hợp làm quà tặng.',
            section: 'bestsellers'
        }
    ];
    
    // ============ SẢN PHẨM MỚI (ID 108-117) ============
    const sanPhamMoi = [
        {
            id: 108,
            name: 'Set mô hình Shiba thần tài hoa anh đào',
            price: 150000,
            image: 'images/new-product1.webp',
            categoryId: 1,
            stock: 999,
            description: 'Set mô hình Shiba thần tài hoa anh đào độc đáo. Kết hợp giữa chó Shiba dễ thương và hoa anh đào, mang lại cảm giác mùa xuân.',
            section: 'newproducts' // Đánh dấu từ SẢN PHẨM MỚI
        },
        {
            id: 109,
            name: 'Set 3 mô hình chú vịt vàng cosplay Phi công',
            price: 210000,
            image: 'images/new-product2.webp',
            categoryId: 2,
            stock: 999,
            description: 'Set 3 mô hình chú vịt vàng cosplay Phi công. Hình ảnh độc đáo, mang tính hài hước. Phù hợp làm quà tặng vui vẻ.',
            section: 'newproducts'
        },
        {
            id: 110,
            name: 'Set 4 mô hình cừu Dory',
            price: 215000,
            image: 'images/new-product3.webp',
            categoryId: 2,
            stock: 999,
            description: 'Set 4 mô hình cừu Dory. Bộ sưu tập 4 chú cừu với biểu cảm khác nhau, thích hợp để sưu tầm.',
            section: 'newproducts'
        },
        {
            id: 111,
            name: 'Set mô hình Phúc Lộc Thọ Thần Tài',
            price: 80000,
            image: 'images/new-product4.webp',
            categoryId: 5,
            stock: 999,
            description: 'Set mô hình Phúc Lộc Thọ Thần Tài. Tượng truyền thống mang ý nghĩa may mắn, tài lộc, sức khỏe. Quà tặng ý nghĩa cho gia đình.',
            section: 'newproducts'
        },
        {
            id: 112,
            name: 'Mô hình gấu dâu Lotso mini',
            price: 204000,
            image: 'images/new-product5.webp',
            categoryId: 2,
            stock: 999,
            description: 'Mô hình gấu dâu Lotso mini. Hình gấu bông dâu rất dễ thương, nhỏ gọn, dễ mang theo. Quà tặng hoàn hảo cho bé yêu.',
            section: 'newproducts'
        },
        {
            id: 113,
            name: 'Set 4 mô hình thần tài trắng vui vẻ',
            price: 183000,
            image: 'images/new-product6.webp',
            categoryId: 5,
            stock: 999,
            description: 'Set 4 mô hình thần tài trắng vui vẻ. Bộ sưu tập tượng thần tài trắng với biểu cảm tươi cười, trang trí phòng khách.',
            section: 'newproducts'
        },
        {
            id: 114,
            name: 'Mô hình gấu trúc Panda vịt vàng',
            price: 150000,
            image: 'images/new-product7.webp',
            categoryId: 2,
            stock: 999,
            description: 'Mô hình gấu trúc Panda vịt vàng. Sự kết hợp dễ thương giữa gấu trúc và vịt vàng, mang đến cảm giác vui vẻ.',
            section: 'newproducts'
        },
        {
            id: 115,
            name: 'Tượng mèo thần tài trắng khăn xanh (Mẫu 2)',
            price: 130000,
            image: 'images/new-product8.webp',
            categoryId: 5,
            stock: 999,
            description: 'Tượng mèo thần tài trắng khăn xanh mẫu 2. Phiên bản khác của mèo thần tài may mắn, khác biệt trong chi tiết thiết kế.',
            section: 'newproducts'
        },
        {
            id: 116,
            name: 'Set mô hình 5 Ông già Noel dễ thương',
            price: 140000,
            image: 'images/new-product9.webp',
            categoryId: 4,
            stock: 999,
            description: 'Set mô hình 5 Ông già Noel dễ thương. Bộ sưu tập các mẫu Ông già Noel với biểu cảm vui vẻ, phù hợp cho mùa lễ.',
            section: 'newproducts'
        },
        {
            id: 117,
            name: 'Đèn led Quả cầu tuyết Ông già Noel, Tuần lộc',
            price: 180000,
            image: 'images/new-product10.webp',
            categoryId: 4,
            stock: 999,
            description: 'Đèn led Quả cầu tuyết Ông già Noel, Tuần lộc. Đèn trang trí lễ hội với hình ảnh ấm cúng, thích hợp cho mùa giáng sinh.',
            section: 'newproducts'
        }
    ];
    
    // Thêm các sản phẩm demo vào danh sách
    const allProducts = [...existingProducts, ...sanPhamBanChay, ...sanPhamMoi];
    localStorage.setItem('products', JSON.stringify(allProducts));
}

// Xóa những sản phẩm lỗi (không có ảnh hợp lệ)
function xoaSanPhamLoi() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Giữ lại các sản phẩm có trường ảnh hợp lệ.
    // Trường hợp sản phẩm admin không nhập ảnh sẽ được gán ảnh mặc định,
    // không nên xóa sản phẩm chỉ vì dùng ảnh mặc định.
    const validProducts = products.filter(product => {
        // Nếu không có trường image (undefined/null/empty) thì loại bỏ
        if (!product.image || String(product.image).trim() === '') {
            return false;
        }

        // Người quản trị có thể để ảnh mặc định 'default-product.jpg' — vẫn giữ lại
        return true;
    });
    
    // Nếu có sản phẩm bị lỗi, cập nhật localStorage
    if (validProducts.length < products.length) {
        localStorage.setItem('products', JSON.stringify(validProducts));
    }
}

// Load sản phẩm khi trang chủ load
document.addEventListener('DOMContentLoaded', function() {
    khoiTaoDanhMucMacDinh(); // Đảm bảo có 10 danh mục mặc định
    khoiTaoSanPhamCu(); // Khởi tạo 18 sản phẩm demo (100-117)
    khoiTaoFlashSaleProducts(); // Khởi tạo 8 sản phẩm Flash Sale
    xoaSanPhamLoi(); // Xóa những sản phẩm lỗi/không hợp lệ
    khoiTaoMaGiamGia(); // Khởi tạo mã giảm giá demo
    taiDanhMuc();
    
    // Delay taiSanPhamTuAdmin để đảm bảo DOM hoàn toàn render
    setTimeout(function() {
        taiSanPhamTuAdmin();
    }, 100);
});

// Load sản phẩm từ localStorage (chỉ thêm sản phẩm admin vào "SẢN PHẨM MỚI")
function taiSanPhamTuAdmin() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Lọc chỉ lấy sản phẩm admin (ID < 100), bỏ qua sản phẩm demo (ID 100-117 và Flash Sale)
    const adminProducts = products.filter(p => {
        return typeof p.id === 'number' && p.id < 100 && !String(p.id).startsWith('fs');
    });
    
    console.log('Admin products found:', adminProducts.length);

    const newProductGrid = document.querySelector('#new-products .new-products-grid');
    if (!newProductGrid) {
        console.log('Could not find new-products-grid element');
        return;
    }

    // Xóa các sản phẩm admin đã chèn trước đó để tránh trùng lặp khi gọi lại
    const existingAdminNodes = newProductGrid.querySelectorAll('.new-product-item.admin-added');
    existingAdminNodes.forEach(node => node.remove());

    if (adminProducts.length === 0) {
        console.log('Chưa có sản phẩm nào từ admin');
        return;
    }

    // Thêm sản phẩm admin vào đầu danh sách (đánh dấu bằng class 'admin-added')
    adminProducts.forEach(product => {
        // tạo DOM từ chuỗi HTML và đánh dấu
        const wrapper = document.createElement('div');
        wrapper.innerHTML = createNewProductCard(product).trim();
        const el = wrapper.firstElementChild;
        if (el) {
            el.classList.add('admin-added');
            el.setAttribute('data-admin-id', product.id);
            newProductGrid.insertBefore(el, newProductGrid.firstChild);
            console.log('Inserted admin product into DOM:', product.id, product.name);
        }
    });
    console.log('Added admin products to new products section');
}

// Lắng nghe sự thay đổi localStorage (ứng dụng khi thêm sản phẩm trên tab/admin khác)
window.addEventListener('storage', function(e) {
    if (e.key === 'products') {
        taiSanPhamTuAdmin();
    }
});

// Ensure admin products are rendered also on full load / pageshow (covers reloads and navigation)
window.addEventListener('load', function() {
    setTimeout(function() {
        taiSanPhamTuAdmin();
    }, 200);
});

window.addEventListener('pageshow', function() {
    setTimeout(function() {
        taiSanPhamTuAdmin();
    }, 200);
});

// Tạo HTML card sản phẩm mới (với fallback cho trường bị thiếu)
function createNewProductCard(product) {
    const imageUrl = product.image || 'images/default-product.jpg';
    const productName = product.name || 'Sản phẩm không tên';
    const price = product.price ? parseInt(product.price).toLocaleString('vi-VN') : '0';
    const oldPrice = product.oldPrice ? parseInt(product.oldPrice).toLocaleString('vi-VN') : null;
    const productId = product.id;
    
    const priceHTML = oldPrice && product.oldPrice > product.price
        ? `<span class="current-price">${price}₫</span><span class="old-price">${oldPrice}₫</span>`
        : `<span class="current-price">${price}₫</span>`;
    
    return `
        <div class="new-product-item">
            <div class="new-product-image">
                <a href="product-detail.html?id=${productId}">
                    <img src="${imageUrl}" alt="${productName}" onerror="this.src='images/default-product.jpg'">
                    <span class="new-tag">New</span>
                </a>
                <div class="new-product-buttons">
                    <button class="add-to-cart" data-product-id="${productId}">
                        <i class="fa fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
            <div class="new-product-info">
                <h3 class="new-product-name">
                    <a href="product-detail.html?id=${productId}">${productName}</a>
                </h3>
                <div class="new-product-price">
                    ${priceHTML}
                </div>
            </div>
        </div>
    `;
}

// Xử lý thêm vào giỏ hàng cho sản phẩm động
document.addEventListener('click', function(e) {
    if (e.target.closest('.add-to-cart')) {
        const button = e.target.closest('.add-to-cart');
        const productId = button.getAttribute('data-product-id');
        
        if (productId) {
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const product = products.find(p => p.id == productId);
            
            if (product) {
                const cartProduct = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                };
                
                addToCart(cartProduct);
            }
        }
    }
});

// Khởi tạo Flash Sale products
function khoiTaoFlashSaleProducts() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Kiểm tra xem Flash Sale products đã có không
    const flashSaleExists = products.some(p => p.id && typeof p.id === 'string' && p.id.startsWith('fs-'));
    
    if (!flashSaleExists) {
        const flashSaleProducts = [
            { id: 'fs-1', name: 'Bộ đồ chơi lego lắp ráp chủ đề Giáng Sinh', price: 200000, oldPrice: 250000, discount: -20, image: 'images/flash_sale_1.webp', sold: 205, progress: 82, description: 'Bộ đồ chơi lego cao cấp lắp ráp chủ đề Giáng Sinh, phù hợp cho trẻ em và người lớn. Gồm các mô hình trang trí Noel, cây thông, ông già Noel và nhiều chi tiết khác. Chất liệu an toàn, không độc hại.', category: 'Đồ chơi' },
            { id: 'fs-2', name: 'Set mô hình 5 Ông già Noel dễ thương', price: 140000, oldPrice: 200000, discount: -30, image: 'images/flash_sale_2.webp', sold: 55, progress: 55, description: 'Set 5 mô hình ông già Noel dễ thương với các biểu cảm khác nhau. Chất liệu PVC cao cấp, màu sắc sáng, độc đáo. Dùng để trang trí nhà cửa, cửa hàng, bàn làm việc.', category: 'Trang trí' },
            { id: 'fs-3', name: 'Cốc ly hình cây thông Giáng Sinh 3D', price: 160000, oldPrice: 200000, discount: -20, image: 'images/flash_sale_3.webp', sold: 90, progress: 72, description: 'Cốc ly hình cây thông Giáng Sinh 3D với thiết kế độc đáo, nắp và khay giữ. Chất liệu sứ cao cấp, in hình đẹp mắt, không độc hại. Phù hợp làm quà tặng.', category: 'Cốc tách' },
            { id: 'fs-4', name: 'Cốc ly sứ Christmas hộp quà tặng ngôi sao', price: 200000, oldPrice: 300000, discount: -33, image: 'images/flash_sale_4.webp', sold: 52, progress: 52, description: 'Cốc ly sứ cao cấp với họa tiết Christmas ngôi sao lấp lánh. Đi kèm hộp quà đẹp, in logo nhãn hiệu. Dùng đựng nước, cà phê, trà, là quà tặng tuyệt vời.', category: 'Cốc tách' },
            { id: 'fs-5', name: 'Đèn LED trang trí cây thông Giáng Sinh', price: 150000, oldPrice: 200000, discount: -25, image: 'images/flash_sale_5.webp', sold: 85, progress: 68, description: 'Đèn LED trang trí cây thông Giáng Sinh với 100 bóng LED sáng đa màu, dây dài 10m. Tiết kiệm điện, sáng lâu, an toàn tuyệt đối. Chế độ nhấp nháy tự động.', category: 'Trang trí' },
            { id: 'fs-6', name: 'Set hộp quà trang trí Noel cao cấp', price: 180000, oldPrice: 300000, discount: -40, image: 'images/flash_sale_6.webp', sold: 45, progress: 45, description: 'Set 3 hộp quà trang trí Noel cao cấp với họa tiết đặc biệt, màu sắc rực rỡ. Chất liệu carton dày, bền bỉ. Dùng đựng quà tặng hoặc trang trí nhà cửa.', category: 'Hộp quà' },
            { id: 'fs-7', name: 'Tất treo Giáng Sinh họa tiết đáng yêu', price: 85000, oldPrice: 100000, discount: -15, image: 'images/flash_sale_7.webp', sold: 95, progress: 76, description: 'Tất treo Giáng Sinh họa tiết đáng yêu với màu đỏ, xanh, trắng. Chất liệu cotton mềm mại, ấm áp. Treo trên cây thông, tường, cửa sổ để trang trí.', category: 'Trang trí' },
            { id: 'fs-8', name: 'Set chuông vàng trang trí Giáng Sinh', price: 130000, oldPrice: 200000, discount: -35, image: 'images/flash_sale_8.webp', sold: 60, progress: 60, description: 'Set 5 chuông vàng trang trí Giáng Sinh với âm thanh rung chuông dễ nghe. Chất liệu kim loại cao cấp, bền bỉ, sáng bóng. Treo trên cây thông hoặc tường.', category: 'Trang trí' }
        ];
        
        flashSaleProducts.forEach(product => {
            products.push(product);
        });
        localStorage.setItem('products', JSON.stringify(products));
    }
}


// Khởi tạo 10 danh mục mặc định - chỉ tạo lần đầu khi chưa có
function khoiTaoDanhMucMacDinh() {
    const danhMucHienTai = JSON.parse(localStorage.getItem('categories') || '[]');
    
    // Chỉ tạo danh mục mặc định khi chưa có danh mục nào
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

// Load và hiển thị danh mục từ admin
function taiDanhMuc() {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    
    // 1. Cập nhật sidebar
    const sidebarList = document.querySelector('#sidebar ul');
    if (sidebarList) {
        sidebarList.innerHTML = categories.map(cat => `
            <li><a href="category-products.html?id=${cat.id}">${cat.name}</a></li>
        `).join('');
    }
    
    // 2. Cập nhật category-list (nếu đang ở trang category)
    const categoryList = document.querySelector('#sidebar .category-list');
    if (categoryList) {
        categoryList.innerHTML = categories.map(cat => `
            <li><a href="category-products.html?id=${cat.id}">${cat.name}</a></li>
        `).join('');
    }
}

// Load sản phẩm theo danh mục (cho trang category-products.html)
function taiSanPhamTheoDanhMuc() {
    const categoryId = new URLSearchParams(window.location.search).get('id');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Nếu không có category ID, hiển thị danh mục đầu tiên
    const actualCategoryId = categoryId || '1';
    const category = categories.find(c => c.id == actualCategoryId);
    
    // Cập nhật tiêu đề danh mục
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle && category) {
        categoryTitle.textContent = category.name;
    }
    
    // Lọc sản phẩm theo danh mục
    const filteredProducts = products.filter(p => p.categoryId == actualCategoryId);
    
    // Tìm container sản phẩm
    const productsContainer = document.querySelector('.category-products');
    if (!productsContainer) return;
    
    // Xóa sản phẩm cũ
    productsContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p style="text-align: center; padding: 40px;">Chưa có sản phẩm trong danh mục này</p>';
        return;
    }
    
    // Thêm sản phẩm vào trang
    filteredProducts.forEach(product => {
        const productHTML = `
            <div class="product-item">
                <div class="product-image">
                    <a href="product-detail.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/default-product.jpg'">
                    </a>
                    <div class="product-buttons">
                        <button class="add-to-cart" data-product-id="${product.id}">
                            <i class="fa fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">
                        <a href="product-detail.html?id=${product.id}">${product.name}</a>
                    </h3>
                    <div class="product-price">
                        <span class="current-price">${product.price.toLocaleString('vi-VN')}₫</span>
                    </div>
                </div>
            </div>
        `;
        productsContainer.insertAdjacentHTML('beforeend', productHTML);
    });
    
    // Gắn event listener cho các nút "Thêm vào giỏ"
    document.querySelectorAll('.product-buttons .add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const product = products.find(p => p.id == productId);
            if (product) {
                addToCart(product);
            }
        });
    });
}

// Gọi hàm tải sản phẩm theo danh mục khi trang category-products load
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem đang ở trang nào
    if (window.location.pathname.includes('category-products')) {
        taiSanPhamTheoDanhMuc();
    }
});

