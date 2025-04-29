// Get elements
const userLoginBtn = document.getElementById('user-login-btn');
const userRegisterBtn = document.getElementById('user-register-btn');
const retailerLoginBtn = document.getElementById('retailer-login-btn');
const retailerRegisterBtn = document.getElementById('retailer-register-btn');

const userLoginForm = document.getElementById('userLoginForm');
const userRegisterForm = document.getElementById('userRegisterForm');
const retailerLoginForm = document.getElementById('retailerLoginForm');
const retailerRegisterForm = document.getElementById('retailerRegisterForm');

const loginSection = document.getElementById('login-section');
const dashboard = document.getElementById('dashboard');

// Button click handlers
userLoginBtn.onclick = () => {
  userLoginForm.parentElement.style.display = 'block';
  userRegisterForm.parentElement.style.display =
  retailerLoginForm.parentElement.style.display =
  retailerRegisterForm.parentElement.style.display = 'none';
};

userRegisterBtn.onclick = () => {
  userRegisterForm.parentElement.style.display = 'block';
  userLoginForm.parentElement.style.display =
  retailerLoginForm.parentElement.style.display =
  retailerRegisterForm.parentElement.style.display = 'none';
};

retailerLoginBtn.onclick = () => {
  retailerLoginForm.parentElement.style.display = 'block';
  userLoginForm.parentElement.style.display =
  userRegisterForm.parentElement.style.display =
  retailerRegisterForm.parentElement.style.display = 'none';
};

retailerRegisterBtn.onclick = () => {
  retailerRegisterForm.parentElement.style.display = 'block';
  userLoginForm.parentElement.style.display =
  userRegisterForm.parentElement.style.display =
  retailerLoginForm.parentElement.style.display = 'none';
};

// User Registration
userRegisterForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('user-reg-email').value;
  const password = document.getElementById('user-reg-password').value;

  const res = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    alert('User registered successfully!');
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
  } else {
    alert(data.message || 'User registration failed');
  }
});

// User Login
userLoginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;

  const res = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    alert('User logged in successfully!');
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
  } else {
    alert(data.message || 'User login failed');
  }
});

// Retailer Login
retailerLoginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('retailer-email').value;
  const password = document.getElementById('retailer-password').value;

  const res = await fetch('/api/retailers/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    alert('Retailer logged in successfully!');
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
  } else {
    alert(data.message || 'Retailer login failed');
  }
});

// Retailer Registration
retailerRegisterForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('retailer-reg-email').value;
  const password = document.getElementById('retailer-reg-password').value;

  const res = await fetch('/api/retailers/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    alert('Retailer registered successfully!');
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
  } else {
    alert(data.message || 'Retailer registration failed');
  }
});
