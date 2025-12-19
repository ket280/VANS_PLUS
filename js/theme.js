// ================================================
// GESTION DU MODE SOMBRE
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
});

function initTheme() {
    // Récupérer le thème sauvegardé
    const savedTheme = localStorage.getItem('vansplus_theme') || 'light';
    setTheme(savedTheme, false);
    
    // Créer le bouton de toggle
    createThemeToggle();
}

function createThemeToggle() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.id = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Changer le thème');
    toggleBtn.title = 'Changer le thème';
    
    const currentTheme = localStorage.getItem('vansplus_theme') || 'light';
    toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    
    toggleBtn.addEventListener('click', toggleTheme);
    
    document.body.appendChild(toggleBtn);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    const toggleBtn = document.getElementById('theme-toggle');
    toggleBtn.classList.add('switching');
    
    setTimeout(() => {
        setTheme(newTheme);
        toggleBtn.classList.remove('switching');
    }, 250);
}

function setTheme(theme, animate = true) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vansplus_theme', theme);
    
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // Notification optionnelle
    if (animate) {
        const message = theme === 'dark' ? '🌙 Mode sombre activé' : '☀️ Mode clair activé';
        showNotification(message, 'info');
    }
}

// Détecter la préférence système
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Écouter les changements de préférence système
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
    });
}