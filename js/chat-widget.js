// ================================================
// WIDGET CHAT FLOTTANT
// ================================================

function toggleChatWidget() {
    const box = document.getElementById('chat-widget-box');
    const badge = document.getElementById('chat-badge');
    
    if (box.style.display === 'none') {
        box.style.display = 'block';
        badge.style.display = 'none';
    } else {
        box.style.display = 'none';
    }
}

function sendWidgetMessage() {
    const input = document.getElementById('widget-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    const container = document.getElementById('widget-messages');
    
    // Message utilisateur
    const userMsg = document.createElement('div');
    userMsg.className = 'user-message-widget';
    userMsg.textContent = text;
    container.appendChild(userMsg);
    
    input.value = '';
    container.scrollTop = container.scrollHeight;
    
    // Réponse automatique
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'bot-message-widget';
        botMsg.innerHTML = '✅ Merci pour votre message ! <a href="chat.html">Cliquez ici</a> pour discuter avec un conseiller.';
        container.appendChild(botMsg);
        container.scrollTop = container.scrollHeight;
    }, 1000);
}

// Entrer pour envoyer
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('widget-input');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendWidgetMessage();
            }
        });
    }
});