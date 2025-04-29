document.addEventListener('DOMContentLoaded', () => {
    // — Helpers ——
    const API = path => `${window.location.origin}${path}`;
    const getToken = () => localStorage.getItem('token');
    const setToken = t => localStorage.setItem('token', t);
    const clearToken = () => localStorage.removeItem('token');
  
    // — Elements ——
    const headerAccount        = document.querySelector('.account');
    const loginSection         = document.getElementById('login-section');
    const userLoginBtn         = document.getElementById('user-login-btn');
    const userRegisterBtn      = document.getElementById('user-register-btn');
    const retailerLoginBtn     = document.getElementById('retailer-login-btn');
    const retailerRegisterBtn  = document.getElementById('retailer-register-btn');
    const userLoginForm        = document.getElementById('user-login-form');
    const userRegisterForm     = document.getElementById('user-register-form');
    const retailerLoginForm    = document.getElementById('retailer-login-form');
    const retailerRegisterForm = document.getElementById('retailer-register-form');
    const dashboard            = document.getElementById('retailer-dashboard');
    const createShopBtn        = document.getElementById('create-shop-btn');
    const addProductBtn        = document.getElementById('add-product-btn');
    const viewProductsBtn      = document.getElementById('view-products-btn');
    const createShopForm       = document.getElementById('create-shop-form');
    const addProductForm       = document.getElementById('add-product-form');
    const viewProductsList     = document.getElementById('view-products-list');
    const productList          = document.getElementById('product-list');
    const cartCountSpan        = document.querySelector('.cart-count');
    const searchInput          = document.getElementById('search-input');
    const searchBtn            = document.getElementById('search-btn');
    const newsletterForm       = document.querySelector('.newsletter form');
  
    let cartCount = 0;
  
    // — UI Helpers ——
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
  
    function renderAccountLink() {
      const token = getToken();
      if (token) {
        headerAccount.innerHTML = `<a href="javascript:void(0)" id="logout-link">Logout</a>`;
        document.getElementById('logout-link').onclick = e => {
          e.preventDefault();
          clearToken();
          alert('Logged out');
          init();
        };
      } else {
        headerAccount.innerHTML = `<a href="javascript:void(0)" id="login-link">Login</a>`;
        document.getElementById('login-link').onclick = e => {
          e.preventDefault();
          hideAll();
          loginSection.style.display = 'block';
        };
      }
    }
  
    // — Initialization ——
    function init() {
      hideAll();
      renderAccountLink();
      const token = getToken();
      if (token) {
        // If retailer token, show dashboard
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.type === 'retailer') {
            dashboard.style.display = 'block';
          }
        } catch {}
      }
    }
  
    // — Button Toggles ——
    userLoginBtn.onclick       = () => { hideAll(); loginSection.style.display = 'block'; userLoginForm.style.display = 'block'; };
    userRegisterBtn.onclick    = () => { hideAll(); loginSection.style.display = 'block'; userRegisterForm.style.display = 'block'; };
    retailerLoginBtn.onclick   = () => { hideAll(); loginSection.style.display = 'block'; retailerLoginForm.style.display = 'block'; };
    retailerRegisterBtn.onclick= () => { hideAll(); loginSection.style.display = 'block'; retailerRegisterForm.style.display = 'block'; };
    createShopBtn.onclick      = () => { hideAll(); dashboard.style.display = 'block'; createShopForm.style.display = 'block'; };
    addProductBtn.onclick      = () => { hideAll(); dashboard.style.display = 'block'; addProductForm.style.display = 'block'; };
    viewProductsBtn.onclick    = async () => {
      hideAll();
      dashboard.style.display = 'block';
      viewProductsList.style.display = 'block';
      const res = await fetch(API('/api/products'), {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const prods = await res.json();
      productList.innerHTML = prods.map(p => `<li>${p.name} — $${p.price}</li>`).join('');
    };
  
    // — Form Submissions ——
    userRegisterForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('reg-email').value;
      const pwd   = document.getElementById('reg-password').value;
      const res   = await fetch(API('/api/users/register'), {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password: pwd })
      });
      const data  = await res.json();
      if (!res.ok) return alert(data.message);
      setToken(data.token);
      alert('User registered!');
      init();
    });
  
    userLoginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pwd   = document.getElementById('login-password').value;
      const res   = await fetch(API('/api/users/login'), {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password: pwd })
      });
      const data  = await res.json();
      if (!res.ok) return alert(data.message);
      setToken(data.token);
      alert('User logged in!');
      init();
    });
  
    retailerRegisterForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('retailer-reg-email').value;
      const pwd   = document.getElementById('retailer-reg-password').value;
      const res   = await fetch(API('/api/retailers/register'), {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password: pwd })
      });
      const data  = await res.json();
      if (!res.ok) return alert(data.message);
      setToken(data.token);
      alert('Retailer registered!');
      init();
    });
  
    retailerLoginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('retailer-login-email').value;
      const pwd   = document.getElementById('retailer-login-password').value;
      const res   = await fetch(API('/api/retailers/login'), {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password: pwd })
      });
      const data  = await res.json();
      if (!res.ok) return alert(data.message);
      setToken(data.token);
      alert('Retailer logged in!');
      init();
    });
  
    createShopForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('shop-name').value;
      const desc = document.getElementById('shop-description').value;
      const res  = await fetch(API('/api/shops'), {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${getToken()}`
        },
        body: JSON.stringify({ name, description: desc })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert(`Shop "${data.name}" created!`);
      init();
    });
  
    addProductForm.addEventListener('submit', async e => {
      e.preventDefault();
      const body = {
        name:        document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price:       parseFloat(document.getElementById('product-price').value),
        imageUrl:    ''
      };
      const res  = await fetch(API('/api/products'), {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert(`Product "${data.name}" added!`);
      init();
    });
  
    // — Featured & Search ——
    async function loadFeatured() {
      const res = await fetch(API('/api/products/featured'));
      const prods = await res.json();
      document.querySelector('.product-grid').innerHTML = prods.map(p => `
        <div class="product-card">
          <img src="${p.imageUrl||'product-placeholder.png'}" alt="${p.name}"/>
          <h3>${p.name}</h3>
          <p class="price">$${p.price}</p>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      `).join('');
      document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.onclick = () => {
          cartCount++;
          cartCountSpan.textContent = `(${cartCount})`;
        };
      });
    }
    loadFeatured();
  
    searchBtn.onclick = () => {
      const term = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(term) ? '' : 'none';
      });
    };
  
    newsletterForm.onsubmit = e => {
      e.preventDefault();
      alert(`Thanks for subscribing, ${newsletterForm.querySelector('input').value}!`);
      newsletterForm.reset();
    };
  
    // — Kickoff —
    init();
  });
  