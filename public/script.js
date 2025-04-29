document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.querySelector('header .account a');
    const loginSection = document.getElementById('login-section');
    const userLoginBtn = document.getElementById('user-login-btn');
    const retailerLoginBtn = document.getElementById('retailer-login-btn');
    const userLoginForm = document.getElementById('user-login-form');
    const retailerLoginForm = document.getElementById('retailer-login-form');
    const retailerDashboard = document.getElementById('retailer-dashboard');
    const createShopBtn = document.getElementById('create-shop-btn');
    const addProductBtn = document.getElementById('add-product-btn');
    const viewProductsBtn = document.getElementById('view-products-btn');
    const createShopForm = document.getElementById('create-shop-form');
    const addProductForm = document.getElementById('add-product-form');
    const viewProductsList = document.getElementById('view-products-list');
    const cartCountSpan = document.querySelector('.cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    let cartItemCount = parseInt(cartCountSpan.textContent.slice(1, -1)) || 0;

    // Basic cart functionality (remains the same)
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            cartItemCount++;
            cartCountSpan.textContent = `(${cartItemCount})`;
            const productId = this.dataset.productId;
            console.log(`Product ID ${productId} added to cart.`);
            // In a real website, you'd send this to the backend.
        });
    });

    // Show login section when "Login" is clicked
    loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        loginSection.style.display = 'block';
        retailerDashboard.style.display = 'none'; // Hide dashboard if visible
    });

    // Show user login form
    userLoginBtn.addEventListener('click', function() {
        userLoginForm.style.display = 'block';
        retailerLoginForm.style.display = 'none';
    });

    // Show retailer login form
    retailerLoginBtn.addEventListener('click', function() {
        retailerLoginForm.style.display = 'block';
        userLoginForm.style.display = 'none';
    });

    // --- Retailer Dashboard Interactions (Just showing/hiding forms) ---
    createShopBtn.addEventListener('click', function() {
        createShopForm.style.display = 'block';
        addProductForm.style.display = 'none';
        viewProductsList.style.display = 'none';
        retailerDashboard.style.display = 'block'; // Ensure dashboard is visible
        loginSection.style.display = 'none'; // Hide login section
    });

    addProductBtn.addEventListener('click', function() {
        addProductForm.style.display = 'block';
        createShopForm.style.display = 'none';
        viewProductsList.style.display = 'none';
        retailerDashboard.style.display = 'block'; // Ensure dashboard is visible
        loginSection.style.display = 'none'; // Hide login section
    });

    viewProductsBtn.addEventListener('click', function() {
        viewProductsList.style.display = 'block';
        createShopForm.style.display = 'none';
        addProductForm.style.display = 'none';
        retailerDashboard.style.display = 'block'; // Ensure dashboard is visible
        loginSection.style.display = 'none'; // Hide login section
        // In a real website, you would fetch and display the retailer's products here.
    });

    // You would need backend logic to handle form submissions
    // for user login, retailer login, creating shop, and adding products.
    document.getElementById('userLoginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('User login form submitted (backend needed)');
        // In a real application, you would send this data to the server.
    });

    document.getElementById('retailerLoginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Retailer login form submitted (backend needed)');
        // In a real application, you would send this data to the server.
    });

    document.getElementById('createShopForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Create shop form submitted (backend needed)');
        // In a real application, you would send this data to the server.
    });

    document.getElementById('addProductForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('Add product form submitted (backend needed)');
        // In a real application, you would send this data to the server.
    });

    // Initially hide login and dashboard sections
    loginSection.style.display = 'none';
    retailerDashboard.style.display = 'none';
});