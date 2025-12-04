import { Shop, Product, ShopWithProducts, User, CartItem } from '../types';

const STORAGE_KEY = 'localShopData';

interface LocalData {
  shops: Shop[];
  products: Product[];
  users: User[];
}

// Initialize with rich sample data - 20 retailers with lots of products
const initializeData = (): LocalData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Create 20 retailers (users)
  const retailers: User[] = [];
  for (let i = 1; i <= 20; i++) {
    retailers.push({
      id: `retailer-${i}`,
      name: `Retailer ${i}`,
      email: `retailer${i}@shop.com`,
      type: 'retailer'
    });
  }

  // Create sample shops for each retailer
  const shops: Shop[] = [
    { id: '1', name: 'Fresh Mart Groceries', location: 'Main Street, Downtown (0.5 km)', phone: '555-0101', retailerId: 'retailer-1', category: 'Grocery', coordinates: { lat: 28.6139, lng: 77.2090 } },
    { id: '2', name: 'QuickStop Supermarket', location: 'Park Avenue, Central (1.2 km)', phone: '555-0102', retailerId: 'retailer-2', category: 'Grocery', coordinates: { lat: 28.6189, lng: 77.2140 } },
    { id: '3', name: 'Daily Needs Store', location: 'Sector 15, North (2.0 km)', phone: '555-0103', retailerId: 'retailer-3', category: 'Grocery', coordinates: { lat: 28.6239, lng: 77.2190 } },
    { id: '4', name: 'Tech Hub Electronics', location: 'Mall Road, City Center (0.8 km)', phone: '555-0201', retailerId: 'retailer-4', category: 'Electronics', coordinates: { lat: 28.6150, lng: 77.2100 } },
    { id: '5', name: 'Digital World', location: 'Tech Park, Phase 2 (1.5 km)', phone: '555-0202', retailerId: 'retailer-5', category: 'Electronics', coordinates: { lat: 28.6200, lng: 77.2150 } },
    { id: '6', name: 'Gadget Galaxy', location: 'Shopping Complex, East (2.5 km)', phone: '555-0203', retailerId: 'retailer-6', category: 'Electronics', coordinates: { lat: 28.6250, lng: 77.2200 } },
    { id: '7', name: 'Stationery Corner', location: 'School Road, West (0.6 km)', phone: '555-0301', retailerId: 'retailer-7', category: 'Books', coordinates: { lat: 28.6160, lng: 77.2110 } },
    { id: '8', name: 'Book Bazaar', location: 'University Area, South (1.8 km)', phone: '555-0302', retailerId: 'retailer-8', category: 'Books', coordinates: { lat: 28.6220, lng: 77.2170 } },
    { id: '9', name: 'Paper Plus', location: 'Market Street, Downtown (0.9 km)', phone: '555-0303', retailerId: 'retailer-9', category: 'Books', coordinates: { lat: 28.6170, lng: 77.2120 } },
    { id: '10', name: 'HealthCare Pharmacy', location: 'Hospital Road, Central (0.7 km)', phone: '555-0401', retailerId: 'retailer-10', category: 'Pharmacy', coordinates: { lat: 28.6165, lng: 77.2115 } },
    { id: '11', name: 'MediPlus Store', location: 'Clinic Lane, North (1.3 km)', phone: '555-0402', retailerId: 'retailer-11', category: 'Pharmacy', coordinates: { lat: 28.6195, lng: 77.2145 } },
    { id: '12', name: 'Fresh Bakery', location: 'Food Street, Downtown (0.4 km)', phone: '555-0501', retailerId: 'retailer-12', category: 'Bakery', coordinates: { lat: 28.6145, lng: 77.2095 } },
    { id: '13', name: 'Sweet Treats Bakery', location: 'Dessert Plaza, West (1.1 km)', phone: '555-0502', retailerId: 'retailer-13', category: 'Bakery', coordinates: { lat: 28.6185, lng: 77.2135 } },
    { id: '14', name: 'Fashion Hub', location: 'Style Street, Central (1.0 km)', phone: '555-0601', retailerId: 'retailer-14', category: 'Clothing', coordinates: { lat: 28.6180, lng: 77.2130 } },
    { id: '15', name: 'Trendy Wear', location: 'Fashion District, East (1.6 km)', phone: '555-0602', retailerId: 'retailer-15', category: 'Clothing', coordinates: { lat: 28.6210, lng: 77.2160 } },
    { id: '16', name: 'Hardware Haven', location: 'Industrial Area, South (2.2 km)', phone: '555-0701', retailerId: 'retailer-16', category: 'Hardware', coordinates: { lat: 28.6230, lng: 77.2180 } },
    { id: '17', name: 'Tool Time', location: 'Builder Street, North (1.9 km)', phone: '555-0702', retailerId: 'retailer-17', category: 'Hardware', coordinates: { lat: 28.6225, lng: 77.2175 } },
    { id: '18', name: 'Snack Shack', location: 'Food Court, Mall Road (0.8 km)', phone: '555-0801', retailerId: 'retailer-18', category: 'Grocery', coordinates: { lat: 28.6170, lng: 77.2120 } },
    { id: '19', name: 'Organic Market', location: 'Green Plaza, West (1.4 km)', phone: '555-0901', retailerId: 'retailer-19', category: 'Grocery', coordinates: { lat: 28.6200, lng: 77.2150 } },
    { id: '20', name: 'Pet Paradise', location: 'Animal Street, East (2.1 km)', phone: '555-1001', retailerId: 'retailer-20', category: 'Other', coordinates: { lat: 28.6228, lng: 77.2178 } },
  ];

  // Create extensive product catalog
  const products: Product[] = [
    // Fresh Mart Groceries (Shop 1) - Common items
    { id: 'p1', name: 'Eggs', shopId: '1', price: 60, description: 'Farm fresh eggs (12 pcs)', inStock: true, quantity: 100 },
    { id: 'p2', name: 'Milk', shopId: '1', price: 50, description: 'Fresh cow milk (1L)', inStock: true, quantity: 80 },
    { id: 'p3', name: 'Bread', shopId: '1', price: 40, description: 'Whole wheat bread', inStock: true, quantity: 50 },
    { id: 'p4', name: 'Butter', shopId: '1', price: 55, description: 'Amul butter (100g)', inStock: true, quantity: 40 },
    { id: 'p5', name: 'Kurkure', shopId: '1', price: 20, description: 'Masala munch snack', inStock: true, quantity: 120 },
    { id: 'p6', name: 'Rice', shopId: '1', price: 80, description: 'Basmati rice (1kg)', inStock: true, quantity: 60 },
    { id: 'p7', name: 'Sugar', shopId: '1', price: 45, description: 'White sugar (1kg)', inStock: true, quantity: 70 },
    { id: 'p8', name: 'Tea', shopId: '1', price: 150, description: 'Premium tea leaves (500g)', inStock: true, quantity: 35 },

    // QuickStop Supermarket (Shop 2)
    { id: 'p9', name: 'Eggs', shopId: '2', price: 58, description: 'Fresh eggs (12 pcs)', inStock: true, quantity: 90 },
    { id: 'p10', name: 'Kurkure', shopId: '2', price: 20, description: 'Cheese flavor', inStock: true, quantity: 100 },
    { id: 'p11', name: 'Maggi', shopId: '2', price: 14, description: 'Instant noodles', inStock: true, quantity: 150 },
    { id: 'p12', name: 'Biscuits', shopId: '2', price: 25, description: 'Parle-G biscuits', inStock: true, quantity: 200 },
    { id: 'p13', name: 'Chips', shopId: '2', price: 20, description: 'Lays chips', inStock: true, quantity: 130 },
    { id: 'p14', name: 'Chocolates', shopId: '2', price: 30, description: 'Dairy Milk', inStock: true, quantity: 80 },

    // Daily Needs Store (Shop 3)
    { id: 'p15', name: 'Eggs', shopId: '3', price: 62, description: 'Organic eggs (12 pcs)', inStock: true, quantity: 50 },
    { id: 'p16', name: 'Pen', shopId: '3', price: 10, description: 'Blue ballpoint pen', inStock: true, quantity: 200 },
    { id: 'p17', name: 'Notebook', shopId: '3', price: 40, description: 'A4 notebook', inStock: true, quantity: 80 },
    { id: 'p18', name: 'Soap', shopId: '3', price: 35, description: 'Bath soap', inStock: true, quantity: 100 },
    { id: 'p19', name: 'Shampoo', shopId: '3', price: 150, description: 'Hair shampoo (200ml)', inStock: true, quantity: 60 },

    // Tech Hub Electronics (Shop 4)
    { id: 'p20', name: 'Pen Drive', shopId: '4', price: 400, description: '16GB USB drive', inStock: true, quantity: 50 },
    { id: 'p21', name: 'Mouse', shopId: '4', price: 300, description: 'Wireless mouse', inStock: true, quantity: 40 },
    { id: 'p22', name: 'Keyboard', shopId: '4', price: 500, description: 'Wired keyboard', inStock: true, quantity: 30 },
    { id: 'p23', name: 'Headphones', shopId: '4', price: 800, description: 'Bluetooth headphones', inStock: true, quantity: 25 },
    { id: 'p24', name: 'Mobile Charger', shopId: '4', price: 350, description: 'Fast charger', inStock: true, quantity: 60 },

    // Digital World (Shop 5)
    { id: 'p25', name: 'Laptop', shopId: '5', price: 45000, description: 'Dell Laptop', inStock: true, quantity: 10 },
    { id: 'p26', name: 'Mobile Phone', shopId: '5', price: 15000, description: 'Smartphone', inStock: true, quantity: 20 },
    { id: 'p27', name: 'Tablet', shopId: '5', price: 25000, description: 'Android tablet', inStock: true, quantity: 15 },
    { id: 'p28', name: 'Speaker', shopId: '5', price: 2000, description: 'Bluetooth speaker', inStock: true, quantity: 30 },

    // Gadget Galaxy (Shop 6)
    { id: 'p29', name: 'Smart Watch', shopId: '6', price: 3000, description: 'Fitness tracker', inStock: true, quantity: 25 },
    { id: 'p30', name: 'Power Bank', shopId: '6', price: 1000, description: '10000mAh', inStock: true, quantity: 40 },
    { id: 'p31', name: 'Camera', shopId: '6', price: 35000, description: 'DSLR camera', inStock: true, quantity: 8 },

    // Stationery Corner (Shop 7)
    { id: 'p32', name: 'Pen', shopId: '7', price: 8, description: 'Ball pen (pack of 5)', inStock: true, quantity: 300 },
    { id: 'p33', name: 'Pencil', shopId: '7', price: 5, description: 'HB pencil', inStock: true, quantity: 400 },
    { id: 'p34', name: 'Eraser', shopId: '7', price: 5, description: 'White eraser', inStock: true, quantity: 250 },
    { id: 'p35', name: 'Ruler', shopId: '7', price: 15, description: '30cm ruler', inStock: true, quantity: 150 },
    { id: 'p36', name: 'Notebook', shopId: '7', price: 45, description: 'A4 notebook (200 pages)', inStock: true, quantity: 100 },
    { id: 'p37', name: 'Marker', shopId: '7', price: 25, description: 'Permanent marker', inStock: true, quantity: 120 },

    // Book Bazaar (Shop 8)
    { id: 'p38', name: 'Pen', shopId: '8', price: 12, description: 'Gel pen', inStock: true, quantity: 200 },
    { id: 'p39', name: 'Novel', shopId: '8', price: 350, description: 'Bestseller novel', inStock: true, quantity: 50 },
    { id: 'p40', name: 'Dictionary', shopId: '8', price: 500, description: 'English dictionary', inStock: true, quantity: 30 },
    { id: 'p41', name: 'Comics', shopId: '8', price: 150, description: 'Comic book', inStock: true, quantity: 80 },

    // Paper Plus (Shop 9)
    { id: 'p42', name: 'Pen', shopId: '9', price: 10, description: 'Blue/black pen', inStock: true, quantity: 250 },
    { id: 'p43', name: 'A4 Paper', shopId: '9', price: 250, description: 'Copy paper (500 sheets)', inStock: true, quantity: 100 },
    { id: 'p44', name: 'File Folder', shopId: '9', price: 30, description: 'Plastic folder', inStock: true, quantity: 150 },
    { id: 'p45', name: 'Glue Stick', shopId: '9', price: 20, description: 'Paper glue', inStock: true, quantity: 180 },

    // HealthCare Pharmacy (Shop 10)
    { id: 'p46', name: 'Paracetamol', shopId: '10', price: 20, description: 'Pain reliever (10 tablets)', inStock: true, quantity: 200 },
    { id: 'p47', name: 'Cough Syrup', shopId: '10', price: 100, description: 'Cough medicine', inStock: true, quantity: 80 },
    { id: 'p48', name: 'Band-Aid', shopId: '10', price: 50, description: 'Adhesive bandages', inStock: true, quantity: 150 },
    { id: 'p49', name: 'Vitamins', shopId: '10', price: 300, description: 'Multivitamin tablets', inStock: true, quantity: 60 },

    // MediPlus Store (Shop 11)
    { id: 'p50', name: 'Sanitizer', shopId: '11', price: 80, description: 'Hand sanitizer (500ml)', inStock: true, quantity: 100 },
    { id: 'p51', name: 'Face Mask', shopId: '11', price: 10, description: 'Surgical mask', inStock: true, quantity: 500 },
    { id: 'p52', name: 'Thermometer', shopId: '11', price: 250, description: 'Digital thermometer', inStock: true, quantity: 40 },

    // Fresh Bakery (Shop 12)
    { id: 'p53', name: 'Bread', shopId: '12', price: 35, description: 'Fresh bread loaf', inStock: true, quantity: 80 },
    { id: 'p54', name: 'Cake', shopId: '12', price: 400, description: 'Chocolate cake (500g)', inStock: true, quantity: 20 },
    { id: 'p55', name: 'Cookies', shopId: '12', price: 120, description: 'Butter cookies', inStock: true, quantity: 50 },
    { id: 'p56', name: 'Donuts', shopId: '12', price: 80, description: 'Glazed donuts (4 pcs)', inStock: true, quantity: 40 },

    // Sweet Treats Bakery (Shop 13)
    { id: 'p57', name: 'Pastry', shopId: '13', price: 50, description: 'Fresh pastry', inStock: true, quantity: 60 },
    { id: 'p58', name: 'Muffin', shopId: '13', price: 40, description: 'Chocolate muffin', inStock: true, quantity: 70 },
    { id: 'p59', name: 'Bread', shopId: '13', price: 38, description: 'Multigrain bread', inStock: true, quantity: 45 },

    // Fashion Hub (Shop 14)
    { id: 'p60', name: 'T-Shirt', shopId: '14', price: 400, description: 'Cotton t-shirt', inStock: true, quantity: 100 },
    { id: 'p61', name: 'Jeans', shopId: '14', price: 1200, description: 'Denim jeans', inStock: true, quantity: 60 },
    { id: 'p62', name: 'Shirt', shopId: '14', price: 800, description: 'Formal shirt', inStock: true, quantity: 80 },

    // Trendy Wear (Shop 15)
    { id: 'p63', name: 'Dress', shopId: '15', price: 1500, description: 'Party dress', inStock: true, quantity: 40 },
    { id: 'p64', name: 'Jacket', shopId: '15', price: 2000, description: 'Winter jacket', inStock: true, quantity: 30 },

    // Hardware Haven (Shop 16)
    { id: 'p65', name: 'Hammer', shopId: '16', price: 200, description: 'Steel hammer', inStock: true, quantity: 50 },
    { id: 'p66', name: 'Screwdriver Set', shopId: '16', price: 300, description: 'Tool set', inStock: true, quantity: 40 },
    { id: 'p67', name: 'Paint', shopId: '16', price: 500, description: 'Wall paint (1L)', inStock: true, quantity: 60 },

    // Tool Time (Shop 17)
    { id: 'p68', name: 'Drill Machine', shopId: '17', price: 2500, description: 'Electric drill', inStock: true, quantity: 20 },
    { id: 'p69', name: 'Measuring Tape', shopId: '17', price: 100, description: '5m tape', inStock: true, quantity: 80 },

    // Snack Shack (Shop 18)
    { id: 'p70', name: 'Kurkure', shopId: '18', price: 20, description: 'Spicy kurkure', inStock: true, quantity: 200 },
    { id: 'p71', name: 'Samosa', shopId: '18', price: 15, description: 'Hot samosa (2 pcs)', inStock: true, quantity: 100 },
    { id: 'p72', name: 'Cold Drink', shopId: '18', price: 40, description: 'Soft drink (500ml)', inStock: true, quantity: 150 },

    // Organic Market (Shop 19)
    { id: 'p73', name: 'Eggs', shopId: '19', price: 70, description: 'Organic eggs (12 pcs)', inStock: true, quantity: 40 },
    { id: 'p74', name: 'Vegetables', shopId: '19', price: 60, description: 'Fresh vegetables (1kg)', inStock: true, quantity: 100 },
    { id: 'p75', name: 'Fruits', shopId: '19', price: 80, description: 'Seasonal fruits (1kg)', inStock: true, quantity: 80 },

    // Pet Paradise (Shop 20)
    { id: 'p76', name: 'Dog Food', shopId: '20', price: 500, description: 'Pet food (1kg)', inStock: true, quantity: 50 },
    { id: 'p77', name: 'Cat Litter', shopId: '20', price: 300, description: 'Cat litter (5kg)', inStock: true, quantity: 40 },
  ];

  const sampleData: LocalData = {
    shops,
    products,
    users: retailers
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
  return sampleData;
};

const getData = (): LocalData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initializeData();
};

const saveData = (data: LocalData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// User Authentication
export const loginUser = async (email: string, password: string, type: 'customer' | 'retailer'): Promise<User> => {
  const data = getData();
  const user = data.users.find(u => u.email === email && u.type === type);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

export const registerUser = async (name: string, email: string, password: string, type: 'customer' | 'retailer'): Promise<User> => {
  const data = getData();
  
  if (data.users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }
  
  const newUser: User = {
    id: `${type}-${Date.now()}`,
    name,
    email,
    type
  };
  
  data.users.push(newUser);
  saveData(data);
  return newUser;
};

// Shop APIs
export const getAllShops = (): Shop[] => {
  const data = getData();
  return data.shops;
};

export const getShopsByRetailer = (retailerId: string): Shop[] => {
  const data = getData();
  return data.shops.filter(s => s.retailerId === retailerId);
};

export const addShop = (shop: Omit<Shop, 'id'>): Shop => {
  const data = getData();
  const newShop: Shop = {
    ...shop,
    id: Date.now().toString()
  };
  data.shops.push(newShop);
  saveData(data);
  return newShop;
};

// Product APIs
export const getAllProducts = (): Product[] => {
  const data = getData();
  return data.products;
};

export const searchProducts = (query: string): ShopWithProducts[] => {
  const data = getData();
  const searchTerm = query.toLowerCase();
  
  const matchingProducts = data.products.filter(p => 
    p.name.toLowerCase().includes(searchTerm) ||
    p.description?.toLowerCase().includes(searchTerm)
  );
  
  const shopMap = new Map<string, ShopWithProducts>();
  
  matchingProducts.forEach(product => {
    const shop = data.shops.find(s => s.id === product.shopId);
    if (shop) {
      if (!shopMap.has(shop.id)) {
        shopMap.set(shop.id, {
          shop,
          products: []
        });
      }
      shopMap.get(shop.id)!.products.push(product);
    }
  });
  
  return Array.from(shopMap.values());
};

// Search shops by cart items - shows which shops have cart items
export const searchShopsByCartItems = (cartItems: CartItem[]): ShopWithProducts[] => {
  const data = getData();
  const cartProductNames = cartItems.map(item => item.productName.toLowerCase());
  
  // Group all shops and their matching products
  const shopMap = new Map<string, ShopWithProducts>();
  
  data.shops.forEach(shop => {
    const shopProducts = data.products.filter(p => 
      p.shopId === shop.id && 
      cartProductNames.includes(p.name.toLowerCase()) &&
      p.inStock
    );
    
    if (shopProducts.length > 0) {
      shopMap.set(shop.id, {
        shop,
        products: shopProducts,
        availableItems: shopProducts.length,
        hasAllItems: shopProducts.length === cartItems.length
      });
    }
  });
  
  // Sort: shops with all items first, then by number of available items, then by distance
  return Array.from(shopMap.values()).sort((a, b) => {
    if (a.hasAllItems && !b.hasAllItems) return -1;
    if (!a.hasAllItems && b.hasAllItems) return 1;
    return (b.availableItems || 0) - (a.availableItems || 0);
  });
};

export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const data = getData();
  const newProduct: Product = {
    ...product,
    id: `p${Date.now()}`,
  };
  data.products.push(newProduct);
  saveData(data);
  return newProduct;
};

export const getProductsByShop = (shopId: string): Product[] => {
  const data = getData();
  return data.products.filter(p => p.shopId === shopId);
};
