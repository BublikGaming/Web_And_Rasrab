// ===== КОНСТАНТЫ И ПЕРЕМЕННЫЕ =====
const products = [
    {
        id: 1,
        name: "Да Хун Пао",
        type: "oolong",
        description: "Легендарный утёсный улун с плантаций Уишаня.",
        region: "Фуцзянь, Китай",
        year: "2023",
        price: 2800,
        weight: "50г"
    },
    {
        id: 2,
        name: "Лунцзин",
        type: "green",
        description: "Классический зеленый чай с плантаций Ханчжоу.",
        region: "Чжэцзян, Китай",
        year: "2023",
        price: 1800,
        weight: "100г"
    },
    {
        id: 3,
        name: "Пуэр Шу",
        type: "puer",
        description: "Выдержанный черный пуэр с землистым вкусом.",
        region: "Юньнань, Китай",
        year: "2018",
        price: 3200,
        weight: "100г"
    },
    {
        id: 4,
        name: "Те Гуань Инь",
        type: "oolong",
        description: "Ароматный улун с цветочными нотами.",
        region: "Аньси, Китай",
        year: "2023",
        price: 2200,
        weight: "50г"
    },
    {
        id: 5,
        name: "Бай Хао Инь Чжэнь",
        type: "green",
        description: "Белый чай с нежными серебряными иглами.",
        region: "Фуцзянь, Китай",
        year: "2023",
        price: 3500,
        weight: "50г"
    },
    {
        id: 6,
        name: "Дянь Хун",
        type: "black",
        description: "Красный чай с медовыми и шоколадными нотами.",
        region: "Юньнань, Китай",
        year: "2023",
        price: 1900,
        weight: "100г"
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';

// ===== DOM ЭЛЕМЕНТЫ =====
const productsGrid = document.getElementById('productsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const totalPrice = document.querySelector('.total-price');
const businessForm = document.getElementById('businessForm');
const contactForm = document.getElementById('contactForm');
const subscribeForm = document.getElementById('subscribeForm');
const notification = document.getElementById('notification');
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    initCart();
    initFilters();
    initForms();
    initMobileMenu();
    initScrollSpy();
});

// ===== ПРОДУКТЫ И КАТАЛОГ =====
function initProducts() {
    renderProducts(products);
}

function renderProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.type = product.type;
    
    const typeLabels = {
        'green': 'Зеленый',
        'oolong': 'Улун',
        'puer': 'Пуэр',
        'black': 'Красный'
    };
    
    card.innerHTML = `
        <div class="product-image">
            <i class="fas fa-leaf"></i>
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.name}</h3>
            <span class="product-type">${typeLabels[product.type]}</span>
            <p class="product-description">${product.description}</p>
            <div class="product-meta">
                <span class="product-region">${product.region}</span>
                <span class="product-year">${product.year}</span>
            </div>
            <div class="product-footer">
                <span class="product-price">${product.price} ₽ / ${product.weight}</span>
                <button class="btn btn-primary btn-small add-to-cart" 
                        data-id="${product.id}"
                        data-name="${product.name}"
                        data-price="${product.price}">
                    В корзину
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ===== ФИЛЬТРЫ =====
function initFilters() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            btn.classList.add('active');
            
            currentFilter = btn.dataset.filter;
            filterProducts();
        });
    });
}

function filterProducts() {
    let filteredProducts;
    
    if (currentFilter === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.type === currentFilter);
    }
    
    renderProducts(filteredProducts);
    
    // Прокрутка к каталогу после фильтрации
    if (currentFilter !== 'all') {
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== КОРЗИНА =====
function initCart() {
    updateCartUI();
    
    // Добавление товаров в корзину
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const product = {
                id: parseInt(button.dataset.id),
                name: button.dataset.name,
                price: parseInt(button.dataset.price),
                quantity: 1
            };
            
            addToCart(product);
            showNotification('Товар добавлен в корзину', 'success');
        }
        
        // Удаление товара из корзины
        if (e.target.classList.contains('remove-btn')) {
            const itemId = parseInt(e.target.dataset.id);
            removeFromCart(itemId);
            showNotification('Товар удален из корзины', 'error');
        }
        
        // Изменение количества
        if (e.target.classList.contains('quantity-minus')) {
            const itemId = parseInt(e.target.dataset.id);
            changeQuantity(itemId, -1);
        }
        
        if (e.target.classList.contains('quantity-plus')) {
            const itemId = parseInt(e.target.dataset.id);
            changeQuantity(itemId, 1);
        }
    });
    
    // Открытие/закрытие корзины
    document.querySelector('.cart-btn').addEventListener('click', openCart);
    document.querySelector('.modal-close').addEventListener('click', closeCart);
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCart();
        }
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    saveCart();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Обновляем счетчик в шапке
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Показываем/скрываем счетчик
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Обновляем содержимое корзины
    if (cart.length === 0) {
        cartItems.classList.remove('active');
        cartEmpty.classList.remove('hidden');
        cartTotal.classList.remove('active');
    } else {
        cartItems.classList.add('active');
        cartEmpty.classList.add('hidden');
        cartTotal.classList.add('active');
        
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <i class="fas fa-leaf"></i>
                </div>
                <div class="cart-item-content">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn quantity-minus" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn quantity-plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        totalPrice.textContent = `${total} ₽`;
    }
}

function openCart() {
    cartModal.classList.add('active');
}

function closeCart() {
    cartModal.classList.remove('active');
}

// ===== ФОРМЫ =====
function initForms() {
    if (businessForm) {
        businessForm.addEventListener('submit', handleBusinessForm);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', handleSubscribeForm);
    }
}

function handleBusinessForm(e) {
    e.preventDefault();
    
    // Простая валидация
    const inputs = businessForm.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--error)';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (isValid) {
        // Здесь обычно отправка на сервер
        showNotification('Запрос успешно отправлен! Мы свяжемся с вами в ближайшее время.', 'success');
        businessForm.reset();
    } else {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
    }
}

function handleContactForm(e) {
    e.preventDefault();
    
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--error)';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (isValid) {
        showNotification('Сообщение отправлено! Мы ответим вам в течение 24 часов.', 'success');
        contactForm.reset();
    } else {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
    }
}

function handleSubscribeForm(e) {
    e.preventDefault();
    
    const emailInput = subscribeForm.querySelector('input[type="email"]');
    
    if (emailInput.value.trim() && isValidEmail(emailInput.value)) {
        showNotification('Вы успешно подписались на рассылку!', 'success');
        subscribeForm.reset();
    } else {
        showNotification('Пожалуйста, введите корректный email', 'error');
        emailInput.style.borderColor = 'var(--error)';
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== УВЕДОМЛЕНИЯ =====
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add('active');
    
    if (type === 'error') {
        notification.classList.add('error');
    }
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuBtn.innerHTML = nav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// ===== SCROLL SPY =====
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====

// Плавная прокрутка для всех внутренних ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Фиксация шапки при скролле
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.padding = '0.5rem 0';
    } else {
        header.style.padding = '1rem 0';
    }
});

// Закрытие корзины при нажатии Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartModal.classList.contains('active')) {
        closeCart();
    }
});

// Инициализация при загрузке страницы
window.onload = () => {
    // Показываем плавное появление элементов
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
};