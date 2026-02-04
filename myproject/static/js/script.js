// ===== КОНСТАНТЫ И ПЕРЕМЕННЫЕ =====
const products = [
    { id: 1, name: "Да Хун Пао", type: "oolong", description: "Легендарный утёсный улун с плантаций Уишаня.", region: "Фуцзянь, Китай", year: "2023", price: 2800, weight: "50г" },
    { id: 2, name: "Лунцзин", type: "green", description: "Классический зеленый чай с плантаций Ханчжоу.", region: "Чжэцзян, Китай", year: "2023", price: 1800, weight: "100г" },
    { id: 3, name: "Пуэр Шу", type: "puer", description: "Выдержанный черный пуэр с землистым вкусом.", region: "Юньнань, Китай", year: "2018", price: 3200, weight: "100г" },
    { id: 4, name: "Те Гуань Инь", type: "oolong", description: "Ароматный улун с цветочными нотами.", region: "Аньси, Китай", year: "2023", price: 2200, weight: "50г" },
    { id: 5, name: "Бай Хао Инь Чжэнь", type: "green", description: "Белый чай с нежными серебряными иглами.", region: "Фуцзянь, Китай", year: "2023", price: 3500, weight: "50г" },
    { id: 6, name: "Дянь Хун", type: "black", description: "Красный чай с медовыми и шоколадными нотами.", region: "Юньнань, Китай", year: "2023", price: 1900, weight: "100г" }
];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';

// ===== DOM ЭЛЕМЕНТЫ (на момент загрузки скрипта в конце body) =====
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
    if (productsGrid) initProducts();
    initCart();
    if (filterButtons.length) initFilters();
    initForms();
    initMobileMenu();
    initScrollSpy();
});

function initProducts() {
    renderProducts(products);
}
function renderProducts(productsToShow) {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';
    productsToShow.forEach(product => productsGrid.appendChild(createProductCard(product)));
}
function createProductCard(product) {
    const typeLabels = { 'green': 'Зеленый', 'oolong': 'Улун', 'puer': 'Пуэр', 'black': 'Красный' };
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.type = product.type;
    card.innerHTML = `
        <div class="product-image"><i class="fas fa-leaf"></i></div>
        <div class="product-content">
            <h3 class="product-title">${product.name}</h3>
            <span class="product-type">${typeLabels[product.type]}</span>
            <p class="product-description">${product.description}</p>
            <div class="product-meta"><span class="product-region">${product.region}</span><span class="product-year">${product.year}</span></div>
            <div class="product-footer">
                <span class="product-price">${product.price} ₽ / ${product.weight}</span>
                <button class="btn btn-primary btn-small add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">В корзину</button>
            </div>
        </div>`;
    return card;
}

function initFilters() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterProducts();
        });
    });
}
function filterProducts() {
    const filteredProducts = currentFilter === 'all' ? products : products.filter(p => p.type === currentFilter);
    renderProducts(filteredProducts);
    if (currentFilter !== 'all' && productsGrid) productsGrid.scrollIntoView({ behavior: 'smooth' });
}

// ===== КОРЗИНА =====
function initCart() {
    updateCartUI();
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const b = e.target;
            addToCart({ id: parseInt(b.dataset.id), name: b.dataset.name, price: parseInt(b.dataset.price), quantity: 1 });
            showNotification('Товар добавлен в корзину', 'success');
        }
        if (e.target.classList.contains('remove-btn')) { removeFromCart(parseInt(e.target.dataset.id)); showNotification('Товар удален из корзины', 'error'); }
        if (e.target.classList.contains('quantity-minus')) changeQuantity(parseInt(e.target.dataset.id), -1);
        if (e.target.classList.contains('quantity-plus')) changeQuantity(parseInt(e.target.dataset.id), 1);
    });
    const cartBtn = document.querySelector('.cart-btn');
    const modalClose = document.querySelector('.modal-close');
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (modalClose) modalClose.addEventListener('click', closeCart);
    if (cartModal) cartModal.addEventListener('click', (e) => { if (e.target === cartModal) closeCart(); });
}
function addToCart(product) {
    const ex = cart.find(item => item.id === product.id);
    if (ex) ex.quantity += 1; else cart.push(product);
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
    if (item) { item.quantity += change; if (item.quantity < 1) removeFromCart(productId); else { saveCart(); updateCartUI(); } }
}
function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }
function updateCartUI() {
    if (!cartCount || !cartItems || !cartEmpty || !cartTotal || !totalPrice) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
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
            total += item.price * item.quantity;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-image"><i class="fas fa-leaf"></i></div>
                <div class="cart-item-content"><div class="cart-item-title">${item.name}</div><div class="cart-item-price">${item.price} ₽</div></div>
                <div class="cart-item-controls">
                    <button class="quantity-btn quantity-minus" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn quantity-plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>`;
            cartItems.appendChild(div);
        });
        totalPrice.textContent = `${total} ₽`;
    }
}
function openCart() { if (cartModal) cartModal.classList.add('active'); }
function closeCart() { if (cartModal) cartModal.classList.remove('active'); }

// ===== ФОРМЫ =====
function initForms() {
    if (businessForm) businessForm.addEventListener('submit', handleBusinessForm);
    if (contactForm) contactForm.addEventListener('submit', handleContactForm);
    if (subscribeForm) subscribeForm.addEventListener('submit', handleSubscribeForm);
}
function handleBusinessForm(e) {
    e.preventDefault();
    const inputs = businessForm.querySelectorAll('input[required], textarea[required]');
    let valid = true;
    inputs.forEach(input => { if (!input.value.trim()) { input.style.borderColor = 'var(--error)'; valid = false; } else input.style.borderColor = ''; });
    if (valid) { showNotification('Запрос успешно отправлен! Мы свяжемся с вами в ближайшее время.', 'success'); businessForm.reset(); }
    else showNotification('Пожалуйста, заполните все обязательные поля', 'error');
}
function handleContactForm(e) {
    e.preventDefault();
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    let valid = true;
    inputs.forEach(input => { if (!input.value.trim()) { input.style.borderColor = 'var(--error)'; valid = false; } else input.style.borderColor = ''; });
    if (valid) { showNotification('Сообщение отправлено! Мы ответим вам в течение 24 часов.', 'success'); contactForm.reset(); }
    else showNotification('Пожалуйста, заполните все обязательные поля', 'error');
}
function handleSubscribeForm(e) {
    e.preventDefault();
    const emailInput = subscribeForm.querySelector('input[type="email"]');
    if (emailInput.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        showNotification('Вы успешно подписались на рассылку!', 'success');
        subscribeForm.reset();
    } else { showNotification('Пожалуйста, введите корректный email', 'error'); emailInput.style.borderColor = 'var(--error)'; }
}

function showNotification(message, type = 'success') {
    if (!notification) return;
    notification.textContent = message;
    notification.className = 'notification' + (type === 'error' ? ' error' : '');
    notification.classList.add('active');
    setTimeout(() => notification.classList.remove('active'), 3000);
}

function initMobileMenu() {
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuBtn.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => { nav.classList.remove('active'); menuBtn.innerHTML = '<i class="fas fa-bars"></i>'; }));
    }
}

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => { if (scrollY >= section.offsetTop - 200) current = section.getAttribute('id'); });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) link.classList.add('active');
        });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const el = document.querySelector(targetId);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    });
});
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) header.style.padding = window.scrollY > 100 ? '0.5rem 0' : '1rem 0';
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartModal && cartModal.classList.contains('active')) closeCart();
});
window.onload = () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => { document.body.style.opacity = '1'; }, 100);
};
