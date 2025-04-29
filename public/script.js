document.addEventListener('DOMContentLoaded', () => {
    // ———————— Helpers ————————
    const API = path => `${window.location.origin}${path}`;
    const getToken = () => localStorage.getItem('token');
    const setToken = t => localStorage.setItem('token', t);
    const clearToken = () => localStorage.removeItem('token');
  
    // ———————— Elements ————————
    const loginLink          = document.getElementById('login-link');
    const headerAccount      = document.querySelector('.account');
    const loginSection       = document.getElementById('login-section');
    const userLoginBtn       = document.getElementById('user-login-btn');
    const userRegisterBtn    = document.getElementById('user-register-btn');
    const retailerLoginBtn   = document.getElementById('retailer-login-btn');
    const retailerRegisterBtn= document.getElementById('retailer-register-btn');
    const userLoginForm      = document.getElementById('user-login-form');
    const userRegisterForm   = document.getElementById('user-register-form');
    const retailerLoginForm  = document.getElementById('retailer-login-form');
    const retailerRegisterForm = document.getElementById('retailer-register-form');
    const dashboard          = document.getElementById('retailer-dashboard');
    const createShopBtn      = document.getElementById('create-shop-btn');
    const addProductBtn      = document.getElementById('add-product-btn');
    const viewProductsBtn    = document.getElementById('view-products-btn');
    const createShopForm     = document.getElementById('create-shop-form');
    const addProductForm     = document.getElementById('add-product-form');
    const viewProductsList   = document.getElementById('view-products-list');
    const productList        = document.getElementById('product-list');
    const cartCountSpan      = document.querySelector('.cart-count');
    const searchInput        = document.querySelector('.search-bar input');
    const searchBtn          = document.querySelector('.search-bar button');
    const newsletterForm     = document.querySelector('.newsletter form');
    let cartCount = 0;
  
    // ———————— UI State Functions ————————
    function hideAllForms() {
      userLoginForm.style.display = 'none';
      userRegisterForm.style.display = 'none';
      retailerLoginForm.style.display = 'none';
      retailerRegisterForm.style.display = 'none';
      dashboard.style.display = 'none';
      loginSection.style.display = 'none';
      createShopForm.style.display = 'none';
      addProductForm.style.display = 'none';
      viewProductsList.style.display = 'none';
    }
  
    function showLogout() {
      headerAccount.innerHTML = `<a href="#" id="logout-link">Logout</a>`;
      document.getElementById('logout-link').onclick = e => {
        e.preventDefault();
        clearToken();
        alert('Logged out');
        initialize();  // re-run initial state
      };
    }
  
    // ———————— Initialization ————————
    async function initialize() {
      hideAllForms();
      const token = getToken();
      if (token) {
        // User is logged in — show logout
        showLogout();
        // If retailer (we embed type in JWT), show retailer dashboard automatically
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.type === 'retailer') {
            dashboard.style.display = 'block';
          }
        } catch {}
      } else {
        // No token — show Login link
        headerAccount.innerHTML = `<a href="#" id="login-link">Login</a>`;
        document.getElementById('login-link').onclick = e => {
          e.preventDefault();
          loginSection.style.display = 'block';
        };
      }
    }
  
    // ———————— Button Handlers to Toggle Forms ————————
    userLoginBtn.onclick = () => {
      hideAllForms();
      loginSection.style.display    = 'block';
      userLoginForm.style.display   = 'block';
    };
    userRegisterBtn.onclick = () => {
      hideAllForms();
      loginSection.style.display      = 'block';
      userRegisterForm.style.display  = 'block';
    };
    retailerLoginBtn.onclick = () => {
      hideAllForms();
      loginSection.style.display       = 'block';
      retailerLoginForm.style.display  = 'block';
    };
    retailerRegisterBtn.onclick = () => {
      hideAllForms();
      loginSection.style.display          = 'block';
      retailerRegisterForm.style.display   = 'block';
    };
    createShopBtn.onclick = () => {
      hideAllForms();
      dashboard.style.display           = 'block';
      createShopForm.style.display      = 'block';
    };
    addProductBtn.onclick = () => {
      hideAllForms();
      dashboard.style.display          = 'block';
      addProductForm.style.display     = 'block';
    };
    viewProductsBtn.onclick = async () => {
      hideAllForms();
      dashboard.style.display        = 'block';
      viewProductsList.style.display = 'block';
      // Fetch and show retailer's products
      const res = await fetch(API('/api/products'), {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const prods = await res.json();
      productList.innerHTML = prods.map(p =>
        `<li>${p.name} — $${p.price}</li>`
      ).join('');
    };
  
    // ———————— Form Submissions ————————
    userRegisterForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = e.target.querySelector('#reg-email').value;
      const password = e.target.querySelector('#reg-password').value;
      try {
        const res = await fetch(API('/api/users/register'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setToken(data.token);
        alert('User registered!');
        initialize();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  
    userLoginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = e.target.querySelector('#login-email').value;
      const password = e.target.querySelector('#login-password').value;
      try {
        const res = await fetch(API('/api/users/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setToken(data.token);
        alert('User logged in!');
        initialize();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  
    retailerRegisterForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = e.target.querySelector('#retailer-reg-email').value;
      const password = e.target.querySelector('#retailer-reg-password').value;
      try {
        const res = await fetch(API('/api/retailers/register'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setToken(data.token);
        alert('Retailer registered!');
        initialize();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  
    retailerLoginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = e.target.querySelector('#retailer-email').value;
      const password = e.target.querySelector('#retailer-password').value;
      try {
        const res = await fetch(API('/api/retailers/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setToken(data.token);
        alert('Retailer logged in!');
        initialize();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  
    createShopForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = e.target.querySelector('#shop-name').value;
      const desc = e.target.querySelector('#shop-description').value;
      try {
        const res = await fetch(API('/api/shops'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify({ name, description: desc })
        });
        const shop = await res.json();
        if (!res.ok) throw new Error(shop.message);
        alert(`Shop created: ${shop.name}`);
        initialize();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  
    addProductForm.addEventListener('submit', async e => {
      e.preventDefault();
      const body = {
        name:        e.target.querySelector('#product-name').value,
        description: e.target.querySelector('#product-description').value,
        price:       parseFloat(e.target.querySelector('#product-price').value),
        imageUrl:    ''
      };
      try {
        const res = await fetch(API('/api/products'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify(body)
        });
        const prod = await res.json();
        if (!res.ok) throw new Error(prod.message);
        alert(`Product added: ${prod.name}`);
        initialize();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  
    // ———————— Featured & Search ————————
    async function loadFeatured() {
      const res = await fetch(API('/api/products/featured'));
      const prods = await res.json();
      document.querySelector('.product-grid').innerHTML = prods.map(p => `
        <div class="product-card">
          <img src="${p.imageUrl||'product-placeholder.png'}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="price">$${p.price}</p>
          <button class="add-to-cart">Add to Cart</button>
        </div>
      `).join('');
      // cart buttons
      document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.onclick = () => {
          cartCount++;
          cartCountSpan.textContent = `(${cartCount})`;
        };
      });
    }
    await loadFeatured();
  
    searchBtn.addEventListener('click', () => {
      const term = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.product-card').forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(term) ? '' : 'none';
      });
    });
  
    // ———————— Newsletter Stub ————————
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input').value;
      alert(`Thanks for subscribing, ${email}!`);
      newsletterForm.reset();
    });
  
    // ———————— Kick off ————————
    initialize();
  });
  