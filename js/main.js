// Fichier principal - Gestion de l'interface et des interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation
    initializePage();
    initMobileMenu();
    initSearch();
    initFilters();
    initNewsletter();
    
    // Charger le contenu approprié selon la page
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            loadHomePage();
            break;
        case 'shop':
            loadShopPage();
            break;
        case 'cart':
            updateCartDisplay();
            loadRecommendedProducts();
            break;
        case 'checkout':
            loadCheckout();
            break;
    }
});

// Obtenir la page actuelle
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    
    if (page === '' || page === 'index.html') return 'index';
    if (page === 'shop.html') return 'shop';
    if (page === 'cart.html') return 'cart';
    if (page === 'checkout.html') return 'checkout';
    
    return page.replace('.html', '');
}

// Initialisation générale
function initializePage() {
    loadCartData();
    updateCartCount();
    updateWishlistCount();
}

// Menu mobile
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.textContent === '☰' ? '✕' : '☰';
            this.textContent = icon;
        });
        
        // Fermer le menu lors du clic sur un lien
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });
    }
}

// Recherche
function initSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const query = this.value.toLowerCase();
            filterAndDisplayProducts();
        }, 300));
    }
}

// Charger la page d'accueil
function loadHomePage() {
    displayFeaturedProducts();
    animateOnScroll();
}

// Afficher les produits en vedette
function displayFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    const featured = getFeaturedProducts();
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Charger la page boutique
function loadShopPage() {
    displayAllProducts();
    initSortSelect();
    initPriceRange();
    initSizeButtons();
    initColorButtons();
}

// Afficher tous les produits
function displayAllProducts() {
    const container = document.getElementById('all-products');
    if (!container) return;
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
    updateProductCount(products.length);
}

// Créer une carte produit
// Créer une carte produit avec IMAGE
function createProductCard(product) {
    const isInWishlist = wishlist.includes(product.id);
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    return `
        <div class="product-card" data-category="${product.category}" data-price="${product.price}">
            ${discount > 0 ? `<div class="product-badge">-${discount}%</div>` : ''}
            
            <!-- IMAGE DU PRODUIT -->
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onload="this.style.display='block'" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:80px;\\'>${product.image}</div>'">
            </div>
            
            <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(${product.id})" title="Ajouter aux favoris">
                ${isInWishlist ? '❤️' : '🤍'}
            </button>
            
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    ${'⭐'.repeat(Math.floor(product.rating))}
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-price-row">
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toFixed(2)}€</span>` : ''}
                    <span class="product-price">${product.price.toFixed(2)}€</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    🛒 Ajouter au panier
                </button>
            </div>
        </div>
    `;
}

// Filtrer et afficher les produits
function filterAndDisplayProducts() {
    const container = document.getElementById('all-products');
    if (!container) return;
    
    // Récupérer les filtres
    const searchQuery = document.getElementById('search-input')?.value || '';
    const maxPrice = document.getElementById('price-range')?.value || 500;
    const selectedCategories = getSelectedCategories();
    
    // Filtrer les produits
    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = product.price <= parseFloat(maxPrice);
        const matchesCategory = selectedCategories.length === 0 || 
                               selectedCategories.includes('all') || 
                               selectedCategories.includes(product.category);
        
        return matchesSearch && matchesPrice && matchesCategory;
    });
    
    // Appliquer le tri
    const sortValue = document.getElementById('sort-select')?.value || 'default';
    filtered = sortProducts(filtered, sortValue);
    
    // Afficher les résultats
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
            </div>
        `;
    } else {
        container.innerHTML = filtered.map(product => createProductCard(product)).join('');
    }
    
    updateProductCount(filtered.length);
}

// Récupérer les catégories sélectionnées
function getSelectedCategories() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// Mettre à jour le compteur de produits
function updateProductCount(count) {
    const countElement = document.getElementById('product-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Initialiser les filtres
function initFilters() {
    // Checkboxes catégories
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Si "Tous" est coché, décocher les autres
            if (this.value === 'all' && this.checked) {
                categoryCheckboxes.forEach(cb => {
                    if (cb.value !== 'all') cb.checked = false;
                });
            } else if (this.value !== 'all' && this.checked) {
                // Si une catégorie spécifique est cochée, décocher "Tous"
                const allCheckbox = document.querySelector('input[value="all"]');
                if (allCheckbox) allCheckbox.checked = false;
            }
            
            filterAndDisplayProducts();
        });
    });
    
    // Bouton reset
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

// Réinitialiser les filtres
function resetFilters() {
    // Reset checkboxes
    const allCheckbox = document.querySelector('input[value="all"]');
    if (allCheckbox) allCheckbox.checked = true;
    
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        if (cb.value !== 'all') cb.checked = false;
    });
    
    // Reset prix
    const priceRange = document.getElementById('price-range');
    if (priceRange) {
        priceRange.value = 500;
        document.getElementById('price-value').textContent = '500€';
    }
    
    // Reset recherche
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    // Reset tailles et couleurs
    document.querySelectorAll('.size-btn.active, .color-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Réafficher tous les produits
    filterAndDisplayProducts();
    
    showNotification('🔄 Filtres réinitialisés', 'info');
}

// Initialiser le slider de prix
function initPriceRange() {
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.textContent = this.value + '€';
            filterAndDisplayProducts();
        });
    }
}

// Initialiser le tri
function initSortSelect() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', filterAndDisplayProducts);
    }
}

// Initialiser les boutons de taille
function initSizeButtons() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// Initialiser les boutons de couleur
function initColorButtons() {
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// Newsletter
function initNewsletter() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            showNotification(`✅ Merci ! Vous êtes inscrit avec ${email}`, 'success');
            this.reset();
        });
    }
}

// Charger les produits recommandés (page panier)
function loadRecommendedProducts() {
    const container = document.getElementById('recommended-products');
    if (!container) return;
    
    const recommended = products.filter(p => p.featured).slice(0, 4);
    container.innerHTML = recommended.map(product => createProductCard(product)).join('');
}

// Animation au scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.product-card, .service-card, .category-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease';
        observer.observe(element);
    });
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Charger la page checkout
function loadCheckout() {
    displayOrderSummary();
    initCheckoutForm();
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
            <span class="item-image">${item.image}</span>
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

// Initialiser le formulaire de checkout
function initCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            processCheckout();
        });
    }
    
    // Gérer l'affichage du formulaire de carte
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            const cardForm = document.getElementById('card-form');
            if (cardForm) {
                cardForm.style.display = this.value === 'card' ? 'block' : 'none';
            }
        });
    });
}

// Traiter la commande
function processCheckout() {
    // Simuler le traitement
    showNotification('⏳ Traitement de votre commande...', 'info');
    
    setTimeout(() => {
        showNotification('✅ Commande confirmée ! Merci pour votre achat.', 'success');
        clearCart();
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 2000);
}