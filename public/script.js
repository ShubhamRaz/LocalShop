document.addEventListener('DOMContentLoaded', () => {
    const loginLink        = document.getElementById('login-link');
    const loginSection     = document.getElementById('login-section');
    const userLoginBtn     = document.getElementById('user-login-btn');
    const userRegisterBtn  = document.getElementById('user-register-btn');
    const retailerLoginBtn = document.getElementById('retailer-login-btn');
    const userLoginForm    = document.getElementById('user-login-form');
    const userRegisterForm = document.getElementById('user-register-form');
    const retailerLoginForm= document.getElementById('retailer-login-form');
    const dashboard        = document.getElementById('retailer-dashboard');
    const createShopBtn    = document.getElementById('create-shop-btn');
    const addProductBtn    = document.getElementById('add-product-btn');
    const viewProductsBtn  = document.getElementById('view-products-btn');
    const createShopForm   = document.getElementById('create-shop-form');
    const addProductForm   = document.getElementById('add-product-form');
    const viewProductsList = document.getElementById('view-products-list');
    const productList      = document.getElementById('product-list');
    const cartCountSpan    = document.querySelector('.cart-count');
    let cartCount          = 0;
  
    const API = path => `http://localhost:${process.env.PORT||3000}${path}`;
  
    // Show login
    loginLink.onclick = e => {
      e.preventDefault();
      loginSection.style.display = 'block';
      dashboard.style.display    = 'none';
    };
  
    // Toggle forms
    userLoginBtn.onclick     = () => { userLoginForm.style.display = 'block'; userRegisterForm.style.display = retailerLoginForm.style.display = 'none'; };
    userRegisterBtn.onclick  = () => { userRegisterForm.style.display = 'block'; userLoginForm.style.display = retailerLoginForm.style.display = 'none'; };
    retailerLoginBtn.onclick = () => { retailerLoginForm.style.display = 'block'; userLoginForm.style.display = userRegisterForm.style.display = 'none'; };
  
    const getToken = () => localStorage.getItem('token');
  
    // Register
    userRegisterForm?.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = e.target['user-email'].value;
      const password = e.target['user-password'].value;
      const res = await fetch(API('/api/users/register'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Registered and logged in!');
        loginSection.style.display = 'none';
      } else alert(data.message);
    });
  
    // Login user
    userLoginForm?.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = e.target['user-email'].value;
      const password = e.target['user-password'].value;
      const res = await fetch(API('/api/users/login'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('User logged in!');
        loginSection.style.display = 'none';
      } else alert(data.message);
    });
  
    // Login retailer
    retailerLoginForm?.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = e.target['retailer-email'].value;
      const password = e.target['retailer-password'].value;
      const res = await fetch(API('/api/retailers/login'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Retailer logged in!');
        loginSection.style.display = 'none';
        dashboard.style.display    = 'block';
      } else alert(data.message);
    });
  
    // Dashboard nav
    createShopBtn.onclick    = () => { createShopForm.style.display = 'block'; addProductForm.style.display = viewProductsList.style.display = 'none'; };
    addProductBtn.onclick    = () => { addProductForm.style.display = 'block'; createShopForm.style.display = viewProductsList.style.display = 'none'; };
    viewProductsBtn.onclick  = async () => {
      viewProductsList.style.display = 'block';
      createShopForm.style.display   = addProductForm.style.display = 'none';
      const res = await fetch(API('/api/products'), {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const prods = await res.json();
      productList.innerHTML = prods.map(p => `<li>${p.name} — $${p.price}</li>`).join('');
    };
  
    // Create shop
    createShopForm?.addEventListener('submit', async e => {
      e.preventDefault();
      const name = e.target['shop-name'].value;
      const desc = e.target['shop-description'].value;
      const res = await fetch(API('/api/shops'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name, description: desc })
      });
      const shop = await res.json();
      if (res.ok) alert(`Shop created: ${shop.name}`);
      else alert(shop.message);
    });
  
    // Add product
    addProductForm?.addEventListener('submit', async e => {
      e.preventDefault();
      const body = {
        name:        e.target['product-name'].value,
        description: e.target['product-description'].value,
        price:       parseFloat(e.target['product-price'].value),
        imageUrl:    ''
      };
      const res = await fetch(API('/api/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(body)
      });
      const prod = await res.json();
      if (res.ok) alert(`Product added: ${prod.name}`);
      else alert(prod.message);
    });
  
    // Load featured
    ;(async function() {
      const res = await fetch(API('/api/products/featured'));
      const prods = await res.json();
      document.querySelector('.product-grid').innerHTML = prods.map(p => `
        <div class="product-card">
          <img src="${p.imageUrl||'product-placeholder.png'}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="price">$${p.price}</p>
          <button class="add-to-cart" data-id="${p._id}">Add to Cart</button>
        </div>
      `).join('');
      document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.onclick = () => {
          cartCount++;
          cartCountSpan.textContent = `(${cartCount})`;
        };
      });
    })();
  
    // Init hide
    loginSection.style.display      = 'none';
    dashboard.style.display         = 'none';
    createShopForm.style.display    = 'none';
    addProductForm.style.display    = 'none';
    viewProductsList.style.display  = 'none';
  });
  