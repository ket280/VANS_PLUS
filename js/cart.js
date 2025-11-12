// Gestion complète du panier d'achats

// Initialiser le panier depuis localStorage
let cart = [];
let wishlist = [];

// Charger les données au démarrage
function loadCartData() {
    const savedCart = localStorage.getItem('vansplus_cart');
    const savedWishlist = localStorage.getItem('vansplus_wishlist');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
    
    updateCartCount();
    updateWishlistCount();
}

// Sauvegarder le panier
function saveCart() {
    localStorage.setItem('vansplus_cart', JSON.stringify(cart));
}

// Sauvegarder la wishlist
function saveWishlist() {
    localStorage.setItem('vansplus_wishlist', JSON.stringify(wishlist));
}

// Ajouter un produit au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('❌ Produit introuvable', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification('✅ Quantité mise à jour !', 'success');
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
        showNotification('✅ Produit ajouté au panier !', 'success');
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

// Retirer un produit du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('🗑️ Produit retiré du panier', 'info');
}

// Mettre à jour la quantité
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

// Vider le panier
function clearCart() {
    if (confirm('Voulez-vous vraiment vider votre panier ?')) {
        cart = [];
        saveCart();
        updateCartCount();
        updateCartDisplay();
        showNotification('🗑️ Panier vidé', 'info');
    }
}

// Calculer le sous-total
function calculateSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Calculer la TVA (20%)
function calculateTax() {
    return calculateSubtotal() * 0.20;
}

// Calculer le total
function calculateTotal() {
    return calculateSubtotal() + calculateTax();
}

// Calculer les frais de livraison
function calculateShipping() {
    const subtotal = calculateSubtotal();
    return subtotal >= 50 ? 0 : 5.99;
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = count;
        if (count > 0) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// Afficher le panier (pour la page cart.html)
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Votre panier est vide</h2>
                <p>Découvrez nos produits et commencez vos achats !</p>
                <a href="shop.html" class="btn btn-primary">Voir la boutique</a>
            </div>
        `;
        
        // Masquer le résumé
        const summary = document.querySelector('.cart-summary-container');
        if (summary) summary.style.display = 'none';
        
        return;
    }
    
    // Afficher les produits du panier
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image"><img src="${item.image}" alt="${item.name}" srcset=""></div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="item-category">${getCategoryName(item.category)}</p>
                <p class="item-price">${item.price.toFixed(2)}€</p>
                ${item.colors ? `<p class="item-detail">Couleur: ${item.colors[0]}</p>` : ''}
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="item-total">
                    <strong>${(item.price * item.quantity).toFixed(2)}€</strong>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Supprimer">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
    
    // Mettre à jour le résumé
    updateCartSummary();
    
    // Afficher le résumé
    const summary = document.querySelector('.cart-summary-container');
    if (summary) summary.style.display = 'block';
}

// Mettre à jour le résumé de commande
function updateCartSummary() {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const shipping = calculateShipping();
    const total = subtotal + tax + shipping;
    
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2) + '€';
    if (taxElement) taxElement.textContent = tax.toFixed(2) + '€';
    if (shippingElement) {
        if (shipping === 0) {
            shippingElement.textContent = 'Gratuite';
            shippingElement.className = 'text-success';
        } else {
            shippingElement.textContent = shipping.toFixed(2) + '€';
            shippingElement.className = '';
        }
    }
    if (totalElement) totalElement.textContent = total.toFixed(2) + '€';
}

// WISHLIST (Liste de souhaits)

// Ajouter à la wishlist
function addToWishlist(productId) {
    if (wishlist.includes(productId)) {
        showNotification('ℹ️ Déjà dans vos favoris', 'info');
        return;
    }
    
    wishlist.push(productId);
    saveWishlist();
    updateWishlistCount();
    showNotification('❤️ Ajouté aux favoris !', 'success');
}

// Retirer de la wishlist
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(id => id !== productId);
    saveWishlist();
    updateWishlistCount();
    showNotification('💔 Retiré des favoris', 'info');
}

// Toggle wishlist
function toggleWishlist(productId) {
    if (wishlist.includes(productId)) {
        removeFromWishlist(productId);
    } else {
        addToWishlist(productId);
    }
}

// Mettre à jour le compteur de la wishlist
function updateWishlistCount() {
    const count = wishlist.length;
    const wishlistCountElements = document.querySelectorAll('#wishlist-count');
    
    wishlistCountElements.forEach(element => {
        element.textContent = count;
        if (count > 0) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// CODE PROMO
const promoCodes = {
    'WELCOME10': { discount: 10, type: 'percent' },
    'SAVE20': { discount: 20, type: 'percent' },
    'FIXED5': { discount: 5, type: 'fixed' }
};

let appliedPromo = null;

// Appliquer un code promo
function applyPromoCode(code) {
    const promoInput = document.getElementById('promo-code');
    const promoCode = code || (promoInput ? promoInput.value.toUpperCase() : '');
    
    if (!promoCode) {
        showNotification('⚠️ Veuillez entrer un code promo', 'warning');
        return;
    }
    
    if (promoCodes[promoCode]) {
        appliedPromo = { code: promoCode, ...promoCodes[promoCode] };
        showNotification(`✅ Code ${promoCode} appliqué !`, 'success');
        updateCartSummary();
    } else {
        showNotification('❌ Code promo invalide', 'error');
    }
}

// Fonction utilitaire pour obtenir le nom de catégorie
function getCategoryName(category) {
    const categories = {
        'shoes': 'Chaussures',
        'clothes': 'Vêtements',
        'accessories': 'Accessoires'
    };
    return categories[category] || category;
}

// Notification système
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles inline
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Couleurs selon le type
    switch(type) {
        case 'success':
            notification.style.background = '#10B981';
            notification.style.color = 'white';
            break;
        case 'error':
            notification.style.background = '#EF4444';
            notification.style.color = 'white';
            break;
        case 'warning':
            notification.style.background = '#F59E0B';
            notification.style.color = 'white';
            break;
        case 'info':
            notification.style.background = '#3B82F6';
            notification.style.color = 'white';
            break;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadCartData();
});