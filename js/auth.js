// ================================================
// SYSTÈME D'AUTHENTIFICATION VANSPLUS
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    initAuth();
});

// Initialiser l'authentification
function initAuth() {
    // Vérifier si l'utilisateur est connecté
    checkAuthStatus();
    
    // Formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Formulaire d'inscription
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Bouton de déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Gérer la connexion
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Valider les champs
    if (!email || !password) {
        showNotification('⚠️ Veuillez remplir tous les champs', 'warning');
        return;
    }
    
    // Récupérer les utilisateurs
    const users = JSON.parse(localStorage.getItem('vansplus_users') || '[]');
    
    // Chercher l'utilisateur
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Connexion réussie
        const session = {
            userId: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };
        
        localStorage.setItem('vansplus_session', JSON.stringify(session));
        
        showNotification('✅ Connexion réussie ! Redirection...', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showNotification('❌ Email ou mot de passe incorrect', 'error');
    }
}

// Gérer l'inscription
function handleRegister(e) {
    e.preventDefault();
    
    const firstname = document.getElementById('register-firstname').value;
    const lastname = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    // Validation
    if (!firstname || !lastname || !email || !password || !confirm) {
        showNotification('⚠️ Veuillez remplir tous les champs obligatoires', 'warning');
        return;
    }
    
    if (password.length < 8) {
        showNotification('⚠️ Le mot de passe doit contenir au moins 8 caractères', 'warning');
        return;
    }
    
    if (password !== confirm) {
        showNotification('⚠️ Les mots de passe ne correspondent pas', 'warning');
        return;
    }
    
    // Vérifier si l'email existe déjà
    const users = JSON.parse(localStorage.getItem('vansplus_users') || '[]');
    const emailExists = users.some(u => u.email === email);
    
    if (emailExists) {
        showNotification('⚠️ Cet email est déjà utilisé', 'warning');
        return;
    }
    
    // Créer le nouvel utilisateur
    const newUser = {
        id: 'USER-' + Date.now(),
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        password: password, // En production, utilisez un hash !
        createdAt: new Date().toISOString(),
        orders: [],
        wishlist: []
    };
    
    users.push(newUser);
    localStorage.setItem('vansplus_users', JSON.stringify(users));
    
    showNotification('✅ Compte créé avec succès ! Redirection...', 'success');
    
    // Connexion automatique
    const session = {
        userId: newUser.id,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('vansplus_session', JSON.stringify(session));
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Vérifier le statut de connexion
function checkAuthStatus() {
    const session = JSON.parse(localStorage.getItem('vansplus_session'));
    
    if (session) {
        // Utilisateur connecté
        updateHeaderForLoggedInUser(session);
    }
}

// Mettre à jour le header pour utilisateur connecté
function updateHeaderForLoggedInUser(session) {
    const userIcon = document.querySelector('.header-icons .icon:has([title="Compte"])');
    
    if (userIcon) {
        userIcon.innerHTML = `
            <div class="user-menu">
                <span class="user-name">👤 ${session.firstname}</span>
                <div class="user-dropdown">
                    <a href="profile.html">Mon profil</a>
                    <a href="orders.html">Mes commandes</a>
                    <a href="#" id="logout-btn">Déconnexion</a>
                </div>
            </div>
        `;
    }
}

// Gérer la déconnexion
function handleLogout(e) {
    e.preventDefault();
    
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        localStorage.removeItem('vansplus_session');
        showNotification('👋 Déconnexion réussie', 'info');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Obtenir l'utilisateur connecté
function getCurrentUser() {
    const session = JSON.parse(localStorage.getItem('vansplus_session'));
    if (!session) return null;
    
    const users = JSON.parse(localStorage.getItem('vansplus_users') || '[]');
    return users.find(u => u.id === session.userId);
}

// Vérifier si l'utilisateur est connecté
function isLoggedIn() {
    return localStorage.getItem('vansplus_session') !== null;
}

// Rediriger vers la connexion si non connecté
function requireAuth() {
    if (!isLoggedIn()) {
        showNotification('⚠️ Vous devez être connecté pour accéder à cette page', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    return true;
}