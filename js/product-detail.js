// ================================================
// PAGE DÉTAIL PRODUIT
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product')) {
        loadProductDetail();
    }
});

function loadProductDetail() {
    // Récupérer l'ID du produit depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('❌ Produit introuvable', 'error');
        setTimeout(() => {
            window.location.href = 'shop.html';
        }, 1500);
        return;
    }
    
    displayProductDetail(product);
    loadSimilarProducts(product.category, product.id);
}

function displayProductDetail(product) {
    const container = document.getElementById('product-detail');
    const breadcrumb = document.getElementById('product-breadcrumb');
    
    if (breadcrumb) breadcrumb.textContent = product.name;
    
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    container.innerHTML = `
        <div class="product-images">
            <div class="main-image">
                <img src="${product.image}" alt="${product.name}" id="main-product-image">
                ${discount > 0 ? `<div class="product-badge-large">-${discount}%</div>` : ''}
            </div>
        </div>

        <div class="product-info-detail">
            <h1>${product.name}</h1>
            
            <div class="product-rating-detail">
                ${'⭐'.repeat(Math.floor(product.rating))}
                <span class="rating-count">(${product.reviews} avis)</span>
            </div>

            <div class="product-price-detail">
                ${product.oldPrice ? `<span class="old-price-large">${product.oldPrice.toFixed(2)}€</span>` : ''}
                <span class="price-large">${product.price.toFixed(2)}€</span>
            </div>

            <p class="product-description-detail">${product.description}</p>

            <div class="product-stock">
                ${product.stock > 0 ? 
                    `<span class="in-stock">✅ En stock (${product.stock} disponibles)</span>` :
                    `<span class="out-stock">❌ Rupture de stock</span>`
                }
            </div>

            ${product.colors ? `
                <div class="product-options">
                    <label>Couleur:</label>
                    <div class="color-options-detail">
                        ${product.colors.map((color, index) => `
                            <button class="color-option ${index === 0 ? 'active' : ''}" 
                                    onclick="selectOption(this, 'color')">
                                ${color}
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${product.sizes ? `
                <div class="product-options">
                    <label>Taille:</label>
                    <div class="size-options-detail">
                        ${product.sizes.map((size, index) => `
                            <button class="size-option ${index === 0 ? 'active' : ''}" 
                                    onclick="selectOption(this, 'size')">
                                ${size}
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="product-quantity">
                <label>Quantité:</label>
                <div class="quantity-controls-large">
                    <button onclick="changeQuantity(-1)">−</button>
                    <input type="number" id="product-quantity" value="1" min="1" max="${product.stock}">
                    <button onclick="changeQuantity(1)">+</button>
                </div>
            </div>

            <div class="product-actions">
                <button class="btn btn-primary btn-large" onclick="addToCartFromDetail(${product.id})">
                    🛒 Ajouter au panier
                </button>
                <button class="btn btn-secondary" onclick="addToWishlist(${product.id})">
                    ❤️ Liste de souhaits
                </button>
                <button class="btn btn-secondary" onclick="addToCompare(${product.id})">
                    ⚖️ Comparer
                </button>
            </div>

            <div class="product-meta">
                <p><strong>Catégorie:</strong> ${getCategoryName(product.category)}</p>
                <p><strong>SKU:</strong> VP-${product.id}</p>
            </div>

            <div class="product-share">
                <strong>Partager:</strong>
                <button onclick="shareProduct('facebook')" title="Facebook">📘</button>
                <button onclick="shareProduct('twitter')" title="Twitter">🐦</button>
                <button onclick="shareProduct('whatsapp')" title="WhatsApp">💬</button>
            </div>
        </div>
    `;

    // Mettre à jour le titre de la page
    document.title = `${product.name} - VANSPLUS`;
}

function selectOption(button, type) {
    const container = button.parentElement;
    container.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

function changeQuantity(delta) {
    const input = document.getElementById('product-quantity');
    const newValue = parseInt(input.value) + delta;
    const max = parseInt(input.max);
    
    if (newValue >= 1 && newValue <= max) {
        input.value = newValue;
    }
}

function addToCartFromDetail(productId) {
    const quantity = parseInt(document.getElementById('product-quantity').value);
    
    for (let i = 0; i < quantity; i++) {
        addToCart(productId);
    }
}

function loadSimilarProducts(category, excludeId) {
    const similar = products.filter(p => p.category === category && p.id !== excludeId).slice(0, 4);
    const container = document.getElementById('similar-products');
    
    if (container) {
        container.innerHTML = similar.map(product => createProductCard(product)).join('');
    }
}

function shareProduct(platform) {
    const url = window.location.href;
    const title = document.querySelector('h1').textContent;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function getCategoryName(category) {
    const categories = {
        'shoes': 'Chaussures',
        'clothes': 'Vêtements',
        'accessories': 'Accessoires'
    };
    return categories[category] || category;
}