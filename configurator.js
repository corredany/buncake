// ========================================
// BUNCAKE CONFIGURATOR - Compatible con index-v2.html
// Versión simplificada: Solo tamaño, sabor y decoración
// ========================================

const config = {
    size: 'small',
    flavor: 'vanilla',
    coverage: 'chocolate',  // Valor fijo (no se cambia)
    filling: 'creamcheese',  // Valor fijo (no se cambia)
    decorations: [],
    customMessage: ''
};

const prices = {
    size: 200,
    flavor: 78,
    coverage: 0,  // No se cobra (oculto)
    filling: 0,   // No se cobra (oculto)
    decorations: 0
};

const PRICES = {
    size: { small: 70, medium: 150, large: 300 },
    flavor: { vanilla: 0, chocolate: 0, redvelvet: 20 },
    coverage: { chocolate: 0, cream: 0, buttercream: 0 },
    filling: { creamcheese: 0, fruits: 0, chocolate: 0 },
    decorations: { flowers: 30, sprinkles: 15, berries: 25 }
};

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeConfigurator();
    updateSummary();
    
    // Ocultar items de cobertura y relleno en resumen
    const coverageItem = document.querySelector('#summaryCoverage')?.closest('.summary-item');
    const fillingItem = document.querySelector('#summaryFilling')?.closest('.summary-item');
    if (coverageItem) coverageItem.style.display = 'none';
    if (fillingItem) fillingItem.style.display = 'none';
});

function initializeConfigurator() {
    // Size options
    document.querySelectorAll('input[name="size"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            config.size = e.target.value;
            prices.size = parseInt(e.target.dataset.price) || PRICES.size[e.target.value];
            updateSummary();
        });
    });

    // Flavor options
    document.querySelectorAll('input[name="flavor"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            config.flavor = e.target.value;
            prices.flavor = parseInt(e.target.dataset.price) || PRICES.flavor[e.target.value];
            updateSummary();
        });
    });

    // Decoration checkboxes
    document.querySelectorAll('input[name="decoration"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const value = e.target.value;
            
            if (e.target.checked) {
                if (!config.decorations.includes(value)) {
                    config.decorations.push(value);
                }
                
                // Show message input if message decoration is selected
                if (value === 'message') {
                    const messageSection = document.getElementById('messageSection');
                    if (messageSection) messageSection.style.display = 'block';
                }
            } else {
                config.decorations = config.decorations.filter(d => d !== value);
                
                // Hide message input if message decoration is deselected
                if (value === 'message') {
                    const messageSection = document.getElementById('messageSection');
                    if (messageSection) messageSection.style.display = 'none';
                    config.customMessage = '';
                    const messageInput = document.getElementById('customMessage');
                    if (messageInput) messageInput.value = '';
                }
            }
            
            calculateDecorationPrice();
            updateSummary();
        });
    });

    // Custom message input
    const messageInput = document.getElementById('customMessage');
    if (messageInput) {
        messageInput.addEventListener('input', (e) => {
            config.customMessage = e.target.value;
            updateSummary();
        });
    }

    // Action buttons
    const viewARBtn = document.getElementById('viewInARBtn');
    if (viewARBtn) {
        viewARBtn.addEventListener('click', openInAR);
    }

    const generateQRBtn = document.getElementById('generateQRBtn');
    if (generateQRBtn) {
        generateQRBtn.addEventListener('click', generateQR);
    }

    const shareBtn = document.getElementById('shareConfigBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareConfiguration);
    }

    const copyBtn = document.getElementById('copyUrlBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyConfigUrl);
    }
}

function calculateDecorationPrice() {
    prices.decorations = config.decorations.reduce((total, dec) => {
        return total + (PRICES.decorations[dec] || 0);
    }, 0);
}

// ========================================
// UPDATE SUMMARY
// ========================================

function updateSummary() {
    // Update size
    const sizeNames = { small: '20cm', medium: '30cm', large: '3 Pisos' };
    const sizeEl = document.getElementById('summarySize');
    if (sizeEl) sizeEl.textContent = sizeNames[config.size];

    // Update flavor
    const flavorNames = { vanilla: 'Vainilla', chocolate: 'Chocolate', redvelvet: 'Red Velvet' };
    const flavorEl = document.getElementById('summaryFlavor');
    if (flavorEl) flavorEl.textContent = flavorNames[config.flavor];

    // Update decorations
    const decorationsContainer = document.getElementById('summaryDecorations');
    const decorationsList = document.getElementById('summaryDecorationsList');
    
    if (config.decorations.length > 0) {
        const decorationNames = {
            flowers: 'Flores',
            sprinkles: 'Sprinkles',
            berries: 'Frutos Rojos',
            message: config.customMessage ? `"${config.customMessage}"` : 'Mensaje'
        };
        
        const decorationsText = config.decorations
            .map(d => decorationNames[d])
            .join(', ');
        
        if (decorationsList) decorationsList.textContent = decorationsText;
        if (decorationsContainer) decorationsContainer.style.display = 'flex';
    } else {
        if (decorationsContainer) decorationsContainer.style.display = 'none';
    }

    // Update total price
    const total = prices.size + prices.flavor + prices.decorations;
    const totalEl = document.getElementById('totalPrice');
    if (totalEl) totalEl.textContent = `$${total}`;
}

// ========================================
// DEEP LINK GENERATION
// ========================================

function generateDeepLink() {
    const params = new URLSearchParams({
        size: config.size,
        flavor: config.flavor,
        coverage: config.coverage,  // Valor fijo
        filling: config.filling,    // Valor fijo
        timestamp: Date.now()
    });

    if (config.decorations.length > 0) {
        params.append('decorations', config.decorations.join(','));
    }

    if (config.customMessage) {
        params.append('message', encodeURIComponent(config.customMessage));
    }

    return `buncake://customize?${params.toString()}`;
}

// ========================================
// OPEN IN AR
// ========================================

function openInAR() {
    const deepLink = generateDeepLink();
    console.log('🔗 Deep Link:', deepLink);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // Try to open the app
        window.location.href = deepLink;

        // Fallback to stores after 2 seconds
        setTimeout(() => {
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            const isAndroid = /Android/i.test(navigator.userAgent);

            if (isIOS) {
                // Replace with your App Store URL
                window.location.href = 'https://apps.apple.com/app/buncake';
            } else if (isAndroid) {
                // Replace with your Play Store URL
                window.location.href = 'https://play.google.com/store/apps/details?id=com.buncake';
            }
        }, 2000);

        showNotification('Abriendo app BunCake...', 'success');
    } else {
        // On desktop, show QR code
        generateQR();
        showNotification('Escanea el código QR con tu celular', 'info');
    }
}

// ========================================
// GENERATE QR CODE
// ========================================

function generateQR() {
    const qrContainer = document.getElementById('qrContainer');
    const qrcodeEl = document.getElementById('qrcode');
    
    if (!qrContainer || !qrcodeEl) {
        console.error('QR containers not found');
        return;
    }

    // Clear previous QR
    qrcodeEl.innerHTML = '';

    const deepLink = generateDeepLink();

    try {
        // Generate QR using QRCode.js
        new QRCode(qrcodeEl, {
            text: deepLink,
            width: 200,
            height: 200,
            colorDark: '#8B1538',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        // Show container
        qrContainer.style.display = 'block';
        
        // Smooth scroll
        qrContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        showNotification('¡Código QR generado!', 'success');
    } catch (error) {
        console.error('Error generating QR:', error);
        showNotification('Error al generar código QR', 'error');
    }
}

// ========================================
// SHARE CONFIGURATION
// ========================================

function shareConfiguration() {
    const configURL = generateShareableURL();

    // Try Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'Mi Pastel BunCake Personalizado',
            text: '¡Mira el pastel que diseñé!',
            url: configURL
        })
        .then(() => showNotification('¡Compartido exitosamente!', 'success'))
        .catch(err => {
            console.log('Share cancelled or failed:', err);
            showConfigURL(configURL);
        });
    } else {
        // Fallback: show URL
        showConfigURL(configURL);
    }
}

function generateShareableURL() {
    const baseURL = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
        size: config.size,
        flavor: config.flavor,
        decorations: config.decorations.join(','),
        message: config.customMessage
    });

    return `${baseURL}?${params.toString()}`;
}

function showConfigURL(url) {
    const urlContainer = document.getElementById('configUrlContainer');
    const urlInput = document.getElementById('configUrl');

    if (urlContainer && urlInput) {
        urlInput.value = url;
        urlContainer.style.display = 'block';
        urlContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        showNotification('URL generada. Clic en copiar para compartir', 'info');
    }
}

function copyConfigUrl() {
    const urlInput = document.getElementById('configUrl');
    
    if (urlInput) {
        urlInput.select();
        urlInput.setSelectionRange(0, 99999); // For mobile

        try {
            navigator.clipboard.writeText(urlInput.value)
                .then(() => showNotification('¡URL copiada al portapapeles!', 'success'))
                .catch(() => {
                    // Fallback
                    document.execCommand('copy');
                    showNotification('¡URL copiada!', 'success');
                });
        } catch (err) {
            showNotification('No se pudo copiar', 'error');
        }
    }
}

// ========================================
// LOAD CONFIG FROM URL
// ========================================

function loadConfigFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('size')) {
        config.size = params.get('size');
        const radio = document.querySelector(`input[name="size"][value="${config.size}"]`);
        if (radio) {
            radio.checked = true;
            prices.size = parseInt(radio.dataset.price) || PRICES.size[config.size];
        }
    }

    if (params.has('flavor')) {
        config.flavor = params.get('flavor');
        const radio = document.querySelector(`input[name="flavor"][value="${config.flavor}"]`);
        if (radio) {
            radio.checked = true;
            prices.flavor = parseInt(radio.dataset.price) || PRICES.flavor[config.flavor];
        }
    }

    if (params.has('decorations')) {
        const decorations = params.get('decorations').split(',').filter(d => d);
        decorations.forEach(dec => {
            if (dec === 'message') return;
            
            config.decorations.push(dec);
            const checkbox = document.querySelector(`input[name="decoration"][value="${dec}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        calculateDecorationPrice();
    }

    if (params.has('message')) {
        config.customMessage = decodeURIComponent(params.get('message'));
        const messageInput = document.getElementById('customMessage');
        if (messageInput) messageInput.value = config.customMessage;
        
        // Check message decoration
        const messageCheckbox = document.querySelector('input[name="decoration"][value="message"]');
        if (messageCheckbox) {
            messageCheckbox.checked = true;
            config.decorations.push('message');
        }
        
        // Show message section
        const messageSection = document.getElementById('messageSection');
        if (messageSection) messageSection.style.display = 'block';
        
        calculateDecorationPrice();
    }

    updateSummary();
}

// Load config on page load
document.addEventListener('DOMContentLoaded', loadConfigFromURL);

// ========================================
// NOTIFICATIONS
// ========================================

function showNotification(message, type = 'info') {
    // Try to use existing notification system
    const existingNotif = document.querySelector('.notification');
    
    if (existingNotif) {
        existingNotif.textContent = message;
        existingNotif.className = `notification notification-${type} show`;
        
        setTimeout(() => {
            existingNotif.classList.remove('show');
        }, 3000);
    } else {
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles inline if no CSS
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    console.log(`[Notification] ${type.toUpperCase()}: ${message}`);
}

// ========================================
// MOBILE MENU (if needed)
// ========================================

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

console.log('🎂 BunCake Configurator cargado - Versión simplificada');
console.log('📱 Configuración actual:', config);
