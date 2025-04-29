document.addEventListener('DOMContentLoaded', () => {
    // Helper to build full API URL
    const API = path => `${window.location.origin}${path}`;
    // Token helpers
    const getToken    = () => localStorage.getItem('token');
    const setToken    = t => localStorage.setItem('token', t);
    const clearToken  = () => localStorage.removeItem('token');
  
    // Element refs
    const headerAccount         = document.querySelector('.account');
    const loginLink             = document.getElementById('login-link');
    const loginSection          = document.getElementById('login-section');
    const userLoginBtn          = document.getElementById('user-login-btn');
    const userRegisterBtn       = document.getElementById('user-register-btn');
    const retailerLoginBtn      = document.getElementById('retailer-login-btn');
    const retailerRegisterBtn   = document.getElementById('retailer-register-btn');
    const userLoginForm         = document.getElementById('userLoginForm');
    const userRegisterForm      = document.getElementById('userRegisterForm');
    const retailerLoginForm     = document.getElementById('retailerLoginForm');
    const retailerRegisterForm  = document.getElementById('retailerRegisterForm');
    const dashboard             = document.getElementById('retailer-dashboard');
    const createShopBtn         = document.getElementById('create-shop-btn');
    const addProductBtn         = document.getElementById('add-product-btn');
    const viewProductsBtn       = document.getElementById('view-products-btn');
    const createShopForm        = document.getElementById('createShopForm');
    const addProductForm        = document.getElementById('addProductForm');
    const viewProductsList      = document.getElementById('view-products-list');
    const productList           = document.getElementById('product-list');
    const cartCountSpan         = document.querySelector('.cart-count');
    const searchInput           = document.getElementById('search-input');
    const searchBtn             = document.getElementById('search-btn');
    const newsletterForm        = document.querySelector('.newsletter form');
  
    let cartCount = 0;
  
    // Hide everything helper
    function hideAll() {
      loginSection.style.display        = 'none';
      userLoginForm.style.display       = 'none';
      userRegisterForm.style.display    = 'none';
      retailerLoginForm.style.display   = 'none';
      retailerRegisterForm.style.display= 'none';
      dashboard.style.display           = 'none';
      createShopForm.style.display      = 'none';
      addProductForm.style.display      = 'none';
      viewProductsList.style.display    = 'none';
    }
  
    // Show dynamic Logout link
    function renderAccount() {
      const token = getToken();
      headerAccount.innerHTML =
        token
          ? `<a href="javascript:void(0)" id="logout-link">Logout</a>`
          : `<a href="javascript:void(0)" id="login-link">Login</a>`;
  
      const a = document.getElementById('logout-link') || document.getElementById('login-link');
      a.onclick = e => {
        e.preventDefault();
        if (token) {
          clearToken();
          alert('Logged out');
          init();
        } else {
          hideAll();
          loginSection.style.display = 'block';
        }
      };
    }
  
    // Initialize UI based on login state
    function init() {
      hideAll();
      renderAccount();
  
      const token = getToken();
      if (token) {
        // Peek JWT to see if retailer
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.type === 'retailer') {
            dashboard.style.display = 'block';
          }
        } catch {}
      }
    }
  
    // Toggle handlers
    userLoginBtn.onclick    = () => { hideAll(); loginSection.style.display = 'block'; userLoginForm.style.display = 'block'; };
    userRegisterBtn.onclick = () => { hideAll(); loginSection.style.display = 'block'; userRegisterForm.style.display = 'block'; };
    retailerLoginBtn.onclick    = () => { hideAll(); loginSection.style.display = 'block'; retailerLoginForm.style.display = 'block'; };
    retailerRegisterBtn.onclick = () => { hideAll(); loginSection.style.display = 'block'; retailerRegisterForm.style.display = 'block'; };
    createShopBtn.onclick       = () => { hideAll(); dashboard.style.display = 'block'; createShopForm.style.display = 'block'; };
    addProductBtn.onclick       = () => { hideAll(); dashboard.style.display = 'block'; addProductForm.style.display = 'block'; };
    viewProductsBtn.onclick = async () => {
      hideAll();
      dashboard.style.display = 'block';
      viewProductsList.style.display = 'block';
      const res = await fetch(API('/api/products'), {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const prods = await res.json();
      productList.innerHTML = prods.map(p => `<li>${p.name} — $${p.price}</li>`).join('');
    };
  
    // Form submissions
    userRegisterForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('reg-email').value;
      const pwd   = document.getElementById('reg-password').value;
      const r     = await fetch(API('/api/users/register'), {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password: pwd })
      });
      const d = await r.json();
      if (!r.ok) return alert(d.message);
      setToken(d.token);
      alert('User registered!');
      init();
    });
  
    userLoginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pwd   = document.getElementById('login-password').value;
      const r     = await fetch(API('/api/users/login'), {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password: pwd })
      });
      const d = await r.json();
      if (!r.ok) return alert(d.message);
      setToken(d.token);
      alert('User logged in!');
      init();
    });
  
    retailerRegisterForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('retailer-reg-email').value;
      const pwd   = document.getElementById('retailer-reg-password').value;
      const r     = await fetch(API('/api/retailers/register'), {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password: pwd })
      });
      const d = await r.json();
      if (!r.ok) return alert(d.message);
      setToken(d.token);
      alert('Retailer registered!');
      init();
    });
  
    retailerLoginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('retailer-login-email').value;
      const pwd   = document.getElementById('retailer-login-password').value;
      const r     = await fetch(API('/api/retailers/login'), {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password: pwd })
      });
      const d = await r.json();
      if (!r.ok) return alert(d.message);
      setToken(d.token);
      alert('Retailer logged in!');
      init();
    });
  
    createShopForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('shop-name').value;
      const desc = document.getElementById('shop-description').value;
      const r = await fetch(API('/api/shops'), {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${getToken()}`
        },
        body: JSON.stringify({ name, description: desc })
      });
      const d = await r.json();
      if (!r.ok) return alert(d.message);
      alert(`Shop "${d.name}" created!`);
      init();
    });
  
    addProductForm.addEventListener('submit', async e => {
      e.preventDefault();
      const body = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        imageUrl: ''
      };
      const r = await fetch(API('/api/products'), {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });
      const d = await r.json();
      if (!r.ok) return alert(d.message);
      alert(`Product "${d.name}" added!`);
      init();
    });
  
    // Load & render featured products + setup cart
    async function loadFeatured() {
      const r = await fetch(API('/api/products/featured'));
      const items = await r.json();
      const grid = document.querySelector('.product-grid');
      grid.innerHTML = items.map(p => `
        <div class="product-card">
          <img src="${p.imageUrl||'product-placeholder.png'}" alt="${p.name}"/>
          <h3>${p.name}</h3>
          <p class="price">$${p.price}</p>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      `).join('');
      grid.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.onclick = () => {
          cartCount++;
          cartCountSpan.textContent = `(${cartCount})`;
        };
      });
    }
  
    // Search handler
    searchBtn.onclick = () => {
      const term = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.product-card').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = name.includes(term) ? '' : 'none';
      });
    };
  
    // Newsletter stub
    newsletterForm.onsubmit = e => {
      e.preventDefault();
      const em = newsletterForm.querySelector('input').value;
      alert(`Thanks for subscribing, ${em}!`);
      newsletterForm.reset();
    };
  
    // Kick things off
    init();
    loadFeatured();
  });
  