// ========================================
// DATOS DE PRODUCTOS
// ========================================

const products = [
    {
        id: 1,
        name: '3 Leches Vainilla',
        price: 230,
        icon: '🍰',
        description: 'Esponjoso pastel tradicional bañado en tres tipos de leche, con suave sabor a vainilla'
    },
    {
        id: 2,
        name: 'Red Velvet',
        price: 230,
        icon: '❤️',
        description: 'Clásico irresistible de textura suave y esponjosa, con delicado sabor a cacao y cobertura de betún de queso crema'
    },
    {
        id: 3,
        name: 'Cheesecake',
        price: 60,
        icon: '🍓',
        description: 'Cremoso pay de queso individual con base de galleta y topping a elegir'
    },
    {
        id: 4,
        name: 'Pay de Queso',
        price: 50,
        icon: '🥮',
        description: 'Tradicional pay de queso individual, suave y delicioso'
    },
    {
        id: 5,
        name: 'Rol de Canela',
        price: 30,
        icon: '🧁',
        description: 'Suave pan enrollado con canela y glaseado dulce'
    },
    {
        id: 6,
        name: 'Dona Glaseada',
        price: 25,
        icon: '🍩',
        description: 'Esponjosas donas con variedad de glaseados y decoraciones',
        priceLabel: 'Desde $25'
    }
];

// ========================================
// NAVEGACIÓN MÓVIL
// ========================================

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Cerrar menú al hacer click en un link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
}

// ========================================
// RENDERIZAR PRODUCTOS
// ========================================

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">${product.priceLabel || '$' + product.price}</p>
                <p class="product-description">${product.description}</p>
                <span class="ar-badge">👁️ Ver en AR</span>
            </div>
        </div>
    `).join('');

    // Agregar efecto hover mejorado
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        // Click en producto (para futuras funcionalidades)
        card.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            showProductDetails(productId);
        });
    });
}

function showProductDetails(productId) {
    const product = products.find(p => p.id == productId);
    if (product) {
        // Aquí podrías mostrar un modal con detalles del producto
        console.log('Producto seleccionado:', product);
        alert(`${product.name}\n\nPrecio: $${product.price}\n\n${product.description}\n\n¡Usa nuestra app para ver este pastel en realidad aumentada!`);
    }
}

// ========================================
// CALCULADORA DE PRECIOS
// ========================================

function initPriceCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    const orderBtn = document.getElementById('orderBtn');
    const resultItems = document.getElementById('resultItems');
    const totalPriceElement = document.getElementById('totalPrice');

    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', calculatePrice);
    
    if (orderBtn) {
        orderBtn.addEventListener('click', handleOrder);
    }

    // Auto-calcular cuando cambian los selects
    const selects = ['cakeSize', 'cakeFlavor', 'cakeCoverage', 'cakeFilling'];
    selects.forEach(selectId => {
        const element = document.getElementById(selectId);
        if (element) {
            element.addEventListener('change', calculatePrice);
        }
    });
}

function calculatePrice() {
    const sizeSelect = document.getElementById('cakeSize');
    const flavorSelect = document.getElementById('cakeFlavor');
    const coverageSelect = document.getElementById('cakeCoverage');
    const fillingSelect = document.getElementById('cakeFilling');
    const resultItems = document.getElementById('resultItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const orderBtn = document.getElementById('orderBtn');

    // Obtener valores
    const sizeValue = parseInt(sizeSelect.value) || 0;
    const flavorValue = parseInt(flavorSelect.value) || 0;
    const coverageValue = parseInt(coverageSelect.value) || 0;
    const fillingValue = parseInt(fillingSelect.value) || 0;

    // Obtener textos
    const sizeText = sizeSelect.options[sizeSelect.selectedIndex].text;
    const flavorText = flavorSelect.options[flavorSelect.selectedIndex].text;
    const coverageText = coverageSelect.options[coverageSelect.selectedIndex].text;
    const fillingText = fillingSelect.options[fillingSelect.selectedIndex].text;

    const total = sizeValue + flavorValue + coverageValue + fillingValue;

    // Construir resultado
    let resultHTML = '';
    
    if (total === 0) {
        resultHTML = '<p class="empty-message">Selecciona las opciones para ver el precio</p>';
        if (orderBtn) orderBtn.disabled = true;
    } else {
        const items = [];
        
        if (sizeValue > 0) items.push({ text: sizeText, value: sizeValue });
        if (flavorValue > 0) items.push({ text: flavorText, value: flavorValue });
        if (coverageValue > 0) items.push({ text: coverageText, value: coverageValue });
        if (fillingValue > 0) items.push({ text: fillingText, value: fillingValue });

        resultHTML = items.map(item => `
            <div class="result-item">
                <span>${item.text.split(' - ')[0]}</span>
                <span>$${item.value}</span>
            </div>
        `).join('');

        if (orderBtn) orderBtn.disabled = false;
    }

    if (resultItems) {
        resultItems.innerHTML = resultHTML;
    }

    if (totalPriceElement) {
        totalPriceElement.querySelector('.price').textContent = `$${total}`;
    }

    // Animación del total
    if (total > 0 && totalPriceElement) {
        totalPriceElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalPriceElement.style.transform = 'scale(1)';
        }, 200);
    }
}

function handleOrder() {
    const sizeSelect = document.getElementById('cakeSize');
    const flavorSelect = document.getElementById('cakeFlavor');
    const coverageSelect = document.getElementById('cakeCoverage');
    const fillingSelect = document.getElementById('cakeFilling');
    
    const sizeText = sizeSelect.options[sizeSelect.selectedIndex].text;
    const flavorText = flavorSelect.options[flavorSelect.selectedIndex].text;
    const coverageText = coverageSelect.options[coverageSelect.selectedIndex].text;
    const fillingText = fillingSelect.options[fillingSelect.selectedIndex].text;
    
    const total = parseInt(sizeSelect.value) + parseInt(flavorSelect.value) + 
                  parseInt(coverageSelect.value) + parseInt(fillingSelect.value);

    // Crear mensaje para WhatsApp
    const message = `🧁 *Nuevo Pedido BunCake*\n\n` +
                   `*Detalles del pastel:*\n` +
                   `• ${sizeText}\n` +
                   `• ${flavorText}\n` +
                   `• ${coverageText}\n` +
                   `• ${fillingText}\n\n` +
                   `*Total:* $${total} MXN\n\n` +
                   `¿Podrías confirmar disponibilidad?`;

    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Número de WhatsApp (reemplazar con el número real)
    const whatsappNumber = '5218121234567'; // Cambiar por el número real
    
    // Abrir WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
}

// ========================================
// FORMULARIO DE CONTACTO
// ========================================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        // Validación básica
        if (!name || !email || !phone || !message) {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Crear mensaje para WhatsApp
        const whatsappMessage = `📧 *Nuevo Mensaje de Contacto*\n\n` +
                               `*Nombre:* ${name}\n` +
                               `*Email:* ${email}\n` +
                               `*Teléfono:* ${phone}\n\n` +
                               `*Mensaje:*\n${message}`;

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappNumber = '5218121234567'; // Cambiar por el número real
        
        // Abrir WhatsApp
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

        // Limpiar formulario
        contactForm.reset();
        
        // Mostrar mensaje de éxito
        alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
    });
}

// ========================================
// SMOOTH SCROLL
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorar enlaces vacíos
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .design-feature');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========================================
// BOTÓN DESCARGAR APP
// ========================================

function initDownloadAppButton() {
    const downloadBtn = document.getElementById('downloadAppBtn');
    
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', function() {
        // Aquí puedes redirigir a las tiendas de apps
        alert('¡Próximamente disponible en App Store y Google Play!\n\nPor ahora, contáctanos por WhatsApp para hacer tu pedido.');
        
        // Opcional: redirigir a WhatsApp
        const whatsappNumber = '5218121234567';
        const message = encodeURIComponent('Hola, me interesa la app de BunCake para diseñar pasteles en AR 🧁');
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    });
}

// ========================================
// CAMBIO DE TEMA (OPCIONAL)
// ========================================

function initThemeToggle() {
    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Esta funcionalidad se puede expandir más adelante
}

// ========================================
// INICIALIZACIÓN GLOBAL
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧁 BunCake Bakery - Website cargado correctamente');
    
    // Inicializar todas las funcionalidades
    initMobileMenu();
    renderProducts();
    initPriceCalculator();
    initContactForm();
    initSmoothScroll();
    initScrollAnimations();
    initDownloadAppButton();
    
    console.log('✅ Todas las funcionalidades inicializadas');
});

// ========================================
// MANEJO DE ERRORES GLOBAL
// ========================================

window.addEventListener('error', function(e) {
    console.error('Error detectado:', e.error);
});

// ========================================
// UTILIDADES
// ========================================

// Función para formatear precios
function formatPrice(price) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(price);
}

// Función para validar email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Función para validar teléfono mexicano
function isValidPhone(phone) {
    const re = /^(\+?52)?[\s\-]?(\d{10})$/;
    return re.test(phone);
}

// Exportar funciones si es necesario (para módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        formatPrice,
        isValidEmail,
        isValidPhone
    };
}
