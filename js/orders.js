// ================================================
// GESTION DES COMMANDES
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est connecté
    if (!requireAuth()) return;
    
    initOrders();
});

function initOrders() {
    displayOrders();
    
    // Filtres
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterOrders(this.dataset.filter);
        });
    });
    
    // Recherche
    const searchInput = document.getElementById('order-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchOrders(this.value);
        });
    }
}

function displayOrders(filter = 'all') {
    const ordersContainer = document.getElementById('orders-list');
    const orders = JSON.parse(localStorage.getItem('vansplus_commandes') || '[]');
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <div class="empty-icon">📦</div>
                <h3>Aucune commande</h3>
                <p>Vous n'avez pas encore passé de commande</p>
                <a href="shop.html" class="btn btn-primary">Commencer mes achats</a>
            </div>
        `;
        return;
    }
    
    // Trier par date (plus récent en premier)
    const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    ordersContainer.innerHTML = sortedOrders.map(order => `
        <div class="order-card" data-status="${order.status || 'pending'}">
            <div class="order-header">
                <div class="order-info">
                    <h3>Commande ${order.id}</h3>
                    <p class="order-date">📅 ${order.date}</p>
                </div>
                <div class="order-status">
                    <span class="status-badge ${order.status || 'pending'}">
                        ${getStatusText(order.status || 'pending')}
                    </span>
                </div>
            </div>
            
            <div class="order-items">
                ${order.produits.slice(0, 3).map(item => `
                    <div class="order-item-mini">
                        <span class="item-img">${item.image.includes('http') ? '📦' : item.image}</span>
                        <span class="item-name">${item.name}</span>
                        <span class="item-qty">x${item.quantity}</span>
                    </div>
                `).join('')}
                ${order.produits.length > 3 ? `
                    <p class="more-items">+${order.produits.length - 3} autre(s) article(s)</p>
                ` : ''}
            </div>
            
            <div class="order-footer">
                <div class="order-total">
                    <strong>Total: ${order.totaux.total.toFixed(2)}€</strong>
                </div>
                <div class="order-actions">
                    <button class="btn btn-secondary" onclick="viewOrderDetails('${order.id}')">
                        Voir détails
                    </button>
                    ${(order.status === 'delivered') ? `
                        <button class="btn btn-primary" onclick="reorder('${order.id}')">
                            Commander à nouveau
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statuses = {
        'pending': '⏳ En cours',
        'processing': '📦 En préparation',
        'shipped': '🚚 Expédiée',
        'delivered': '✅ Livrée',
        'cancelled': '❌ Annulée'
    };
    return statuses[status] || '⏳ En cours';
}

function filterOrders(filter) {
    const orders = document.querySelectorAll('.order-card');
    orders.forEach(order => {
        if (filter === 'all' || order.dataset.status === filter) {
            order.style.display = 'block';
        } else {
            order.style.display = 'none';
        }
    });
}

function searchOrders(query) {
    const orders = document.querySelectorAll('.order-card');
    orders.forEach(order => {
        const orderText = order.textContent.toLowerCase();
        if (orderText.includes(query.toLowerCase())) {
            order.style.display = 'block';
        } else {
            order.style.display = 'none';
        }
    });
}

function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('vansplus_commandes') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    // Créer une modal avec les détails
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px;">
            <div class="modal-header">
                <h2>📦 Détails de la commande</h2>
                <span class="close-modal" onclick="this.closest('.modal').remove()">×</span>
            </div>
            
            <div class="order-details">
                <div class="detail-row">
                    <strong>Numéro:</strong>
                    <span>${order.id}</span>
                </div>
                <div class="detail-row">
                    <strong>Date:</strong>
                    <span>${order.date}</span>
                </div>
                <div class="detail-row">
                    <strong>Statut:</strong>
                    <span class="status-badge ${order.status || 'pending'}">
                        ${getStatusText(order.status || 'pending')}
                    </span>
                </div>
                
                <h3 style="margin-top: 30px;">📦 Produits</h3>
                ${order.produits.map(item => `
                    <div class="order-item-detail">
                        <span class="item-img">${item.image.includes('http') ? '📦' : item.image}</span>
                        <div class="item-info">
                            <strong>${item.name}</strong>
                            <p>${item.price.toFixed(2)}€ x ${item.quantity}</p>
                        </div>
                        <strong>${(item.price * item.quantity).toFixed(2)}€</strong>
                    </div>
                `).join('')}
                
                <div class="order-summary" style="margin-top: 30px;">
                    <div class="summary-row">
                        <span>Sous-total:</span>
                        <span>${order.totaux.subtotal.toFixed(2)}€</span>
                    </div>
                    <div class="summary-row">
                        <span>TVA:</span>
                        <span>${order.totaux.tax.toFixed(2)}€</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>${order.totaux.total.toFixed(2)}€</span>
                    </div>  ${order.client ? `
                <h3 style="margin-top: 30px;">📍 Adresse de livraison</h3>
                <p>
                    ${order.client.prenom || ''}<br>
                    ${order.client.adresse || ''}<br>
                    ${order.client.ville || ''}, ${order.client.pays || ''}
                </p>
            ` : ''}
        </div>
    </div>
`;

document.body.appendChild(modal);
}
function reorder(orderId) {
const orders = JSON.parse(localStorage.getItem('vansplus_commandes') || '[]');
const order = orders.find(o => o.id === orderId);
if (!order) return;

// Ajouter les produits au panier
order.produits.forEach(item => {
    addToCart(item.id);
});

showNotification('✅ Produits ajoutés au panier !', 'success');

setTimeout(() => {
    window.location.href = 'cart.html';
}, 1500);
}