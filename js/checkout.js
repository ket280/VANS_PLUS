// Gestion spécifique de la page checkout

document.addEventListener('DOMContentLoaded', function() {
    if (getCurrentPage() === 'checkout') {
        initCheckoutPage();
    }
});

// Initialiser la page checkout
function initCheckoutPage() {
    // Vérifier si le panier n'est pas vide
    if (cart.length === 0) {
        showNotification('⚠️ Votre panier est vide', 'warning');
        setTimeout(() => {
            window.location.href = 'shop.html';
        }, 2000);
        return;
    }
    
    displayOrderSummary();
    initPaymentOptions();
    initCheckoutFormValidation();
    loadShippingMethods();
}

// Options de paiement
function initPaymentOptions() {
    const paymentInputs = document.querySelectorAll('input[name="payment"]');
    const cardForm = document.getElementById('card-form');
    
    paymentInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (cardForm) {
                if (this.value === 'card') {
                    cardForm.style.display = 'block';
                    cardForm.style.animation = 'fadeIn 0.3s ease';
                } else {
                    cardForm.style.display = 'none';
                }
            }
            
            // Afficher un message selon le mode de paiement
            const messages = {
                'card': '💳 Paiement par carte bancaire sécurisé',
                'paypal': '📱 Vous serez redirigé vers PayPal',
                'cash': '💵 Paiement à la livraison (des frais supplémentaires peuvent s\'appliquer)'
            };
            
            if (messages[this.value]) {
                showNotification(messages[this.value], 'info');
            }
        });
    });
}

// Validation du formulaire
function initCheckoutFormValidation() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validation des champs
        if (validateCheckoutForm()) {
            processOrder();
        }
    });
    
    // Validation en temps réel
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Validation de l'email
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (!isValidEmail(this.value)) {
                showFieldError(this, 'Email invalide');
            } else {
                clearFieldError(this);
            }
        });
    }
    
    // Validation du téléphone
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9+\-\s]/g, '');
        });
    }
    
    // Validation de la carte
    const cardNumber = form.querySelector('input[placeholder*="carte"]');
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            this.value = this.value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || this.value;
        });
    }
}

// Valider un champ
function validateField(field) {
    if (field.required && !field.value.trim()) {
        showFieldError(field, 'Ce champ est obligatoire');
        return false;
    }
    clearFieldError(field);
    return true;
}

// Afficher une erreur de champ
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#EF4444';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    
    field.parentElement.appendChild(errorDiv);
}

// Effacer l'erreur d'un champ
function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Valider le formulaire complet
function validateCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return false;
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validation email
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !isValidEmail(emailInput.value)) {
        showFieldError(emailInput, 'Email invalide');
        isValid = false;
    }
    
    // Si paiement par carte, valider les infos carte
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    if (paymentMethod === 'card') {
        const cardFields = form.querySelectorAll('#card-form input');
        cardFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'Champ requis');
                isValid = false;
            }
        });
    }
    
    if (!isValid) {
        showNotification('⚠️ Veuillez remplir tous les champs obligatoires', 'warning');
    }
    
    return isValid;
}

// Valider un email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Méthodes de livraison
function loadShippingMethods() {
    const shippingMethods = [
        { id: 'standard', name: 'Livraison Standard', delay: '3-5 jours', price: 0 },
        { id: 'express', name: 'Livraison Express', delay: '24-48h', price: 9.99 },
        { id: 'pickup', name: 'Retrait en magasin', delay: 'Aujourd\'hui', price: 0 }
    ];
    
    // Vous pouvez afficher ces options si vous avez un conteneur pour ça
    console.log('Méthodes de livraison disponibles:', shippingMethods);
}

// Traiter la commande
function processOrder() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    // Récupérer les données du formulaire
    const formData = new FormData(form);
    const orderData = {
        customer: {
            firstName: formData.get('firstName') || form.querySelector('input[type="text"]').value,
            lastName: formData.get('lastName') || form.querySelectorAll('input[type="text"]')[1]?.value,
            email: form.querySelector('input[type="email"]').value,
            phone: form.querySelector('input[type="tel"]').value,
            address: form.querySelector('input[placeholder*="Adresse"]').value,
            city: form.querySelector('input[placeholder*="Ville"]').value,
            country: form.querySelector('select').value
        },
        items: cart,
        payment: {
            method: document.querySelector('input[name="payment"]:checked').value
        },
        totals: {
            subtotal: calculateSubtotal(),
            tax: calculateTax(),
            shipping: calculateShipping(),
            total: calculateTotal()
        },
        date: new Date().toISOString()
    };
    
    // Afficher la progression
    showProcessingOverlay();
    
    // Simuler le traitement de la commande
    setTimeout(() => {
        // Sauvegarder la commande
        saveOrder(orderData);
        
        // Vider le panier
        clearCart();
        
        // Afficher la confirmation
        showOrderConfirmation(orderData);
    }, 2000);
}

// Afficher l'overlay de traitement
function showProcessingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'processing-overlay';
    overlay.innerHTML = `
        <div class="processing-content">
            <div class="spinner"></div>
            <h3>🔄 Traitement de votre commande...</h3>
            <p>Veuillez patienter</p>
        </div>
    `;
    
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const content = overlay.querySelector('.processing-content');
    content.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
    `;
    
    document.body.appendChild(overlay);
}

// Sauvegarder la commande
function saveOrder(orderData) {
    // Récupérer les commandes existantes
    let orders = JSON.parse(localStorage.getItem('vansplus_orders') || '[]');
    
    // Ajouter la nouvelle commande avec un ID unique
    orderData.id = 'ORD-' + Date.now();
    orderData.status = 'pending';
    orders.push(orderData);
    
    // Sauvegarder
    localStorage.setItem('vansplus_orders', JSON.stringify(orders));
    
    console.log('Commande sauvegardée:', orderData);
}

// Afficher la confirmation de commande
function showOrderConfirmation(orderData) {
    const overlay = document.getElementById('processing-overlay');
    if (overlay) overlay.remove();
    
    const confirmation = document.createElement('div');
    confirmation.id = 'order-confirmation';
    confirmation.innerHTML = `
        <div class="confirmation-content">
            <div class="success-icon">✅</div>
            <h2>Commande Confirmée !</h2>
            <p class="order-number">Numéro de commande: <strong>${orderData.id}</strong></p>
            <p>Merci pour votre achat chez VANSPLUS !</p>
            <p>Un email de confirmation a été envoyé à <strong>${orderData.customer.email}</strong></p>
            <div class="order-summary-box">
                <h4>Résumé de votre commande</h4>
                <p>Articles: ${orderData.items.length}</p>
                <p>Total: <strong>${orderData.totals.total.toFixed(2)}€</strong></p>
            </div>
            <button class="btn btn-primary btn-large" onclick="window.location.href='index.html'">
                🏠 Retour à l'accueil
            </button>
            <button class="btn btn-secondary" onclick="window.location.href='shop.html'">
                🛍️ Continuer mes achats
            </button>
        </div>
    `;
    
    confirmation.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.5s ease;
    `;
    
    const content = confirmation.querySelector('.confirmation-content');
    content.style.cssText = `
        background: white;
        padding: 50px;
        border-radius: 20px;
        text-align: center;
        max-width: 500px;
        animation: slideUp 0.5s ease;
    `;
    
    document.body.appendChild(confirmation);
    
    // Envoyer un événement analytics (si vous utilisez Google Analytics)
    console.log('Commande terminée:', orderData);
}

// Récupérer la page actuelle
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    return page.replace('.html', '') || 'index';
}
// Afficher le résumé de commande (checkout)
function displayOrderSummary() {
    const container = document.getElementById('order-items');
    if (!container) return;
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="order-item">
            <span class="item-image"><img src="${item.image}" alt="${item.name}" srcset=""></span>
            <div class="item-details">
                <strong>${item.name}</strong>
                <span class="item-qty">x${item.quantity}</span>
            </div>
            <span class="item-price">${(item.price * item.quantity).toFixed(2)}€</span>
        </div>
    `).join('');
    
    // Mettre à jour les totaux
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const total = subtotal + tax;
    
    const elements = {
        'checkout-subtotal': subtotal,
        'checkout-tax': tax,
        'checkout-total': total
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = elements[id].toFixed(2) + '€';
    });
}