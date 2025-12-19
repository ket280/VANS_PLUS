// ================================================
// GESTION DU CACHE
// ================================================

const CACHE_VERSION = 'v1.0.0';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures

// Mettre en cache les données
function cacheData(key, data) {
    const cacheItem = {
        data: data,
        timestamp: Date.now(),
        version: CACHE_VERSION
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
}

// Récupérer les données du cache
function getCachedData(key) {
    const cached = localStorage.getItem(`cache_${key}`);
    
    if (!cached) return null;
    
    const cacheItem = JSON.parse(cached);
    
    // Vérifier la version
    if (cacheItem.version !== CACHE_VERSION) {
        localStorage.removeItem(`cache_${key}`);
        return null;
    }
    
    // Vérifier l'expiration
    if (Date.now() - cacheItem.timestamp > CACHE_DURATION) {
        localStorage.removeItem(`cache_${key}`);
        return null;
    }
    
    return cacheItem.data;
}

// Nettoyer les anciens caches
function cleanOldCaches() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cache_')) {
            const cached = localStorage.getItem(key);
            try {
                const cacheItem = JSON.parse(cached);
                if (cacheItem.version !== CACHE_VERSION || 
                    Date.now() - cacheItem.timestamp > CACHE_DURATION) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                localStorage.removeItem(key);
            }
        }
    }
}

// Nettoyer au chargement
document.addEventListener('DOMContentLoaded', cleanOldCaches);