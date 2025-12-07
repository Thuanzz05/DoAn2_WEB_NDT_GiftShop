# 📱 HƯỚNG DẪN HỆ THỐNG NDT GIFT SHOP - CHI TIẾT

## 📋 MỤC LỤC
1. [Tổng quan kiến trúc](#tổng-quan-kiến-trúc)
2. [Các trang chính](#các-trang-chính)
3. [Hệ thống dữ liệu (localStorage)](#hệ-thống-dữ-liệu-localstorage)
4. [Chi tiết chức năng chính](#chi-tiết-chức-năng-chính)
5. [Bảng chỉ dẫn code](#bảng-chỉ-dẫn-code)

> 📌 **Lưu ý**: Đây là tài liệu chi tiết với các đoạn code cụ thể giúp bạn hiểu rõ cách mỗi tính năng hoạt động

---

## 🏗️ TỔNG QUAN KIẾN TRÚC

### Kiến trúc tổng quát:
```
NDT GIFT SHOP (Client-side only - không có backend)
│
├─ Trang Public (User views)
│  ├─ index.html (Trang chủ)
│  ├─ product-detail.html (Chi tiết sản phẩm)
│  ├─ category-products.html (Sản phẩm theo danh mục)
│  ├─ cart.html (Giỏ hàng)
│  ├─ checkout.html (Thanh toán)
│  ├─ login-register.html (Đăng nhập/Đăng ký)
│  ├─ account.html (Quản lý tài khoản)
│  ├─ search-results.html (Kết quả tìm kiếm)
│  ├─ promotions.html (Khuyến mãi)
│  ├─ about-us.html (Giới thiệu)
│  └─ news.html (Tin tức)
│
├─ Trang Admin (Quản lý)
│  ├─ admin-login.html (Đăng nhập admin)
│  ├─ admin-dashboard.html (Tổng quan)
│  ├─ admin-products.html (Quản lý sản phẩm)
│  ├─ admin-categories.html (Quản lý danh mục)
│  ├─ admin-customers.html (Quản lý khách hàng)
│  ├─ admin-orders.html (Quản lý đơn hàng)
│  └─ admin-promotions.html (Quản lý khuyến mãi)
│
├─ Scripts (JavaScript)
│  ├─ scriptIndex.js (Trang chủ: hiển thị sản phẩm, carousel, tìm kiếm)
│  ├─ scriptProduct-detail.js (Chi tiết sản phẩm: hiển thị info, add to cart)
│  ├─ scriptCart.js (Giỏ hàng: update quantity, remove)
│  ├─ scriptCheckout.js (Thanh toán: validate, tạo đơn hàng)
│  ├─ scriptFlashSale.js (Flash Sale: thêm giỏ hàng)
│  ├─ scriptCategory-products.js (Danh mục: filter sản phẩm)
│  ├─ scriptSearchResults.js (Tìm kiếm: hiển thị kết quả)
│  ├─ scriptAccount.js (Tài khoản: quản lý profile, đơn hàng)
│  ├─ scriptLogin-register.js (Xác thực: đăng nhập, đăng ký)
│  ├─ scriptPromotions.js (Khuyến mãi: filter, copy code)
│  └─ admin/ (Các script admin)
│
├─ Styles (CSS)
│  ├─ styleIndex.css (Trang chủ)
│  ├─ styleProduct-detail.css (Chi tiết sản phẩm)
│  ├─ styleCart.css (Giỏ hàng)
│  ├─ styleCheckout.css (Thanh toán)
│  ├─ styleAdmin.css (Admin pages)
│  └─ ... (CSS khác)
│
└─ Data Storage (localStorage - Browser)
   ├─ products: Danh sách sản phẩm (ID, name, price, stock, image...)
   ├─ categories: Danh sách danh mục
   ├─ cart: Giỏ hàng hiện tại
   ├─ orders: Đơn hàng đã đặt
   ├─ users: Thông tin user đăng ký
   ├─ userData: User đang đăng nhập
   ├─ promotions: Mã khuyến mãi
   ├─ appliedCoupon: Mã được áp dụng vào đơn hàng
   ├─ admin: Admin account
   └─ adminUser: Admin đang đăng nhập
```

---

## 📄 CÁC TRANG CHÍNH

### **1. INDEX.HTML (Trang Chủ) - Trang Chính Của Website**

**URL**: `/index.html` hoặc `/`

**Chức năng**:
- Hiển thị banner carousel Flash Sale
- Hiển thị 8 sản phẩm bán chạy (bestsellers)
- Hiển thị sản phẩm mới từ admin
- Thanh tìm kiếm
- Menu điều hướng

**Script liên quan**: `scripts/scriptIndex.js`

#### **1.1 Khởi tạo dữ liệu lúc trang load**

```javascript
// scriptIndex.js - Dòng 1-20
document.addEventListener('DOMContentLoaded', function() {
  updateMenuByLoginStatus();              // Cập nhật menu (đã đăng nhập hay chưa)
  setupSearchForm();                      // Setup thanh tìm kiếm
  autoPlay();                             // Tự động chuyển slide Flash Sale
  khoiTaoSanPhamCu();                     // Khởi tạo sản phẩm demo (bestsellers + new)
  khoiTaoFlashSaleProducts();             // Tạo 8 sản phẩm Flash Sale
  khoiTaoDanhMucMacDinh();                // Tạo 10 danh mục
  taiSanPhamTuAdmin();                    // Lắng nghe sản phẩm admin mới
});
```

#### **1.2 Cập nhật menu dựa trên trạng thái đăng nhập**

```javascript
// scriptIndex.js - Dòng 2-46
function updateMenuByLoginStatus() {
  const userData = JSON.parse(localStorage.getItem('userData') || 'null');
  const accountLink = document.querySelector('.account-link');
  
  if (userData) {
    // Nếu đã đăng nhập
    accountLink.textContent = `👤 ${userData.name}`;
    accountLink.href = 'account.html';
    
    // Thay "Đăng nhập" thành "Đăng xuất"
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
      loginBtn.textContent = 'Đăng xuất';
      loginBtn.onclick = function(e) {
        e.preventDefault();
        localStorage.removeItem('userData');
        localStorage.removeItem('cart');
        location.reload();
      };
    }
  } else {
    // Nếu chưa đăng nhập
    accountLink.textContent = '👤 Tài khoản';
    accountLink.href = 'login-register.html';
  }
}
```

#### **1.3 Carousel Flash Sale - Tự động cuộn ảnh**

```javascript
// scriptIndex.js - Dòng 71-119
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Chuyển sang slide tiếp theo
function next() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % totalSlides;
  slides[currentSlide].classList.add('active');
}

// Quay lại slide trước
function back() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  slides[currentSlide].classList.add('active');
}

// Tự động chuyển slide sau mỗi 5 giây
function autoPlay() {
  setInterval(next, 5000);
}
```

**Giải thích**:
- `currentSlide`: Vị trí slide hiện tại (0 = slide đầu)
- `slides`: Lấy tất cả các div có class `.slide`
- `next()`: Bỏ class `active` khỏi slide cũ, thêm vào slide tiếp theo
- `autoPlay()`: Mỗi 5000ms (5 giây) gọi `next()` để chuyển slide tự động

#### **1.4 Thêm sản phẩm vào giỏ hàng - Chức năng quan trọng**

```javascript
// scriptIndex.js - Dòng 121-154
function addToCart(product) {
  // Lấy giỏ hiện tại từ localStorage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Kiểm tra stock
  if (!product.stock || product.stock <= 0) {
    alert('❌ Sản phẩm hết hàng!');
    return false;
  }
  
  // Kiểm tra sản phẩm đã trong giỏ chưa
  const existingItem = cart.find(item => String(item.id) === String(product.id));
  
  if (existingItem) {
    // Nếu đã có: cộng thêm số lượng
    const newQuantity = existingItem.quantity + 1;
    
    // Kiểm tra không vượt quá stock
    if (newQuantity > product.stock) {
      alert(`⚠️ Chỉ còn ${product.stock} sản phẩm`);
      return false;
    }
    
    existingItem.quantity = newQuantity;
  } else {
    // Nếu chưa có: thêm mới vào giỏ
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  // Lưu giỏ vào localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Cập nhật số lượng giỏ ở menu
  updateCartCount();
  
  alert('✅ Thêm vào giỏ thành công!');
  return true;
}
```

**Giải thích chi tiết**:
1. **Lấy giỏ hiện tại**: `JSON.parse(localStorage.getItem('cart') || '[]')`
   - Nếu có giỏ cũ → Lấy ra
   - Nếu không có → Tạo mảng rỗng `[]`

2. **Kiểm tra stock**: Nếu `product.stock <= 0` → Hết hàng, dừng lại

3. **Tìm sản phẩm trong giỏ**:
   ```javascript
   const existingItem = cart.find(item => String(item.id) === String(product.id));
   ```
   - Chuyển đổi sang string để so sánh (vì có ID dạng số và string)
   - Nếu tìm thấy → Là sản phẩm đã trong giỏ

4. **Nếu sản phẩm đã có trong giỏ**:
   - Cộng thêm `quantity` lên 1
   - Kiểm tra không vượt quá stock

5. **Nếu sản phẩm chưa có**:
   - Tạo object mới với `quantity: 1`

6. **Lưu và cập nhật**:
   - `localStorage.setItem('cart', JSON.stringify(cart))`: Lưu vào localStorage
   - `updateCartCount()`: Cập nhật số lượng ở menu header

#### **1.5 Cập nhật số lượng giỏ ở menu**

```javascript
// scriptIndex.js - Dòng 157-173
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Cập nhật số lượng ở header
  const cartIcon = document.querySelector('.cart-count');
  if (cartIcon) {
    cartIcon.textContent = cartCount;
  }
}
```

**Giải thích**:
- `reduce()`: Cộng tất cả `quantity` trong giỏ
  - `total`: Biến tích lũy (bắt đầu = 0)
  - `item`: Mỗi sản phẩm trong giỏ
  - `total + item.quantity`: Cộng dần

#### **1.6 Event Delegation - Xử lý click tất cả nút "Thêm vào giỏ"**

```javascript
// scriptIndex.js - Dòng 265-322
// ⭐ QUAN TRỌNG: Xử lý click nút "Thêm vào giỏ" cho TẤT CẢ sản phẩm (cũ + mới)
document.addEventListener('click', function(e) {
  // Kiểm tra xem click có vào nút "Thêm vào giỏ" không
  const button = e.target.closest('.add-to-cart');
  
  if (!button) return; // Nếu không phải nút này, dừng
  
  e.preventDefault();
  
  // Lấy product ID từ data attribute
  const productId = button.getAttribute('data-product-id');
  
  if (!productId) {
    console.error('Product ID không tìm thấy');
    return;
  }
  
  // Lấy tất cả sản phẩm từ localStorage
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  // Tìm sản phẩm theo ID (chuyển sang string để so sánh)
  const product = products.find(p => String(p.id) === String(productId));
  
  if (!product) {
    alert('❌ Không tìm thấy sản phẩm');
    return;
  }
  
  // Gọi hàm thêm vào giỏ
  addToCart(product);
});
```

**Tại sao dùng Event Delegation?**
- **Vấn đề cũ**: `document.querySelectorAll('.add-to-cart').forEach(...)` chỉ lấy nút được render lúc page load
- **Vấn đề**: Nút từ admin thêm sau không được gắn event listener
- **Giải pháp**: Dùng Event Delegation - lắng nghe toàn bộ document, kiểm tra xem click có vào nút `.add-to-cart` không
- **Kết quả**: Tất cả nút thêm vào giỏ (cũ + mới + flash sale) đều hoạt động

#### **1.7 Khởi tạo sản phẩm demo (Bestsellers + New Products)**

```javascript
// scriptIndex.js - Dòng 438-695
function khoiTaoSanPhamCu() {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  // Nếu đã có sản phẩm demo rồi → Thoát
  if (products.length > 0) return;
  
  // 8 sản phẩm bán chạy (bestsellers)
  const bestsellers = [
    {
      id: 100,
      name: "Gấu Bông Cao Cấp",
      price: 150000,
      oldPrice: 200000,
      image: "images/product1.webp",
      categoryId: 1,
      category: "Quà tặng",
      stock: 50,
      description: "Gấu bông mềm mại, chất lượng cao",
      reviews: [],
      discount: -25
    },
    // ... 7 sản phẩm khác (ID 101-107)
  ];
  
  // 15 sản phẩm mới (newproducts)
  const newProducts = [
    {
      id: 108,
      name: "Hộp Quà Tết",
      price: 200000,
      oldPrice: 0,
      image: "images/product9.webp",
      categoryId: 2,
      category: "Quà tặng thú cưng",
      stock: 30,
      description: "Hộp quà Tết đẹp sang trọng",
      reviews: [],
      discount: 0
    },
    // ... 14 sản phẩm khác (ID 109-122)
  ];
  
  // Kết hợp và lưu
  const allProducts = [...bestsellers, ...newProducts];
  localStorage.setItem('products', JSON.stringify(allProducts));
}
```

#### **1.8 Tải sản phẩm admin mới động**

```javascript
// scriptIndex.js - Dòng 735-785
function taiSanPhamTuAdmin() {
  // Lắng nghe thay đổi localStorage
  window.addEventListener('storage', function(e) {
    if (e.key === 'products') {
      // localStorage['products'] đã thay đổi (admin thêm sản phẩm mới)
      const products = JSON.parse(e.newValue || '[]');
      
      // Tìm sản phẩm ID < 100 (là sản phẩm admin)
      const adminProducts = products.filter(p => p.id < 100);
      
      // Render sản phẩm mới
      adminProducts.forEach(product => {
        // Kiểm tra đã render chưa
        if (!document.querySelector(`[data-product-id="${product.id}"]`)) {
          const container = document.querySelector('.admin-products-container');
          const card = createNewProductCard(product);
          container.appendChild(card);
        }
      });
    }
  });
}
```

**Giải thích**:
- `window.addEventListener('storage', ...)`: Lắng nghe thay đổi localStorage
- `e.key === 'products'`: Kiểm tra là dữ liệu `products` thay đổi
- `e.newValue`: Dữ liệu mới từ localStorage
- Render động sản phẩm không cần reload trang

#### **1.9 Tạo HTML card sản phẩm mới**

```javascript
// scriptIndex.js - Dòng 794-827
function createNewProductCard(product) {
  const div = document.createElement('div');
  div.className = 'product-card';
  div.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <h3>${product.name}</h3>
    <p class="price">
      ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString()}đ</span>` : ''}
      <span class="current-price">${product.price.toLocaleString()}đ</span>
    </p>
    <p class="stock">
      ${product.stock > 0 ? `✅ Còn ${product.stock}` : '❌ Hết hàng'}
    </p>
    <button class="add-to-cart" data-product-id="${product.id}">
      ${product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
    </button>
    <a href="product-detail.html?id=${product.id}" class="view-detail">Xem chi tiết</a>
  `;
  return div;
}
```

#### **1.10 Khởi tạo 8 sản phẩm Flash Sale**

```javascript
// scriptIndex.js - Dòng 830-858
function khoiTaoFlashSaleProducts() {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  // Kiểm tra flash sale đã có chưa
  if (products.find(p => p.id === 'fs-1')) return;
  
  const flashSaleProducts = [
    {
      id: 'fs-1',
      name: "Hộp Quà Flash Sale 1",
      price: 99000,
      oldPrice: 200000,
      image: "images/flashsale1.webp",
      categoryId: 1,
      category: "Flash Sale",
      stock: 100,
      description: "Sản phẩm Flash Sale giá sốc",
      discount: -50
    },
    // ... tương tự fs-2 đến fs-8
  ];
  
  products.push(...flashSaleProducts);
  localStorage.setItem('products', JSON.stringify(products));
}
```

#### **1.11 Khởi tạo 10 danh mục mặc định**

```javascript
// scriptIndex.js - Dòng 860-881
function khoiTaoDanhMucMacDinh() {
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  
  if (categories.length > 0) return; // Nếu đã có → Thoát
  
  const defaultCategories = [
    { id: 1, name: "Quà tặng", description: "Các loại quà tặng đặc biệt" },
    { id: 2, name: "Quà tặng thú cưng", description: "Quà cho các bé thú cưng" },
    { id: 3, name: "Quà tặng dễ thương", description: "Những lựa chọn dễ thương" },
    // ... 7 danh mục khác
  ];
  
  localStorage.setItem('categories', JSON.stringify(defaultCategories));
}
```

---

### **2. PRODUCT-DETAIL.HTML (Chi Tiết Sản Phẩm)**
**URL**: `/product-detail.html?id=<productId>`

**Chức năng**:
- Hiển thị thông tin sản phẩm chi tiết
- Hình ảnh sản phẩm
- Giá, tồn kho, mô tả
- Thêm sản phẩm vào giỏ hàng
- Sản phẩm liên quan

**Script liên quan**: `scripts/scriptProduct-detail.js`

**Các hàm chính**:
```javascript
// 1. Lấy ID sản phẩm từ URL
getProductIdFromUrl() → scriptProduct-detail.js:291
↳ Sử dụng URLSearchParams để lấy ?id=

// 2. Tải dữ liệu sản phẩm
initProductData() → scriptProduct-detail.js:279
↳ Gọi loadProductDataFromLocalStorage(id)
↳ hoặc loadFlashSaleProductData(id)

// 3. Cập nhật trang với dữ liệu
updatePageWithProductData(product) → scriptProduct-detail.js:231
↳ Điền thông tin vào HTML
↳ Hiển thị hình ảnh
↳ Tính giá sau discount

// 4. Thêm vào giỏ từ trang chi tiết
addToCartFromDetail() → scriptProduct-detail.js:368
↳ Kiểm tra stock
↳ Xác nhận chọn size (nếu có)
↳ Thêm vào localStorage cart
↳ Redirect về trang giỏ hàng (nếu click "Mua ngay")

// 5. Sản phẩm liên quan
displayRelatedProducts() → scriptProduct-detail.js:600
↳ Hiển thị sản phẩm cùng danh mục
↳ Có thể thêm từ đây
```

---

### **3. CART.HTML (Giỏ Hàng)**
**URL**: `/cart.html`

**Chức năng**:
- Hiển thị danh sách sản phẩm trong giỏ
- Cập nhật số lượng
- Xóa sản phẩm
- Tính tổng giá
- Áp dụng mã khuyến mãi
- Checkout

**Script liên quan**: `scripts/scriptCart.js`

**Các hàm chính**:
```javascript
// 1. Hiển thị giỏ hàng
displayCart() → scriptCart.js:?
↳ Lấy cart từ localStorage
↳ Render HTML cho mỗi item
↳ Tính tổng giá

// 2. Cập nhật số lượng sản phẩm
updateQuantity(itemId, newQuantity) → scriptCart.js:?
↳ Kiểm tra stock
↳ Cập nhật localStorage
↳ Refresh trang

// 3. Xóa sản phẩm
removeItem(itemId) → scriptCart.js:?
↳ Xóa khỏi localStorage cart
↳ Refresh trang

// 4. Áp dụng mã khuyến mãi
applyCoupon(code) → scriptCart.js:?
↳ Kiểm tra mã trong localStorage promotions
↳ Lưu vào appliedCoupon
↳ Tính lại tổng giá

// 5. Tính toán giá
calculateTotal() → scriptCart.js:?
↳ Subtotal = sum(price * quantity)
↳ Shipping = 30,000 (nếu < 500,000)
↳ Discount = áp dụng từ coupon
↳ Total = Subtotal - Discount + Shipping
```

---

### **4. CHECKOUT.HTML (Thanh Toán)**
**URL**: `/checkout.html`

**Chức năng**:
- Xem lại đơn hàng (order review)
- Nhập thông tin khách hàng
- Chọn phương thức thanh toán
- Xác nhận đặt hàng

**Script liên quan**: `scripts/scriptCheckout.js`

**Các hàm chính**:
```javascript
// 1. Hiển thị thông tin đơn hàng
displayOrderReview() → scriptCheckout.js:?
↳ Lấy cart từ localStorage
↳ Hiển thị sản phẩm
↳ Hiển thị tổng giá

// 2. Validate thông tin khách hàng
validateCustomerInfo() → scriptCheckout.js:?
↳ Kiểm tra tên, email, địa chỉ, số điện thoại
↳ Trả về true/false

// 3. Xử lý đặt hàng
processOrder() → scriptCheckout.js:?
↳ Validate thông tin khách hàng
↳ Validate stock (kiểm tra lại)
↳ Tạo order object mới:
    {
      id: generateOrderId(),
      userId: userData.id (hoặc guest),
      customerInfo: { name, email, phone, address },
      items: cart items,
      subtotal: tính toán,
      discount: từ appliedCoupon,
      totalPrice: subtotal - discount + shipping,
      status: 'pending',
      orderDate: ngày hiện tại,
      paymentMethod: phương thức
    }
↳ Lưu vào localStorage orders
↳ Nếu user đăng nhập: lưu vào userData.orders
↳ Reduce stock: reduceStockForOrder()
↳ Clear cart
↳ Redirect tới success page

// 4. Giảm tồn kho
reduceStockForOrder() → scriptCheckout.js:?
↳ Với mỗi item trong order:
    - Tìm sản phẩm trong localStorage products
    - Trừ stock: product.stock -= item.quantity
    - Cập nhật localStorage
```

---

### **5. CATEGORY-PRODUCTS.HTML (Danh Mục Sản Phẩm)**
**URL**: `/category-products.html?category=<categoryName>`

**Chức năng**:
- Hiển thị sản phẩm theo danh mục
- Filter, sort sản phẩm
- Thêm vào giỏ hàng

**Script liên quan**: `scripts/scriptCategory-products.js`

**Các hàm chính**:
```javascript
// 1. Lấy danh mục từ URL
getCategoryFromUrl() → scriptCategory-products.js:?
↳ Lấy ?category= từ URL

// 2. Tải sản phẩm theo danh mục
loadProductsByCategory(categoryName) → scriptCategory-products.js:?
↳ Lấy tất cả products từ localStorage
↳ Filter: product.categoryId == categoryId
↳ Render HTML

// 3. Thêm vào giỏ từ danh mục
addToCart(productId) → scriptCategory-products.js:153
↳ Tìm sản phẩm theo ID
↳ Kiểm tra stock
↳ Thêm vào localStorage cart
↳ Cập nhật giỏ
```

---

### **6. SEARCH-RESULTS.HTML (Kết Quả Tìm Kiếm)**
**URL**: `/search-results.html?query=<searchQuery>`

**Chức năng**:
- Hiển thị kết quả tìm kiếm
- Tìm kiếm theo tên, mô tả
- Thêm vào giỏ hàng

**Script liên quan**: `scripts/scriptSearchResults.js`

**Các hàm chính**:
```javascript
// 1. Thực hiện tìm kiếm
performSearch() → scriptSearchResults.js:8
↳ Lấy query từ URL
↳ Lấy tất cả products từ localStorage
↳ Filter: 
    name.includes(query) ||
    description.includes(query) ||
    category.includes(query)
↳ Gọi displaySearchResults()

// 2. Hiển thị kết quả
displaySearchResults(products) → scriptSearchResults.js:45
↳ Render HTML cho mỗi sản phẩm
↳ Nếu rỗng: hiển thị "Không tìm thấy"

// 3. Thêm vào giỏ
addToCart(productId) → scriptSearchResults.js:110
↳ Tương tự category-products
```

---

### **7. ACCOUNT.HTML (Quản Lý Tài Khoản)**
**URL**: `/account.html`

**Chức năng**:
- Xem/edit thông tin profile
- Đổi mật khẩu
- Xem lịch sử đơn hàng
- Hủy đơn hàng
- Xác nhận giao hàng
- Đánh giá sản phẩm
- Đăng xuất

**Script liên quan**: `scripts/scriptAccount.js`

**Các hàm chính**:
```javascript
// 1. Kiểm tra đã đăng nhập
checkLogin() → scriptAccount.js:46
↳ Lấy userData từ localStorage
↳ Nếu không: redirect tới login

// 2. Tải dữ liệu user
loadUserData() → scriptAccount.js:64
↳ Điền thông tin vào form

// 3. Edit thông tin
handleEditSubmit(e) → scriptAccount.js:99
↳ Validate dữ liệu
↳ Cập nhật userData
↳ Lưu vào localStorage

// 4. Đổi mật khẩu
handlePasswordSubmit(e) → scriptAccount.js:177
↳ Kiểm tra mật khẩu cũ
↳ Kiểm tra mật khẩu mới khớp
↳ Cập nhật userData.password
↳ Cập nhật users array

// 5. Xem đơn hàng
loadOrders() → scriptAccount.js:266
↳ Lấy orders từ userData
↳ Render HTML
↳ Hiển thị status, ngày, tổng tiền

// 6. Hủy đơn hàng
handleCancelOrder(orderId) → scriptAccount.js:409
↳ Kiểm tra status = 'pending'
↳ Cập nhật status = 'cancelled'
↳ Khôi phục stock từ các item
↳ Lưu vào localStorage

// 7. Xác nhận giao hàng
handleConfirmDelivery(orderId) → scriptAccount.js:445
↳ Cập nhật status = 'delivered'
↳ Cho phép đánh giá

// 8. Đánh giá sản phẩm
openReviewModal(orderId) → scriptAccount.js:561
↳ Hiển thị modal form
↳ Chọn rating (1-5 sao)
↳ Nhập nhận xét
↳ Lưu review vào products
```

---

### **8. LOGIN-REGISTER.HTML (Đăng Nhập/Đăng Ký)**
**URL**: `/login-register.html`

**Chức năng**:
- Đăng nhập tài khoản user
- Đăng ký tài khoản mới
- Validation input

**Script liên quan**: `scripts/scriptLogin-register.js`

**Các hàm chính**:
```javascript
// 1. Đăng nhập
handleLogin(email, password) → scriptLogin-register.js:?
↳ Lấy users array từ localStorage
↳ Kiểm tra email tồn tại
↳ Kiểm tra password khớp
↳ Lưu userData = user object
↳ Redirect tới index.html
↳ Hiển thị tên user ở menu

// 2. Đăng ký
handleRegister(name, email, password) → scriptLogin-register.js:?
↳ Validate dữ liệu (email hợp lệ, password đủ mạnh)
↳ Kiểm tra email chưa được đăng ký
↳ Tạo user object mới:
    {
      id: generateId(),
      name: name,
      email: email,
      password: password,
      phone: '',
      address: '',
      orders: [],
      createdDate: ngày
    }
↳ Thêm vào users array
↳ Lưu vào localStorage
↳ Hiển thị thành công
↳ Redirect tới login

// 3. Đăng xuất
handleLogout() → scriptAccount.js:250
↳ Xóa userData từ localStorage
↳ Redirect tới index.html
↳ Cập nhật menu
```

---

### **9. ADMIN PAGES**
**URL**: `/admin-*.html`

**Các trang admin**:
- `admin-login.html`: Đăng nhập admin
- `admin-dashboard.html`: Tổng quan
- `admin-products.html`: Quản lý sản phẩm
- `admin-categories.html`: Quản lý danh mục
- `admin-customers.html`: Quản lý khách hàng
- `admin-orders.html`: Quản lý đơn hàng
- `admin-promotions.html`: Quản lý khuyến mãi

**Chức năng admin**:
- Thêm/sửa/xóa sản phẩm
- Quản lý danh mục
- Xem danh sách khách hàng
- Cập nhật trạng thái đơn hàng
- Quản lý mã khuyến mãi

---

## 💾 HỆ THỐNG DỮ LIỆU (localStorage)

### **1. `products` - Danh sách sản phẩm**
```javascript
[
  {
    id: 1,                              // ID sản phẩm (Number)
    name: "Tên sản phẩm",              // Tên
    price: 100000,                      // Giá bán
    oldPrice: 150000,                   // Giá gốc (nếu sale)
    image: "images/product1.webp",     // Đường dẫn ảnh
    categoryId: 1,                      // ID danh mục
    category: "Quà tặng",              // Tên danh mục
    stock: 50,                          // Tồn kho
    description: "Mô tả sản phẩm",    // Mô tả chi tiết
    reviews: [                          // Đánh giá
      { rating: 5, comment: "Tốt", userId: 1 }
    ],
    discount: -20,                      // Giảm giá (%)
    section: "bestsellers"              // Loại (bestsellers, newproducts)
  }
  // ... sản phẩm khác
]
```

**Sơ đồ ID sản phẩm**:
- **1-99**: Sản phẩm do admin thêm
- **100-107**: Sản phẩm bán chạy (demo)
- **108-122**: Sản phẩm mới (demo)
- **fs-1 đến fs-8**: Flash sale

---

### **2. `categories` - Danh mục sản phẩm**
```javascript
[
  {
    id: 1,
    name: "Quà tặng",
    description: "Các loại quà tặng đặc biệt",
    image: "images/category1.webp"
  }
  // ... danh mục khác
]
```

**10 danh mục mặc định**:
1. Quà tặng
2. Quà tặng thú cưng
3. Quà tặng dễ thương
4. Quà tặng Giáng sinh
5. Quà tặng thần tài
6. Quà tặng phong thủy
7. Túi hộp đựng quà
8. Quà tặng cao cấp
9. Quà tặng văn phòng
10. Khác

---

### **3. `cart` - Giỏ hàng hiện tại**
```javascript
[
  {
    id: 1,                      // ID sản phẩm
    name: "Tên sản phẩm",
    price: 100000,
    image: "images/product1.webp",
    quantity: 2                 // Số lượng trong giỏ
  }
  // ... sản phẩm khác trong giỏ
]
```

---

### **4. `orders` - Danh sách tất cả đơn hàng**
```javascript
[
  {
    id: "ORD20241206001",                   // ID đơn hàng
    userId: 1,                              // ID user đặt (hoặc null nếu khách)
    customerInfo: {
      name: "Nguyễn Văn A",
      email: "a@gmail.com",
      phone: "0912345678",
      address: "123 Đường ABC, TP HCM"
    },
    items: [
      { id: 1, name: "Sản phẩm 1", price: 100000, quantity: 2 }
    ],
    subtotal: 200000,                       // Tổng trước giảm
    discount: 0,                            // Số tiền giảm
    shipping: 30000,                        // Phí vận chuyển
    totalPrice: 230000,                     // Tổng cộng
    status: 'pending',                      // pending|confirmed|shipping|delivered|cancelled
    paymentMethod: 'cash',                  // cash|card|transfer
    orderDate: "2024-12-06",                // Ngày đặt
    notes: "Ghi chú đơn hàng"
  }
]
```

---

### **5. `users` - Danh sách tài khoản user**
```javascript
[
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    password: "hashedPassword",      // Mã hóa (trong thực tế)
    phone: "0912345678",
    address: "123 Đường ABC",
    createdDate: "2024-01-01",
    orders: []                        // Danh sách đơn hàng của user
  }
]
```

---

### **6. `userData` - User đang đăng nhập**
```javascript
// Nếu đã đăng nhập
{
  id: 1,
  name: "Nguyễn Văn A",
  email: "a@gmail.com",
  phone: "0912345678",
  address: "123 Đường ABC",
  orders: [ /* orders array */ ]
}

// Nếu chưa đăng nhập: null hoặc không tồn tại
```

---

### **7. `promotions` - Mã khuyến mãi**
```javascript
[
  {
    id: 1,
    code: "GIFT20",                  // Mã code
    description: "Giảm 20%",
    type: 'percent',                 // percent|amount
    value: 20,                        // 20% hoặc 20000 VNĐ
    minOrderAmount: 500000,          // Đơn tối thiểu
    expiryDate: "2024-12-31",
    usageCount: 0,
    maxUsage: 100
  }
]
```

---

### **8. `appliedCoupon` - Mã khuyến mãi được áp dụng**
```javascript
{
  code: "GIFT20",
  type: 'percent',
  value: 20,
  discountAmount: 40000
}
// Hoặc null nếu không có mã nào
```

---

### **9. `admin` - Tài khoản admin mặc định**
```javascript
{
  email: "admin@shop.com",
  password: "admin123"  // Lưu ý: trong thực tế phải hash
}
```

---

### **10. `adminUser` - Admin đang đăng nhập**
```javascript
{
  email: "admin@shop.com",
  loginTime: "2024-12-06T10:30:00"
}
// Hoặc null nếu chưa đăng nhập
```

---

## 🎯 CHI TIẾT CHỨC NĂNG CHÍNH

### **1. THÊM VÀO GIỎ HÀNG (Add to Cart) - Chức Năng Core**

#### **Luồng xử lý đầy đủ**:
```
┌─────────────────────────────────────────────────┐
│ 1. User click nút "Thêm vào giỏ"                 │
│    (có data-product-id="100" chẳng hạn)          │
├─────────────────────────────────────────────────┤
│ 2. Event Delegation bắt sự kiện:                 │
│    document.addEventListener('click', ...)      │
│    → Kiểm tra: e.target.closest('.add-to-cart')│
├─────────────────────────────────────────────────┤
│ 3. Lấy product ID từ data attribute              │
│    const productId = button.getAttribute(...)   │
├─────────────────────────────────────────────────┤
│ 4. Tìm sản phẩm trong localStorage               │
│    const product = products.find(...)           │
├─────────────────────────────────────────────────┤
│ 5. Gọi hàm addToCart(product)                    │
│    ✓ Kiểm tra stock                              │
│    ✓ Tìm trong giỏ cũ (nếu có)                   │
│    ✓ Cộng quantity hoặc thêm mới                 │
│    ✓ Lưu vào localStorage['cart']                │
├─────────────────────────────────────────────────┤
│ 6. Cập nhật số lượng giỏ ở menu                  │
├─────────────────────────────────────────────────┤
│ 7. Hiển thị alert thành công                     │
└─────────────────────────────────────────────────┘
```

#### **Code Event Delegation chi tiết** (scriptIndex.js - Dòng 265-322):

```javascript
// ⭐⭐⭐ ĐÂY LÀ TRÁI TIM CỦA CHỨC NĂNG THÊM GIỎ HÀNG ⭐⭐⭐

// Lắng nghe click trên toàn bộ document
document.addEventListener('click', function(e) {
  // Kiểm tra xem click có vào element có class "add-to-cart" không
  // e.target.closest() tìm element cha gần nhất có class "add-to-cart"
  const button = e.target.closest('.add-to-cart');
  
  if (!button) {
    // Nếu không phải nút "Thêm vào giỏ" → Thoát
    return;
  }
  
  e.preventDefault(); // Ngăn hành động mặc định (nếu là link)
  
  // Lấy product ID từ attribute data-product-id
  // Ví dụ: data-product-id="100" → productId = "100"
  const productId = button.getAttribute('data-product-id');
  
  if (!productId) {
    console.error('❌ Không tìm thấy product ID');
    return;
  }
  
  // Lấy danh sách sản phẩm từ localStorage
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  // Tìm sản phẩm với ID khớp (chuyển sang string để so sánh)
  // Vì có ID dạng số (100) và string ("fs-1")
  const product = products.find(p => String(p.id) === String(productId));
  
  if (!product) {
    alert('❌ Không tìm thấy sản phẩm này');
    return;
  }
  
  // Gọi hàm thêm vào giỏ
  addToCart(product);
});
```

#### **Code hàm addToCart chi tiết** (scriptIndex.js - Dòng 121-154):

```javascript
function addToCart(product) {
  // BƯỚC 1: Lấy giỏ hiện tại từ localStorage
  // Nếu chưa có giỏ → Tạo mảng rỗng []
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  console.log('📦 Giỏ hiện tại:', cart);
  console.log('🛍️ Sản phẩm muốn thêm:', product.name);
  
  // BƯỚC 2: Kiểm tra stock sản phẩm
  if (!product.stock || product.stock <= 0) {
    alert('❌ Sản phẩm đã hết hàng!');
    return false;
  }
  
  console.log(`✅ Còn ${product.stock} sản phẩm`);
  
  // BƯỚC 3: Tìm sản phẩm đã có trong giỏ không
  // Chuyển sang String để so sánh (vì có ID dạng số và string)
  const existingItem = cart.find(
    item => String(item.id) === String(product.id)
  );
  
  if (existingItem) {
    // TRƯỜNG HỢP 1: Sản phẩm đã có trong giỏ
    console.log('ℹ️ Sản phẩm đã trong giỏ, tăng quantity');
    
    const newQuantity = existingItem.quantity + 1;
    
    // Kiểm tra không vượt quá stock
    if (newQuantity > product.stock) {
      alert(`⚠️ Chỉ còn ${product.stock} sản phẩm, không thể thêm thêm!`);
      return false;
    }
    
    // Tăng quantity
    existingItem.quantity = newQuantity;
    
  } else {
    // TRƯỜNG HỢP 2: Sản phẩm chưa có trong giỏ → Thêm mới
    console.log('➕ Thêm sản phẩm mới vào giỏ');
    
    cart.push({
      id: product.id,           // ID sản phẩm
      name: product.name,       // Tên sản phẩm
      price: product.price,     // Giá hiện tại
      image: product.image,     // Hình ảnh
      quantity: 1               // Bắt đầu với số lượng = 1
    });
  }
  
  // BƯỚC 4: Lưu giỏ mới vào localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  console.log('💾 Đã lưu giỏ mới:', cart);
  
  // BƯỚC 5: Cập nhật số lượng giỏ ở menu
  updateCartCount();
  
  // BƯỚC 6: Hiển thị thông báo thành công
  alert('✅ Đã thêm vào giỏ hàng thành công!');
  
  return true;
}
```

#### **Code hàm updateCartCount** (scriptIndex.js - Dòng 157-173):

```javascript
function updateCartCount() {
  // Lấy giỏ hiện tại
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Tính tổng số lượng sản phẩm
  // Nếu giỏ có: [{quantity: 2}, {quantity: 1}]
  // → Total = 2 + 1 = 3
  const cartCount = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0); // Bắt đầu với total = 0
  
  // Tìm element hiển thị số lượng giỏ
  const cartIcon = document.querySelector('.cart-count');
  
  if (cartIcon) {
    // Cập nhật số lượng
    cartIcon.textContent = cartCount;
    
    // Hoặc có thể thêm hiệu ứng
    cartIcon.classList.add('updated');
    setTimeout(() => {
      cartIcon.classList.remove('updated');
    }, 500);
  }
  
  console.log(`🛒 Giỏ hiện có ${cartCount} sản phẩm`);
}
```

---

### **2. CHECKOUT & TẠO ĐƠN HÀNG - Chức Năng Quan Trọng**

#### **Luồng xử lý chi tiết**:

```javascript
// ========================================
// scriptCheckout.js - Hàm processOrder()
// ========================================

function processOrder() {
  console.log('📋 Bắt đầu xử lý đơn hàng...');
  
  // BƯỚC 1: Lấy thông tin khách hàng từ form
  const customerInfo = {
    name: document.querySelector('#customer-name').value,
    email: document.querySelector('#customer-email').value,
    phone: document.querySelector('#customer-phone').value,
    address: document.querySelector('#customer-address').value
  };
  
  // BƯỚC 2: Validate thông tin khách hàng
  if (!validateCustomerInfo(customerInfo)) {
    alert('❌ Vui lòng điền đủ thông tin!');
    return false;
  }
  
  console.log('✅ Thông tin khách hàng hợp lệ:', customerInfo);
  
  // BƯỚC 3: Lấy giỏ hiện tại
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  if (cart.length === 0) {
    alert('❌ Giỏ hàng trống!');
    return false;
  }
  
  console.log('🛒 Giỏ hàng có:', cart);
  
  // BƯỚC 4: Lấy danh sách sản phẩm từ localStorage
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  // BƯỚC 5: Kiểm tra stock cho mỗi item trong giỏ
  // ⭐ QUAN TRỌNG: Kiểm tra lần nữa trước khi thanh toán
  for (let item of cart) {
    const product = products.find(p => String(p.id) === String(item.id));
    
    if (!product) {
      alert(`❌ Sản phẩm "${item.name}" không tìm thấy!`);
      return false;
    }
    
    if (product.stock < item.quantity) {
      alert(`❌ Sản phẩm "${item.name}" không đủ stock!
      Còn lại: ${product.stock}, bạn muốn: ${item.quantity}`);
      return false;
    }
    
    console.log(`✅ ${item.name}: còn ${product.stock}, đặt ${item.quantity}`);
  }
  
  // BƯỚC 6: Tính toán giá tiền
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  // Phí vận chuyển (nếu đơn < 500,000 thì tính 30,000)
  const shipping = subtotal < 500000 ? 30000 : 0;
  
  // Lấy mã khuyến mãi (nếu có)
  const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || 'null');
  let discount = 0;
  
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      // Giảm theo %
      discount = (subtotal * appliedCoupon.value) / 100;
    } else {
      // Giảm theo số tiền cố định
      discount = appliedCoupon.value;
    }
  }
  
  const totalPrice = subtotal - discount + shipping;
  
  console.log(`💰 Tính toán:
    - Subtotal: ${subtotal}
    - Discount: ${discount}
    - Shipping: ${shipping}
    - Total: ${totalPrice}`);
  
  // BƯỚC 7: Tạo object đơn hàng mới
  const order = {
    id: generateOrderId(),              // ID đơn hàng: ORD20241206001
    userId: userData?.id || null,       // ID user (nếu đã đăng nhập)
    customerInfo: customerInfo,         // Thông tin khách
    items: cart,                        // Danh sách sản phẩm
    subtotal: subtotal,
    discount: discount,
    shipping: shipping,
    totalPrice: totalPrice,
    status: 'pending',                  // pending → confirmed → shipping → delivered
    paymentMethod: document.querySelector('input[name="payment"]:checked').value,
    orderDate: new Date().toISOString(),
    notes: document.querySelector('#order-notes').value || ''
  };
  
  console.log('📦 Tạo đơn hàng:', order);
  
  // BƯỚC 8: Lưu đơn hàng vào localStorage['orders']
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // BƯỚC 9: Nếu user đã đăng nhập → Thêm vào userData['orders']
  const userData = JSON.parse(localStorage.getItem('userData') || 'null');
  if (userData) {
    if (!userData.orders) userData.orders = [];
    userData.orders.push(order.id);
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  
  // BƯỚC 10: Giảm stock sản phẩm
  reduceStockForOrder(cart, products);
  
  // BƯỚC 11: Clear giỏ hàng
  localStorage.removeItem('cart');
  localStorage.removeItem('appliedCoupon'); // Xóa mã khuyến mãi
  
  console.log('✅ Đã xóa giỏ và mã khuyến mãi');
  
  // BƯỚC 12: Chuyển hướng tới trang thành công
  localStorage.setItem('lastOrderId', order.id); // Lưu order ID cho trang success
  window.location.href = 'order-success.html?orderid=' + order.id;
  
  return true;
}

// ========================================
// scriptCheckout.js - Hàm giảm stock
// ========================================

function reduceStockForOrder(cart, products) {
  // ⭐ BẬC QUAN TRỌNG: Cập nhật stock trong localStorage
  
  cart.forEach(cartItem => {
    // Tìm sản phẩm trong danh sách products
    const product = products.find(
      p => String(p.id) === String(cartItem.id)
    );
    
    if (product) {
      // Trừ stock
      product.stock -= cartItem.quantity;
      
      console.log(`📉 ${product.name}: stock ${product.stock} 
        (đã bán ${cartItem.quantity})`);
    }
  });
  
  // Lưu products mới vào localStorage
  localStorage.setItem('products', JSON.stringify(products));
  
  console.log('✅ Đã cập nhật stock');
}

// ========================================
// scriptCheckout.js - Tạo ID đơn hàng
// ========================================

function generateOrderId() {
  // Format: ORD + ngày giờ + random
  // Ví dụ: ORD20241206153045123
  const date = new Date();
  const timestamp = date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0') +
    String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0') +
    String(date.getSeconds()).padStart(2, '0');
  
  const random = Math.floor(Math.random() * 1000);
  
  return `ORD${timestamp}${random}`;
}

// ========================================
// scriptCheckout.js - Validate thông tin
// ========================================

function validateCustomerInfo(customerInfo) {
  // Kiểm tra các field không rỗng
  if (!customerInfo.name.trim()) {
    alert('❌ Vui lòng nhập họ tên');
    return false;
  }
  
  if (!customerInfo.email.trim()) {
    alert('❌ Vui lòng nhập email');
    return false;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerInfo.email)) {
    alert('❌ Email không hợp lệ');
    return false;
  }
  
  if (!customerInfo.phone.trim()) {
    alert('❌ Vui lòng nhập số điện thoại');
    return false;
  }
  
  // Validate số điện thoại (10-11 chữ số)
  if (!/^\d{10,11}$/.test(customerInfo.phone.replace(/[-\s]/g, ''))) {
    alert('❌ Số điện thoại không hợp lệ');
    return false;
  }
  
  if (!customerInfo.address.trim()) {
    alert('❌ Vui lòng nhập địa chỉ');
    return false;
  }
  
  return true;
}
```

---

### **3. HỆ THỐNG TỒN KHO (Stock Management)**

#### **Các điểm kiểm tra stock** (Flow đầy đủ):

```javascript
// ========================================
// 🔍 ĐIỂM KIỂM TRA 1: Khi thêm vào giỏ
// ========================================
// scriptIndex.js - Dòng 121-154

function addToCart(product) {
  // Kiểm tra lần 1
  if (!product.stock || product.stock <= 0) {
    alert('❌ Sản phẩm hết hàng!');
    return false;  // ← DỪNG NGAY
  }
  
  // ... (code tiếp theo)
  
  const existingItem = cart.find(...);
  
  if (existingItem) {
    // Kiểm tra lần 2: Khi tăng quantity
    if (newQuantity > product.stock) {
      alert(`⚠️ Chỉ còn ${product.stock} sản phẩm`);
      return false;  // ← DỪNG NGAY
    }
  }
}

// ========================================
// 🔍 ĐIỂM KIỂM TRA 2: Khi cập nhật giỏ
// ========================================
// scriptCart.js

function updateQuantity(itemId, newQuantity) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  const cartItem = cart.find(item => item.id == itemId);
  const product = products.find(p => p.id == cartItem.id);
  
  // Kiểm tra lần 3
  if (newQuantity > product.stock) {
    alert(`⚠️ Chỉ còn ${product.stock} sản phẩm`);
    return false;  // ← DỪNG NGAY
  }
  
  cartItem.quantity = newQuantity;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ========================================
// 🔍 ĐIỂM KIỂM TRA 3: Trước khi checkout
// ========================================
// scriptCheckout.js - Dòng processOrder()

// Với mỗi item:
for (let item of cart) {
  const product = products.find(p => String(p.id) === String(item.id));
  
  // Kiểm tra lần 4
  if (product.stock < item.quantity) {
    alert(`❌ ${item.name} không đủ stock!`);
    return false;  // ← DỪNG NGAY
  }
}

// ========================================
// 📉 GIẢM STOCK: Sau khi thanh toán thành công
// ========================================
// scriptCheckout.js - Dòng reduceStockForOrder()

function reduceStockForOrder(cart, products) {
  cart.forEach(cartItem => {
    const product = products.find(
      p => String(p.id) === String(cartItem.id)
    );
    
    if (product) {
      // Trừ stock
      product.stock -= cartItem.quantity;
      console.log(`Stock ${product.name}: ${product.stock}`);
    }
  });
  
  // Lưu vào localStorage
  localStorage.setItem('products', JSON.stringify(products));
}

// ========================================
// 📊 HIỂN THỊ STOCK: Trên trang sản phẩm
// ========================================

// scriptIndex.js - Dòng createNewProductCard()
function createNewProductCard(product) {
  const div = document.createElement('div');
  div.className = 'product-card';
  div.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p class="price">${product.price.toLocaleString()}đ</p>
    
    <!-- Hiển thị stock -->
    <p class="stock">
      ${product.stock > 0 ? `✅ Còn ${product.stock}` : '❌ Hết hàng'}
    </p>
    
    <!-- Nút thêm giỏ (disable nếu hết) -->
    <button class="add-to-cart" data-product-id="${product.id}"
            ${product.stock <= 0 ? 'disabled' : ''}>
      ${product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
    </button>
  `;
  return div;
}
```
  Nếu không: Alert "Tồn kho không đủ"

✅ GIẢM STOCK (Khi đặt hàng):
  User checkout
    ↓
  Xác nhận đơn hàng
    ↓
  Với mỗi item:
    product.stock -= item.quantity
    ↓
  Cập nhật localStorage
```

**Code chính**:
- `scriptIndex.js`: Lines 121-135 (kiểm tra stock)
- `scriptCheckout.js`: reduceStockForOrder() (giảm stock)
- `scriptCart.js`: updateQuantity() (kiểm tra khi update)

---

### **4. HỆ THỐNG DANH MỤC**

**Luồng xử lý**:
```
1. Khởi tạo 10 danh mục mặc định:
   khoiTaoDanhMucMacDinh() → scriptIndex.js:860
   ↓
2. Lưu vào localStorage['categories']
   ↓
3. Hiển thị menu danh mục
   ↓
4. User click danh mục
   ↓
5. Redirect: category-products.html?category=<categoryName>
   ↓
6. Script lấy danh mục từ URL
   ↓
7. Lọc sản phẩm: product.categoryId == categoryId
   ↓
8. Hiển thị sản phẩm
   ↓
9. User có thể thêm vào giỏ trực tiếp từ danh mục
```

**Code chính**:
- `scriptIndex.js`: khoiTaoDanhMucMacDinh() - Lines 860-881
- `scriptCategory-products.js`: loadProductsByCategory()

---

### **5. TÌM KIẾM SẢN PHẨM**

**Luồng xử lý**:
```
1. User nhập từ khóa vào ô tìm kiếm
   ↓
2. User submit form (Enter hoặc click nút)
   ↓
3. Redirect: search-results.html?query=<keyword>
   ↓
4. Script lấy query từ URL
   ↓
5. Lấy tất cả products từ localStorage
   ↓
6. Lọc sản phẩm:
   - product.name.includes(query) OR
   - product.description.includes(query) OR
   - product.category.includes(query)
   ↓
7. Hiển thị kết quả
   ↓
8. Nếu không có: "Không tìm thấy sản phẩm"
   ↓
9. User có thể thêm vào giỏ từ kết quả tìm kiếm
```

**Code chính**:
- `scriptIndex.js`: setupSearchForm() - Lines 50-70
- `scriptSearchResults.js`: performSearch() - Lines 8-44

---

### **6. HỆ THỐNG ĐĂNG NHẬP/ĐĂNG KÝ**

**Luồng ĐĂNG KÝ**:
```
1. User vào login-register.html
   ↓
2. Click tab "Đăng ký"
   ↓
3. Nhập: Họ tên, Email, Mật khẩu, Xác nhận mật khẩu
   ↓
4. Click "Đăng ký"
   ↓
5. Validate:
   - Email hợp lệ (regex)
   - Mật khẩu tối thiểu 6 ký tự
   - 2 mật khẩu khớp nhau
   ↓
6. Kiểm tra email chưa được đăng ký:
   - Lấy users array từ localStorage
   - Kiểm tra: !users.find(u => u.email == email)
   ↓
7. Tạo user object:
   {
     id: generateId(),
     name, email, password,
     phone: '', address: '',
     orders: [],
     createdDate: ngày hiện tại
   }
   ↓
8. Thêm vào users array
   ↓
9. Lưu vào localStorage['users']
   ↓
10. Hiển thị "Đăng ký thành công"
    ↓
11. Redirect tới tab Đăng nhập
```

**Luồng ĐĂNG NHẬP**:
```
1. User vào login-register.html
   ↓
2. Nhập Email và Mật khẩu
   ↓
3. Click "Đăng nhập"
   ↓
4. Validate:
   - Email không rỗng
   - Mật khẩu không rỗng
   ↓
5. Kiểm tra tài khoản:
   - Lấy users array từ localStorage
   - user = users.find(u => u.email == email && u.password == password)
   ↓
6. Nếu không tìm thấy:
   - Alert "Email hoặc mật khẩu không đúng"
   ↓
7. Nếu tìm thấy:
   - Lưu user vào localStorage['userData']
   - Cập nhật menu: Hiển thị tên user
   - Redirect tới index.html
```

**Luồng ĐĂNG XUẤT**:
```
1. User click "Đăng xuất" ở menu
   ↓
2. Xóa localStorage['userData']
   ↓
3. Clear giỏ hàng (optional)
   ↓
4. Cập nhật menu
   ↓
5. Redirect tới index.html
```

**Code chính**:
- `scriptLogin-register.js`: Các hàm xác thực
- `scriptAccount.js`: handleLogout() - Lines 250-264

---

### **7. FLASH SALE**

**Luồng xử lý**:
```
1. Khởi tạo 8 sản phẩm Flash Sale:
   khoiTaoFlashSaleProducts() → scriptIndex.js:830
   ↓
2. Mỗi sản phẩm:
   {
     id: "fs-1" to "fs-8",
     name: "Tên sản phẩm",
     price: X,
     stock: 100,
     categoryId: Y,
     ...
   }
   ↓
3. Lưu vào localStorage['products']
   ↓
4. Hiển thị carousel Flash Sale trên trang chủ
   ↓
5. Carousel tự động chuyển slide (autoPlay)
   - next() - Lines 71-79: Slide tiếp theo
   - back() - Lines 80-88: Slide trước
   ↓
6. User click "Thêm vào giỏ" trên Flash Sale
   ↓
7. scriptFlashSale.js xử lý:
   - Lấy product ID từ button: data-product-id
   - Tìm trong localStorage['products']
   - addToCart(product)
   ↓
8. Tương tự như thêm sản phẩm thường
```

**Code chính**:
- `scriptIndex.js`: khoiTaoFlashSaleProducts() - Lines 830-858
- `scriptFlashSale.js`: Event listener add-to-cart

---

### **8. SẢN PHẨM ADMIN**

**Luồng xử lý**:
```
1. Admin thêm sản phẩm mới:
   admin-products.html
   ↓
2. Điền: Tên, giá, stock, hình ảnh, mô tả, danh mục
   ↓
3. Click "Thêm sản phẩm"
   ↓
4. Tạo product object:
   {
     id: number < 100,
     name, price, stock, image,
     description, categoryId,
     ...
   }
   ↓
5. Lưu vào localStorage['products']
   ↓
6. Trigger event: storage event
   ↓
7. scriptIndex.js lắng nghe:
   window.addEventListener('storage', ...)
   ↓
8. Gọi taiSanPhamTuAdmin()
   ↓
9. Tìm sản phẩm mới (ID < 100 và không phải flash sale)
   ↓
10. Render động vào trang chủ:
    createNewProductCard(product)
    ↓
11. User có thể thêm vào giỏ ngay từ trang chủ
```

**Code chính**:
- `scriptIndex.js`: taiSanPhamTuAdmin() - Lines 735-785
- `scriptIndex.js`: createNewProductCard() - Lines 794-827
- Event delegation: document.addEventListener('click', ...) - Lines 265-322

---

## 📊 BẢNG CHỈ DẪN CODE

### **FILE: scriptIndex.js**
| Hàm | Dòng | Chức năng |
|-----|------|----------|
| updateMenuByLoginStatus() | 2-46 | Cập nhật menu khi user đăng nhập/đăng xuất |
| setupSearchForm() | 50-70 | Xử lý form tìm kiếm |
| next() | 71-79 | Carousel Flash Sale: slide tiếp theo |
| back() | 80-88 | Carousel Flash Sale: slide trước |
| autoPlay() | 89-119 | Carousel Flash Sale: tự động chuyển slide |
| addToCart(product) | 121-154 | Thêm sản phẩm vào giỏ hàng |
| updateCartCount() | 157-173 | Cập nhật số lượng giỏ ở menu |
| Event delegation add-to-cart | 265-322 | Xử lý click nút "Thêm vào giỏ" (tất cả sản phẩm) |
| _dedupeProducts() | 425-436 | Xóa trùng lặp sản phẩm |
| khoiTaoSanPhamCu() | 438-695 | Khởi tạo sản phẩm demo (bestsellers + new products) |
| xoaSanPhamLoi() | 697-730 | Xóa sản phẩm không có hình ảnh |
| taiSanPhamTuAdmin() | 735-785 | Tải sản phẩm admin mới động |
| createNewProductCard() | 794-827 | Tạo HTML card sản phẩm mới |
| khoiTaoFlashSaleProducts() | 830-858 | Khởi tạo 8 sản phẩm Flash Sale |
| khoiTaoDanhMucMacDinh() | 860-881 | Khởi tạo 10 danh mục mặc định |
| taiDanhMuc() | 882-901 | Tải danh mục vào menu |
| taiSanPhamTheoDanhMuc() | 903-991 | Hiển thị sản phẩm theo danh mục |

---

### **FILE: scriptProduct-detail.js**
| Hàm | Dòng | Chức năng |
|-----|------|----------|
| getCategoryNameById() | 5-22 | Lấy tên danh mục từ ID |
| ensureFlashSaleProductsInStorage() | 24-41 | Đảm bảo flash sale products trong storage |
| ensureDemoProductsInStorage() | 43-117 | Đảm bảo demo products trong storage |
| loadFlashSaleProductData() | 119-141 | Tải dữ liệu flash sale product |
| loadProductDataFromLocalStorage() | 143-182 | Tải dữ liệu product từ localStorage |
| updatePageWithFlashSaleData() | 184-229 | Cập nhật trang với dữ liệu flash sale |
| updatePageWithProductData() | 231-272 | Cập nhật trang với dữ liệu product |
| formatPrice() | 274-277 | Format giá thành VNĐ |
| initProductData() | 279-289 | Khởi tạo dữ liệu sản phẩm |
| getProductIdFromUrl() | 291-295 | Lấy ID sản phẩm từ URL |
| setupEventListeners() | 297-366 | Gắn event listeners |
| addToCartFromDetail() | 368-415 | Thêm vào giỏ từ trang chi tiết |
| displayRelatedProducts() | 600-665 | Hiển thị sản phẩm liên quan |

---

### **FILE: scriptCart.js**
| Hàm | Dòng | Chức năng |
|-----|------|----------|
| displayCart() | ? | Hiển thị giỏ hàng |
| updateQuantity() | ? | Cập nhật số lượng sản phẩm |
| removeItem() | ? | Xóa sản phẩm khỏi giỏ |
| applyCoupon() | ? | Áp dụng mã khuyến mãi |
| calculateTotal() | ? | Tính tổng giá |

---

### **FILE: scriptCheckout.js**
| Hàm | Dòng | Chức năng |
|-----|------|----------|
| displayOrderReview() | ? | Hiển thị thông tin đơn hàng |
| validateCustomerInfo() | ? | Validate thông tin khách |
| processOrder() | ? | Xử lý đặt hàng |
| reduceStockForOrder() | ? | Giảm tồn kho sau khi đặt |
| generateOrderId() | ? | Tạo ID đơn hàng |

---

### **FILE: scriptAccount.js**
| Hàm | Dòng | Chức năng |
|-----|------|----------|
| checkLogin() | 46-62 | Kiểm tra user đã đăng nhập |
| loadUserData() | 64-81 | Tải dữ liệu user |
| switchSection() | 83-97 | Chuyển tab (profile/orders/password) |
| handleEditSubmit() | 99-175 | Edit thông tin user |
| handlePasswordSubmit() | 177-224 | Đổi mật khẩu |
| showAlert() / hideAllAlerts() | 226-246 | Hiển thị/ẩn alert |
| cancelEdit() | 244-248 | Hủy edit |
| handleLogout() | 250-264 | Đăng xuất |
| loadOrders() | 266-373 | Hiển thị danh sách đơn hàng |
| getOrderStatusText() / getOrderStatusClass() | 375-397 | Format trạng thái đơn hàng |
| getPaymentMethodText() | 399-407 | Format phương thức thanh toán |
| handleCancelOrder() | 409-443 | Hủy đơn hàng |
| handleConfirmDelivery() | 445-479 | Xác nhận giao hàng |
| handleOpenReview() | 481-501 | Mở form đánh giá |
| syncOrdersFromAdmin() | 503-531 | Đồng bộ đơn hàng từ admin |
| openReviewModal() | 561-615 | Hiển thị modal đánh giá |
| updateStarDisplay() | 617-627 | Update hiển thị sao rating |
| closeReviewModal() | 629-631 | Đóng modal đánh giá |

---

### **FILE: scriptFlashSale.js**
| Hàm | Dòng | Chức năng |
|-----|------|----------|
| Event listener add-to-cart | 145-170 | Xử lý click thêm vào giỏ Flash Sale |
| addToCart() | 180-215 | Thêm Flash Sale product vào giỏ |

---

### **FILE: scriptSearchResults.js**
| Hàm | Dòng | Chức năng |
|-----|------|----------|
| performSearch() | 8-44 | Thực hiện tìm kiếm |
| displaySearchResults() | 45-82 | Hiển thị kết quả tìm kiếm |
| showNoResults() | 84-91 | Hiển thị "không tìm thấy" |
| setupSearchForm() | 93-108 | Xử lý form tìm kiếm |
| addToCart() | 110-157 | Thêm vào giỏ từ kết quả tìm kiếm |
| updateCartCount() | 160-173 | Cập nhật số lượng giỏ |
| updateMenuByLoginStatus() | 175-219 | Cập nhật menu theo đăng nhập |

---

### **FILE: scriptCategory-products.js**
| Hàm | Dòng | Chức năng |
|-----|------|----------|
| getCategoryFromUrl() | ? | Lấy danh mục từ URL |
| loadProductsByCategory() | ? | Tải sản phẩm theo danh mục |
| addToCart() | 153 | Thêm vào giỏ từ danh mục |
| displayProducts() | ? | Hiển thị sản phẩm |

---

### **FILE: scriptLogin-register.js**
| Hàm | Dòng | Chức năng |
|-----|------|----------|
| handleLogin() | ? | Xử lý đăng nhập |
| handleRegister() | ? | Xử lý đăng ký |
| validateEmail() | ? | Validate email |
| validatePassword() | ? | Validate mật khẩu |

---

### **FILE: scriptPromotions.js**
| Hàm | Dòng | Chức năng |
|-----|------|----------|
| renderPromos() | 7-70 | Render danh sách khuyến mãi |
| filterPromos() | 72-86 | Filter khuyến mãi |
| copyCode() | 88-99 | Copy code khuyến mãi |

---

## 🔄 LUỒNG DỮ LIỆU CHÍNH

### **Sơ đồ luồng Add to Cart → Checkout → Create Order**:

```
┌─────────────────────────────────────────────────────────────┐
│                    THÊM VÀO GIỎ HÀNG                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User click "Thêm vào giỏ"                                  │
│     ↓                                                        │
│  Event delegation catches click                             │
│     ↓                                                        │
│  addToCart(product) {                                       │
│    - Lấy stock từ localStorage['products']                 │
│    - Kiểm tra stock >= quantity                            │
│    - Lấy cart từ localStorage['cart']                      │
│    - Kiểm tra sản phẩm đã trong giỏ?                       │
│      - Nếu có: Cộng quantity                               │
│      - Nếu không: Thêm mới                                 │
│    - Kiểm tra quantity mới <= stock                        │
│    - Lưu vào localStorage['cart']                          │
│    - Cập nhật số lượng ở menu                              │
│  }                                                          │
│     ↓                                                        │
│  Hiển thị alert "Thêm thành công"                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          ↓↓↓
┌─────────────────────────────────────────────────────────────┐
│                    TRANG GIỎ HÀNG                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  displayCart() {                                            │
│    - Lấy cart từ localStorage['cart']                      │
│    - Với mỗi item:                                         │
│      - Hiển thị trong HTML                                 │
│      - Gắn nút "-", "+", "Xóa"                             │
│    - updateQuantity() khi user thay đổi                    │
│    - calculateTotal(): Tính tổng giá                       │
│  }                                                          │
│                                                              │
│  Người dùng có thể:                                        │
│    - Thay đổi số lượng (kiểm tra stock)                    │
│    - Xóa sản phẩm khỏi giỏ                                 │
│    - Nhập mã khuyến mãi (applyCoupon)                      │
│    - Click "Tiến hành thanh toán"                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          ↓↓↓
┌─────────────────────────────────────────────────────────────┐
│                    TRANG CHECKOUT                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  displayOrderReview() {                                    │
│    - Hiển thị lại giỏ hàng                                 │
│    - Hiển thị tổng giá                                     │
│  }                                                          │
│                                                              │
│  Người dùng:                                               │
│    - Nhập thông tin khách hàng                             │
│    - Chọn phương thức thanh toán                           │
│    - Click "Xác nhận đặt hàng"                             │
│                                                              │
│  processOrder() {                                          │
│    - Validate thông tin khách                              │
│    - Lấy cart từ localStorage['cart']                      │
│    - Với mỗi item:                                         │
│      - Lấy sản phẩm từ localStorage['products']            │
│      - Kiểm tra stock còn đủ không                         │
│    - Tính toán tổng tiền                                   │
│    - Tạo order object                                      │
│    - Lưu vào localStorage['orders']                        │
│    - Nếu user đăng nhập: Thêm vào userData['orders']       │
│    - Gọi reduceStockForOrder():                            │
│        - Trừ stock: product.stock -= quantity              │
│        - Cập nhật localStorage['products']                 │
│    - Clear cart: removeItem('cart')                        │
│    - Redirect tới success page                             │
│  }                                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          ↓↓↓
┌─────────────────────────────────────────────────────────────┐
│                    QUẢN LÝ TỒN KHO                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  localStorage['products'] được cập nhật:                   │
│    ↓                                                        │
│  Sản phẩm 1: stock 50 → 48                                 │
│  Sản phẩm 2: stock 100 → 99                                │
│  ...                                                        │
│                                                              │
│  Lần sau user vào trang:                                   │
│    - Sản phẩm hiển thị stock mới                           │
│    - Nếu stock = 0: "Hết hàng"                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### **4. ĐĂNG NHẬP / ĐĂNG KÝ - HỆ THỐNG XÁC THỰC**

#### **Luồng Đăng Ký (Register)**:

```javascript
// ========================================
// scriptLogin-register.js - Đăng ký
// ========================================

function handleRegister() {
  // Lấy giá trị từ form
  const name = document.querySelector('#register-name').value.trim();
  const email = document.querySelector('#register-email').value.trim();
  const password = document.querySelector('#register-password').value;
  const confirmPassword = document.querySelector('#register-confirm-password').value;
  
  // BƯỚC 1: Validate dữ liệu
  if (!name) {
    alert('❌ Vui lòng nhập họ tên');
    return false;
  }
  
  if (!email) {
    alert('❌ Vui lòng nhập email');
    return false;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('❌ Email không hợp lệ');
    return false;
  }
  
  if (!password || password.length < 6) {
    alert('❌ Mật khẩu tối thiểu 6 ký tự');
    return false;
  }
  
  if (password !== confirmPassword) {
    alert('❌ Mật khẩu không khớp');
    return false;
  }
  
  // BƯỚC 2: Lấy danh sách user hiện có
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // BƯỚC 3: Kiểm tra email đã tồn tại chưa
  if (users.find(u => u.email === email)) {
    alert('❌ Email này đã được đăng ký');
    return false;
  }
  
  // BƯỚC 4: Tạo user object mới
  const newUser = {
    id: users.length + 1,                    // ID user
    name: name,
    email: email,
    password: password,                      // ⚠️ Trong thực tế phải hash!
    phone: '',
    address: '',
    createdDate: new Date().toISOString(),
    orders: []                               // Danh sách đơn hàng
  };
  
  console.log('👤 Tạo user mới:', newUser);
  
  // BƯỚC 5: Lưu vào danh sách users
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // BƯỚC 6: Thông báo thành công
  alert('✅ Đăng ký thành công! Vui lòng đăng nhập.');
  
  // BƯỚC 7: Chuyển sang tab đăng nhập
  document.querySelector('#login-tab').click();
  
  return true;
}
```

#### **Luồng Đăng Nhập (Login)**:

```javascript
// ========================================
// scriptLogin-register.js - Đăng nhập
// ========================================

function handleLogin() {
  // Lấy giá trị từ form
  const email = document.querySelector('#login-email').value.trim();
  const password = document.querySelector('#login-password').value;
  
  // BƯỚC 1: Validate dữ liệu
  if (!email || !password) {
    alert('❌ Vui lòng nhập email và mật khẩu');
    return false;
  }
  
  // BƯỚC 2: Lấy danh sách users từ localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // BƯỚC 3: Tìm user có email và password khớp
  const user = users.find(
    u => u.email === email && u.password === password
  );
  
  if (!user) {
    // BƯỚC 4a: Không tìm thấy user
    alert('❌ Email hoặc mật khẩu không đúng');
    console.log('📝 Danh sách user:', users);
    return false;
  }
  
  // BƯỚC 4b: Tìm thấy user → Lưu vào userData
  console.log('✅ Đăng nhập thành công:', user.name);
  
  localStorage.setItem('userData', JSON.stringify(user));
  
  // BƯỚC 5: Cập nhật menu
  updateMenuByLoginStatus();
  
  // BƯỚC 6: Hiển thị thông báo
  alert(`✅ Chào mừng ${user.name}!`);
  
  // BƯỚC 7: Chuyển hướng tới trang chủ
  window.location.href = 'index.html';
  
  return true;
}

// ========================================
// scriptAccount.js - Đăng xuất (Logout)
// ========================================

function handleLogout() {
  // Xóa userData khỏi localStorage
  localStorage.removeItem('userData');
  
  // Xóa giỏ hàng (optional)
  // localStorage.removeItem('cart');
  
  console.log('👋 Đã đăng xuất');
  
  alert('✅ Đã đăng xuất thành công');
  
  // Reload trang để cập nhật menu
  window.location.href = 'index.html';
}
```

---

### **5. FLASH SALE - BỘ PHẬN KHUYẾN MÃI ĐẶC BIỆT**

#### **Cách hoạt động chi tiết**:

```javascript
// ========================================
// scriptIndex.js - Khởi tạo Flash Sale
// ========================================

function khoiTaoFlashSaleProducts() {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  // Kiểm tra đã có flash sale chưa
  if (products.find(p => p.id === 'fs-1')) {
    console.log('⚡ Flash Sale đã được khởi tạo');
    return;
  }
  
  console.log('⚡ Khởi tạo 8 sản phẩm Flash Sale mới');
  
  const flashSaleProducts = [];
  
  for (let i = 1; i <= 8; i++) {
    const product = {
      id: `fs-${i}`,                    // ⭐ ID là string (fs-1, fs-2, ...)
      name: `Flash Sale Product ${i}`,
      price: 99000 + (i * 10000),
      oldPrice: 200000 + (i * 20000),
      image: `images/flashsale${i}.webp`,
      categoryId: 1,
      category: "Flash Sale",
      stock: 100,
      description: `Sản phẩm Flash Sale #${i} giá rất tốt!`,
      reviews: [],
      discount: -50                     // Giảm 50%
    };
    
    flashSaleProducts.push(product);
  }
  
  // Thêm vào danh sách products
  products.push(...flashSaleProducts);
  localStorage.setItem('products', JSON.stringify(products));
  
  console.log('✅ Đã thêm 8 sản phẩm Flash Sale');
}

// ========================================
// scriptIndex.js - Carousel Flash Sale
// ========================================

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function next() {
  // Bỏ class active khỏi slide cũ
  slides[currentSlide].classList.remove('active');
  
  // Chuyển sang slide tiếp theo (nếu end → quay lại đầu)
  currentSlide = (currentSlide + 1) % totalSlides;
  
  // Thêm class active vào slide mới
  slides[currentSlide].classList.add('active');
  
  console.log(`📸 Slide ${currentSlide + 1}/${totalSlides}`);
}

function autoPlay() {
  // Mỗi 5 giây tự động chuyển slide
  setInterval(next, 5000);
}

// ========================================
// scriptFlashSale.js - Thêm vào giỏ từ Flash Sale
// ========================================

// Event listener: Click vào nút thêm giỏ trên Flash Sale
document.addEventListener('click', function(e) {
  // Kiểm tra xem click vào nút .add-to-cart không
  const button = e.target.closest('.add-to-cart');
  
  if (!button) return;
  
  e.preventDefault();
  
  // Lấy product ID từ data attribute
  const productId = button.getAttribute('data-product-id');
  
  // Ví dụ: productId = "fs-1"
  console.log('🛒 Thêm Flash Sale product:', productId);
  
  // Tìm sản phẩm
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const product = products.find(p => String(p.id) === String(productId));
  
  if (!product) {
    alert('❌ Sản phẩm không tìm thấy');
    return;
  }
  
  // Gọi hàm addToCart
  addToCart(product);
});
```

---

### **6. TÌM KIẾM & DANH MỤC - FILTER SẢN PHẨM**

#### **Tìm Kiếm (Search)**:

```javascript
// ========================================
// scriptIndex.js - Setup tìm kiếm
// ========================================

function setupSearchForm() {
  // Lấy form tìm kiếm
  const searchForm = document.querySelector('.search-form');
  
  if (!searchForm) return;
  
  // Gắn sự kiện submit
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Lấy từ khóa tìm kiếm
    const query = document.querySelector('.search-input').value.trim();
    
    if (!query) {
      alert('❌ Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    
    console.log('🔍 Tìm kiếm:', query);
    
    // Redirect sang trang kết quả tìm kiếm
    window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
  });
}

// ========================================
// scriptSearchResults.js - Tìm kiếm chi tiết
// ========================================

function performSearch() {
  // Lấy từ khóa từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('query');
  
  if (!query) {
    document.querySelector('.results').innerHTML = '<p>❌ Không có từ khóa tìm kiếm</p>';
    return;
  }
  
  console.log('🔍 Tìm kiếm cho:', query);
  
  // Lấy tất cả sản phẩm
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  // Filter sản phẩm theo từ khóa
  const results = products.filter(product => {
    // Chuyển sang lowercase để so sánh không phân biệt hoa thường
    const queryLower = query.toLowerCase();
    
    return (
      product.name.toLowerCase().includes(queryLower) ||
      product.description.toLowerCase().includes(queryLower) ||
      product.category.toLowerCase().includes(queryLower)
    );
  });
  
  console.log(`✅ Tìm thấy ${results.length} sản phẩm`);
  
  // Hiển thị kết quả
  displaySearchResults(results);
}

function displaySearchResults(results) {
  const container = document.querySelector('.results-container');
  
  if (results.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <h2>❌ Không tìm thấy sản phẩm</h2>
        <p>Vui lòng thử lại với từ khóa khác</p>
      </div>
    `;
    return;
  }
  
  // Hiển thị các sản phẩm
  container.innerHTML = results.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${product.price.toLocaleString()}đ</p>
      <p class="stock">
        ${product.stock > 0 ? `✅ Còn ${product.stock}` : '❌ Hết hàng'}
      </p>
      <button class="add-to-cart" data-product-id="${product.id}">
        ${product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
      </button>
      <a href="product-detail.html?id=${product.id}">Xem chi tiết</a>
    </div>
  `).join('');
}
```

#### **Danh Mục (Category)**:

```javascript
// ========================================
// scriptIndex.js - Khởi tạo danh mục
// ========================================

function khoiTaoDanhMucMacDinh() {
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  
  // Nếu đã có danh mục → Thoát
  if (categories.length > 0) {
    console.log('📁 Danh mục đã được khởi tạo');
    return;
  }
  
  const defaultCategories = [
    { id: 1, name: "Quà tặng", description: "Các loại quà tặng đặc biệt" },
    { id: 2, name: "Quà tặng thú cưng", description: "Quà cho các bé thú cưng" },
    { id: 3, name: "Quà tặng dễ thương", description: "Những lựa chọn dễ thương" },
    { id: 4, name: "Quà tặng Giáng sinh", description: "Quà Noel đặc biệt" },
    { id: 5, name: "Quà tặng thần tài", description: "Quà phong phú, may mắn" },
    { id: 6, name: "Quà tặng phong thủy", description: "Theo ngũ hành phong thủy" },
    { id: 7, name: "Túi hộp đựng quà", description: "Các loại túi hộp đẹp" },
    { id: 8, name: "Quà tặng cao cấp", description: "Các sản phẩm premium" },
    { id: 9, name: "Quà tặng văn phòng", description: "Phù hợp cho doanh nghiệp" },
    { id: 10, name: "Khác", description: "Các mục khác" }
  ];
  
  localStorage.setItem('categories', JSON.stringify(defaultCategories));
  console.log('✅ Đã khởi tạo 10 danh mục mặc định');
}

// ========================================
// scriptCategory-products.js - Hiển thị sản phẩm theo danh mục
// ========================================

function loadProductsByCategory() {
  // Lấy danh mục từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoryName = urlParams.get('category');
  
  if (!categoryName) {
    alert('❌ Không có danh mục');
    return;
  }
  
  console.log('📁 Danh mục:', categoryName);
  
  // Lấy danh sách danh mục
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');
  const category = categories.find(c => c.name === categoryName);
  
  if (!category) {
    alert('❌ Danh mục không tìm thấy');
    return;
  }
  
  // Lấy tất cả sản phẩm
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  // Filter sản phẩm cùng danh mục
  const categoryProducts = products.filter(
    p => p.categoryId === category.id
  );
  
  console.log(`✅ Tìm thấy ${categoryProducts.length} sản phẩm`);
  
  // Hiển thị sản phẩm
  displayCategoryProducts(categoryProducts);
}

function displayCategoryProducts(products) {
  const container = document.querySelector('.products-container');
  
  if (products.length === 0) {
    container.innerHTML = '<p>❌ Không có sản phẩm trong danh mục này</p>';
    return;
  }
  
  container.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${product.price.toLocaleString()}đ</p>
      <button class="add-to-cart" data-product-id="${product.id}">
        Thêm vào giỏ
      </button>
    </div>
  `).join('');
}
```

---

## 🎓 KẾT LUẬN

**NDT GIFT SHOP** là một ứng dụng web **100% Client-side** (không backend) với:

✅ **Quản lý sản phẩm**: CRUD products trong localStorage
✅ **Quản lý giỏ hàng**: Add, update, remove items
✅ **Hệ thống thanh toán**: Validate, tạo order, reduce stock
✅ **Hệ thống user**: Đăng ký, đăng nhập, quản lý profile, xem đơn hàng
✅ **Hệ thống admin**: Thêm sản phẩm, quản lý đơn hàng, khuyến mãi
✅ **Tìm kiếm & filter**: Theo danh mục, tìm kiếm theo từ khóa
✅ **Flash Sale**: Sản phẩm khuyến mãi đặc biệt
✅ **Event Delegation**: Xử lý sự kiện cho cả phần tử tĩnh lẫn động
✅ **localStorage**: Lưu trữ toàn bộ dữ liệu
✅ **Đánh giá**: User có thể đánh giá sản phẩm sau khi nhận hàng

**Tất cả dữ liệu được lưu trữ trong `localStorage` của trình duyệt**, không có backend server.

---

### **⭐ Các điểm quan trọng cần nhớ**:

1. **Event Delegation** (Dòng 265-322 trong scriptIndex.js):
   - Sử dụng `document.addEventListener` thay vì `querySelectorAll().forEach()`
   - Cho phép xử lý cả phần tử được thêm động

2. **ID Conversion** (String vs Number):
   - Lúc so sánh ID luôn dùng `String(id)` vì có ID dạng số (100) và string ("fs-1")
   - Ví dụ: `String(product.id) === String(productId)`

3. **Stock Kiểm Tra 4 lần**:
   - Khi thêm vào giỏ
   - Khi update quantity
   - Trước checkout
   - Sau checkout → Trừ stock

4. **localStorage là "Database"**:
   - `products`: Danh sách sản phẩm
   - `cart`: Giỏ hàng hiện tại
   - `orders`: Tất cả đơn hàng
   - `users`: Tất cả user
   - `userData`: User đang đăng nhập

5. **Sản phẩm Admin thêm động**:
   - Bắt sự kiện thay đổi localStorage bằng `window.addEventListener('storage', ...)`
   - Render sản phẩm mới mà không cần reload trang

---

**Tài liệu này giúp bạn hiểu rõ cách hoạt động của từng phần trong web!** 🎉
