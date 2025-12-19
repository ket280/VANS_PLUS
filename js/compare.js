// ================================================
// COMPARATEUR DE PRODUITS
// ================================================

let compareList = JSON.parse(localStorage.getItem('vansplus_compare') || '[]');

document.addEventListener('DOMContentLoaded', function() {
    updateCompareCount();
    
    if (window.location.pathname.includes('compare')) {
        displayCompare();
    }
});

// Ajouter au comparateur
function addToCompare(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('❌ Produit introuvable', 'error');
        return;
    }
    
    // Limite de 4 produits
    if (compareList.length >= 4) {
        showNotification('⚠️ Vous pouvez comparer maximum 4 produits', 'warning');
        return;
    }
    
    // Vérifier si déjà dans le comparateur
    if (compareList.some(p => p.id === productId)) {
        showNotification('ℹ️ Ce produit est déjà dans le comparateur', 'info');
        return;
    }
    
    compareList.push(product);
    localStorage.setItem('vansplus_compare', JSON.stringify(compareList));
    updateCompareCount();
    showNotification('✅ Produit ajouté au comparateur', 'success');
}

// Retirer du comparateur
function removeFromCompare(productId) {
    compareList = compareList.filter(p => p.id !== productId);
    localStorage.setItem('vansplus_compare', JSON.stringify(compareList));
    updateCompareCount();
    displayCompare();
    showNotification('🗑️ Produit retiré du comparateur', 'info');
}

// Vider le comparateur
function clearCompare() {
    if (confirm('Voulez-vous vraiment vider le comparateur ?')) {
        compareList = [];
        localStorage.setItem('vansplus_compare', JSON.stringify(compareList));
        updateCompareCount();
        displayCompare();
        showNotification('🗑️ Comparateur vidé', 'info');
    }
}

// Mettre à jour le compteur
function updateCompareCount() {
    const count = compareList.length;
    const compareCountEl = document.getElementById('compare-count');
    
    if (compareCountEl) {
        compareCountEl.textContent = count;
        compareCountEl.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Afficher le comparateur
function displayCompare() {
    const container = document.getElementById('compare-container');
    
    if (!container) return;
    
    if (compareList.length === 0) {
        container.innerHTML = `
            <div class="empty-compare">
                <div class="empty-icon">⚖️</div>
                <h2>Aucun produit à comparer</h2>
                <p>Ajoutez des produits pour les comparer côte à côte</p>
                <a href="shop.html" class="btn btn-primary">Voir la boutique</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="compare-header">
            <h2>Comparaison de ${compareList.length} produit(s)</h2>
            <button class="btn btn-secondary" onclick="clearCompare()">
                🗑️ Tout effacer
            </button>
        </div>
        
        <div class="compare-table">
            <table>
                <thead>
                    <tr>
                        <th>Caractéristiques</th>
                        ${compareList.map(product => `
                            <th>
                                <div class="compare-product-header">
                                    <div class="product-img">${product.image.includes('http') ? 
                                        `<img src="${product.image}" alt="${product.name}">` : 
                                        `<div style="font-size: 60px;">${product.image}</div>`
                                    }</div>
                                    <h3>${product.name}</h3>
                                    <button class="remove-compare-btn" onclick="removeFromCompare(${product.id})" title="Retirer">
                                        ✕
                                    </button>
                                </div>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Prix</strong></td>
                        ${compareList.map(product => `
                            <td>
                                <span class="compare-price">${product.price.toFixed(2)}€</span>
                                ${product.oldPrice ? `<br><span class="old-price">${product.oldPrice.toFixed(2)}€</span>` : ''}
                            </td>
                        `).join('')}
                    </tr>
                    
                    <tr>
                        <td><strong>Note</strong></td>
                        ${compareList.map(product => `
                            <td>
                                ${'⭐'.repeat(Math.floor(product.rating))}
                                <br><small>(${product.reviews} avis)</small>
                            </td>
                        `).join('')}
                    </tr>
                    
                    <tr>
                        <td><strong>Stock</strong></td>
                        ${compareList.map(product => `
                            <td>
                                ${product.stock > 0 ? 
                                    `✅ ${product.stock} disponible(s)` : 
                                    '❌ Rupture de stock'
                                }
                            </td>
                        `).join('')}
                    </tr>
                    
                    <tr>
                        <td><strong>Catégorie</strong></td>
                        ${compareList.map(product => `
                            <td>${getCategoryName(product.category)}</td>
                        `).join('')}
                    </tr>
                    
                    <tr>
                        <td><strong>Couleurs</strong></td>
                        ${compareList.map(product => `
                            <td>${product.colors ? product.colors.join(', ') : '-'}</td>
                        `).join('')}
                    </tr>
                    
                    <tr>
                        <td><strong>Tailles</strong></td>
                        ${compareList.map(product => `
                            <td>${product.sizes ? product.sizes.join(', ') : '-'}</td>
                        `).join('')}
                    </tr>
                    
                    <tr>
                        <td><strong>Description</strong></td>
                        ${compareList.map(product => `
                            <td>${product.description}</td>
                        `).join('')}
                    </tr>
                    
                    <tr class="compare-actions">
                        <td><strong>Actions</strong></td>
                        ${compareList.map(product => `
                            <td>
                                <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">
                                    🛒 Ajouter
                                </button>
                            </td>
                        `).join('')}
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function getCategoryName(category) {
    const categories = {
        'shoes': 'Chaussures',
        'clothes': 'Vêtements',
        'accessories': 'Accessoires'
    };
    return categories[category] || category;
}