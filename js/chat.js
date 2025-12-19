// ================================================
// SYSTÈME DE CHAT EN DIRECT
// ================================================

let chatHistory = JSON.parse(localStorage.getItem('vansplus_chat') || '[]');

document.addEventListener('DOMContentLoaded', function() {
    initChat();
});

function initChat() {
    displayChatHistory();
    
    // Entrer pour envoyer
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        chatInput.focus();
    }
    
    // Message de bienvenue si premier chat
    if (chatHistory.length === 0) {
        addBotMessage('Bonjour ! 👋 Bienvenue sur VANSPLUS. Comment puis-je vous aider aujourd\'hui ?');
        showQuickReplies();
    }
}

function displayChatHistory() {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    container.innerHTML = chatHistory.map(msg => createMessageHTML(msg)).join('');
    scrollToBottom();
}

function createMessageHTML(message) {
    const time = new Date(message.timestamp).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    if (message.type === 'user') {
        return `
            <div class="message user-message">
                <div class="message-content">
                    <p>${message.text}</p>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-avatar">👤</div>
            </div>
        `;
    } else {
        return `
            <div class="message bot-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>${message.text}</p>
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    // Ajouter le message utilisateur
    const userMessage = {
        type: 'user',
        text: text,
        timestamp: new Date().toISOString()
    };
    
    chatHistory.push(userMessage);
    localStorage.setItem('vansplus_chat', JSON.stringify(chatHistory));
    
    // Afficher le message
    addMessageToChat(userMessage);
    
    // Effacer l'input
    input.value = '';
    
    // Simuler une réponse du bot
    setTimeout(() => {
        const botResponse = generateBotResponse(text);
        addBotMessage(botResponse);
    }, 1000);
}

function addMessageToChat(message) {
    const container = document.getElementById('chat-messages');
    container.insertAdjacentHTML('beforeend', createMessageHTML(message));
    scrollToBottom();
}

function addBotMessage(text) {
    const botMessage = {
        type: 'bot',
        text: text,
        timestamp: new Date().toISOString()
    };
    
    chatHistory.push(botMessage);
    localStorage.setItem('vansplus_chat', JSON.stringify(chatHistory));
    addMessageToChat(botMessage);
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Réponses automatiques basées sur les mots-clés
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
        return 'Bonjour ! 😊 Comment puis-je vous aider aujourd\'hui ?';
    }
    
    if (message.includes('livraison')) {
        return '📦 La livraison standard est gratuite pour les commandes de plus de 50€ et prend 3-5 jours ouvrables. Livraison express disponible en 24-48h pour 9.99€.';
    }
    
    if (message.includes('retour') || message.includes('remboursement')) {
        return '🔄 Vous disposez de 30 jours pour retourner un article. Contactez-nous pour obtenir une étiquette de retour gratuite.';
    }
    
    if (message.includes('paiement') || message.includes('carte') || message.includes('paypal')) {
        return '💳 Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal et le paiement à la livraison. Tous les paiements sont 100% sécurisés.';
    }
    
    if (message.includes('promo') || message.includes('code') || message.includes('réduction')) {
        return '🎁 Utilisez le code WELCOME10 pour 10% de réduction sur votre première commande !';
    }
    
    if (message.includes('taille')) {
        return '📏 Consultez notre guide des tailles sur chaque page produit. En cas de doute, nous recommandons de prendre une taille au-dessus.';
    }
    
    if (message.includes('stock') || message.includes('disponible')) {
        return '✅ La disponibilité est indiquée sur chaque fiche produit. Les articles en rupture de stock seront bientôt réapprovisionnés.';
    }
    
    if (message.includes('contact') || message.includes('téléphone') || message.includes('email')) {
        return '📞 Vous pouvez nous joindre par email à contact@vansplus.com ou par téléphone au +509 1234-5678 (Lun-Ven 8h-18h).';
    }
    
    if (message.includes('commande') || message.includes('suivi')) {
        return '📦 Pour suivre votre commande, connectez-vous à votre compte et consultez la section "Mes commandes". Vous recevrez également un email avec le numéro de suivi.';
    }
    
    if (message.includes('merci')) {
        return 'Avec plaisir ! 😊 N\'hésitez pas si vous avez d\'autres questions.';
    }
    
    // Réponse par défaut
    return 'Merci pour votre message. Un conseiller va vous répondre dans quelques instants. En attendant, consultez notre <a href="contact.html">page contact</a> pour plus d\'informations. 📧';
}

function showQuickReplies() {
    const quickReplies = [
        'Informations sur la livraison',
        'Comment retourner un article',
        'Moyens de paiement',
        'Code promo',
        'Suivre ma commande'
    ];
    
    const container = document.getElementById('chat-messages');
    const repliesHTML = `
        <div class="quick-replies">
            <p class="quick-replies-title">Réponses rapides :</p>
            ${quickReplies.map(reply => `
                <button class="quick-reply-btn" onclick="selectQuickReply('${reply}')">
                    ${reply}
                </button>
            `).join('')}
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', repliesHTML);
    scrollToBottom();
}

function selectQuickReply(text) {
    document.getElementById('chat-input').value = text;
    sendMessage();
    
    // Retirer les réponses rapides
    const quickReplies = document.querySelector('.quick-replies');
    if (quickReplies) quickReplies.remove();
}

function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

function clearChat() {
    if (confirm('Voulez-vous vraiment effacer l\'historique du chat ?')) {
        chatHistory = [];
        localStorage.removeItem('vansplus_chat');
        document.getElementById('chat-messages').innerHTML = '';
        addBotMessage('Bonjour ! 👋 Comment puis-je vous aider ?');
        showQuickReplies();
    }
}