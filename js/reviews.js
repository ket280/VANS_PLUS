// ================================================
// SYSTÈME DE NOTATION ET AVIS
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product')) {
        loadReviews();
    }
});

function loadReviews() {
    // Récupérer l'ID du produit depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) return;
    
    const reviews = getProductReviews(productId);
    displayReviews(reviews);
}

function getProductReviews(productId) {
    const allReviews = JSON.parse(localStorage.getItem('vansplus_reviews') || '{}');
    return allReviews[productId] || [];
}

function displayReviews(reviews) {
    const container = document.getElementById('reviews-list');
    
    if (!container) return;
    
    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="no-reviews">
                <p>💬 Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
            </div>
        `;
        return;
    }
    
    // Trier par date (plus récent en premier)
    const sortedReviews = reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${review.userName.charAt(0).toUpperCase()}</div>
                    <div>
                        <strong>${review.userName}</strong>
                        <p class="review-date">${formatDate(review.date)}</p>
                    </div>
                </div>
                <div class="review-rating">
                    ${'⭐'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <p class="review-text">${review.comment}</p>
            ${review.helpful !== undefined ? `
                <div class="review-helpful">
                    <button onclick="markHelpful('${review.id}', true)">
                        👍 Utile (${review.helpful || 0})
                    </button>
                    <button onclick="markHelpful('${review.id}', false)">
                        👎 Pas utile (${review.notHelpful || 0})
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function showReviewForm() {
    // Vérifier si l'utilisateur est connecté
    if (!isLoggedIn()) {
        showNotification('⚠️ Vous devez être connecté pour laisser un avis', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>✍️ Écrire un avis</h2>
                <span class="close-modal" onclick="this.closest('.modal').remove()">×</span>
            </div>
            
            <form id="review-form" onsubmit="submitReview(event)">
                <div class="form-group">
                    <label>Note *</label>
                    <div class="star-rating-input">
                        <input type="radio" name="rating" value="5" id="star5" required>
                        <label for="star5">⭐</label>
                        <input type="radio" name="rating" value="4" id="star4">
                        <label for="star4">⭐</label>
                        <input type="radio" name="rating" value="3" id="star3">
                        <label for="star3">⭐</label>
                        <input type="radio" name="rating" value="2" id="star2">
                        <label for="star2">⭐</label>
                        <input type="radio" name="rating" value="1" id="star1">
                        <label for="star1">⭐</label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Votre avis *</label>
                    <textarea name="comment" rows="6" required placeholder="Partagez votre expérience avec ce produit..."></textarea>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">
                    Publier l'avis
                </button> </form>
    </div>
`;

document.body.appendChild(modal);
}
function submitReview(e) {
e.preventDefault();
const form = e.target;
const rating = form.rating.value;
const comment = form.comment.value;

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (!productId) {
    showNotification('❌ Erreur: produit introuvable', 'error');
    return;
}

const user = getCurrentUser();

const review = {
    id: 'REV-' + Date.now(),
    productId: productId,
    userId: user.id,
    userName: user.firstname + ' ' + user.lastname.charAt(0) + '.',
    rating: parseInt(rating),
    comment: comment,
    date: new Date().toISOString(),
    helpful: 0,
    notHelpful: 0
};

// Sauvegarder l'avis
const allReviews = JSON.parse(localStorage.getItem('vansplus_reviews') || '{}');

if (!allReviews[productId]) {
    allReviews[productId] = [];
}

allReviews[productId].push(review);
localStorage.setItem('vansplus_reviews', JSON.stringify(allReviews));

showNotification('✅ Merci pour votre avis !', 'success');

// Fermer la modal
document.querySelector('.modal').remove();

// Recharger les avis
loadReviews();
}
function markHelpful(reviewId, isHelpful) {
const allReviews = JSON.parse(localStorage.getItem('vansplus_reviews') || '{}');
// Trouver et mettre à jour l'avis
for (let productId in allReviews) {
    const review = allReviews[productId].find(r => r.id === reviewId);
    if (review) {
        if (isHelpful) {
            review.helpful = (review.helpful || 0) + 1;
        } else {
            review.notHelpful = (review.notHelpful || 0) + 1;
        }
        break;
    }
}

localStorage.setItem('vansplus_reviews', JSON.stringify(allReviews));
loadReviews();
}
function formatDate(dateString) {
const date = new Date(dateString);
const now = new Date();
const diff = now - date;
const days = Math.floor(diff / (1000 * 60 * 60 * 24));
if (days === 0) return 'Aujourd\'hui';
if (days === 1) return 'Hier';
if (days < 7) return `Il y a ${days} jours`;
if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;

return date.toLocaleDateString('fr-FR');
}