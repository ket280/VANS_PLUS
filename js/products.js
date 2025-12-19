// Base de données produits VANSPLUS avec images Unsplash
const products = [
    {
        id: 1,
        name: 'Vans Classic Old Skool',
        category: 'shoes',
        price: 89.99,
        oldPrice: 119.99,
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80',
        rating: 4.8,
        reviews: 234,
        stock: 50,
        colors: ['Noir', 'Blanc', 'Rouge'],
        sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
        description: 'Baskets Vans authentiques avec bande signature',
        featured: true,
        sale: true
    },
    {
        id: 2,
        name: 'Nike Air Force 1',
        category: 'shoes',
        price: 109.99,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80',
        rating: 4.9,
        reviews: 456,
        stock: 80,
        colors: ['Blanc', 'Noir', 'Bleu'],
        sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
        description: 'Classique Nike Air Force 1 intemporel',
        featured: true
    },
    {
        id: 3,
        name: 'Adidas Superstar',
        category: 'shoes',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        rating: 4.7,
        reviews: 189,
        stock: 60,
        colors: ['Blanc/Noir', 'Blanc/Bleu'],
        sizes: ['37', '38', '39', '40', '41', '42', '43'],
        description: 'Adidas Superstar avec coque iconique',
        featured: true
    },
    {
        id: 4,
        name: 'Converse Chuck Taylor',
        category: 'shoes',
        price: 64.99,
        oldPrice: 79.99,
        image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80',
        rating: 4.6,
        reviews: 312,
        stock: 120,
        colors: ['Noir', 'Blanc', 'Rouge', 'Bleu'],
        sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
        description: 'Converse All Star Chuck Taylor authentique',
        featured: true,
        sale: true
    },
    {
        id: 5,
        name: 'New Balance 574',
        category: 'shoes',
        price: 119.99,
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80',
        rating: 4.8,
        reviews: 203,
        stock: 45,
        colors: ['Gris', 'Bleu', 'Noir'],
        sizes: ['38', '39', '40', '41', '42', '43', '44'],
        description: 'New Balance 574 - confort et style',
        featured: true
    },
    {
        id: 6,
        name: 'Puma Suede Classic',
        category: 'shoes',
        price: 74.99,
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80',
        rating: 4.5,
        reviews: 145,
        stock: 55,
        colors: ['Noir', 'Bleu', 'Rouge'],
        sizes: ['37', '38', '39', '40', '41', '42'],
        description: 'Puma Suede Classic en daim premium',
        featured: false
    },
    {
        id: 7,
        name: 'Reebok Club C',
        category: 'shoes',
        price: 84.99,
        image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&q=80',
        rating: 4.7,
        reviews: 178,
        stock: 70,
        colors: ['Blanc', 'Noir', 'Vert'],
        sizes: ['36', '37', '38', '39', '40', '41', '42'],
        description: 'Reebok Club C - style rétro tennis',
        featured: true
    },
    {
        id: 8,
        name: 'Jordan 1 Retro',
        category: 'shoes',
        price: 179.99,
        oldPrice: 220.00,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80',
        rating: 4.9,
        reviews: 523,
        stock: 30,
        colors: ['Rouge/Noir', 'Blanc/Bleu', 'Noir/Blanc'],
        sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
        description: 'Air Jordan 1 Retro High - légende du basket',
        featured: true,
        sale: true
    },
    {
        id: 9,
        name: 'Asics Gel Lyte',
        category: 'shoes',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
        rating: 4.6,
        reviews: 167,
        stock: 50,
        colors: ['Noir', 'Bleu', 'Gris'],
        sizes: ['38', '39', '40', '41', '42', '43'],
        description: 'Asics Gel Lyte III - technologie GEL',
        featured: true
    },
    {
        id: 10,
        name: 'Fila Disruptor',
        category: 'shoes',
        price: 94.99,
        image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=500&q=80',
        rating: 4.4,
        reviews: 134,
        stock: 65,
        colors: ['Blanc', 'Noir', 'Rose'],
        sizes: ['36', '37', '38', '39', '40', '41', '42'],
        description: 'Fila Disruptor II - chunky sneaker tendance',
        featured: false
    },
    {
        id: 11,
        name: 'Saucony Jazz',
        category: 'shoes',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500&q=80',
        rating: 4.5,
        reviews: 98,
        stock: 40,
        colors: ['Gris', 'Bleu', 'Vert'],
        sizes: ['37', '38', '39', '40', '41', '42', '43'],
        description: 'Saucony Jazz Original - running rétro',
        featured: false
    },
    {
        id: 12,
        name: 'Under Armour Hovr',
        category: 'shoes',
        price: 139.99,
        oldPrice: 169.99,
        image: './images/Img1.jpg',
        rating: 4.7,
        reviews: 211,
        stock: 55,
        colors: ['Noir', 'Gris', 'Bleu'],
        sizes: ['38', '39', '40', '41', '42', '43', '44'],
        description: 'Under Armour Hovr - technologie anti-impact',
        featured: false,
        sale: true
    }
];

// Récupérer les produits en vedette
function getFeaturedProducts() {
    return products.filter(p => p.featured);
}

// Récupérer les produits en promotion
function getSaleProducts() {
    return products.filter(p => p.sale);
}

// Récupérer un produit par ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Filtrer les produits
function filterProducts(category, maxPrice, searchQuery) {
    return products.filter(p => {
        const categoryMatch = !category || category === 'all' || p.category === category;
        const priceMatch = !maxPrice || p.price <= maxPrice;
        const searchMatch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && priceMatch && searchMatch;
    });
}

// Trier les produits
function sortProducts(productsArray, sortBy) {
    const sorted = [...productsArray];
    
    switch(sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'newest':
            return sorted.reverse();
        default:
            return sorted;
    }
}