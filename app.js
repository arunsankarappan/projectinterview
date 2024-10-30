// app.js

const API_URL = 'https://fakestoreapi.com/products';
let products = [];
let filteredProducts = [];
let displayedProductsCount = 10;

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        products = await response.json();
        filteredProducts = products; // Initially set filtered products to all products
        displayProducts(filteredProducts.slice(0, displayedProductsCount));
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products on the page
function displayProducts(productsToDisplay) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear existing products
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" />
            <h4>${product.title.length > 100 ? product.title.substring(0, 100) + '...' : product.title}</h4>
            <p>${product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}</p>
            <p>$${product.price}</p>
        `;
        productList.appendChild(productCard);
    });
}

// Load more products
function loadMoreProducts() {
    displayedProductsCount += 10; // Increase the count
    const moreProducts = filteredProducts.slice(0, displayedProductsCount);
    displayProducts(moreProducts);

    // Disable button if all products are displayed
    const loadMoreButton = document.getElementById('load-more');
    if (displayedProductsCount >= filteredProducts.length) {
        loadMoreButton.disabled = true; // Disable button
        loadMoreButton.textContent = 'No More Products'; // Update button text
    }
}

// Filter products by category
function filterProductsByCategory(category) {
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    displayedProductsCount = 10; // Reset displayed count
    loadMoreProducts(); // Reload products
}

// Sort products
function sortProducts(order) {
    if (order === 'low-to-high') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (order === 'high-to-low') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    displayedProductsCount = 10; // Reset displayed count
    loadMoreProducts(); // Reload products
}

// Search products
function searchProducts(event) {
    const searchTerm = event.target.value.toLowerCase();
    filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchTerm));
    displayedProductsCount = 10; // Reset displayed count
    loadMoreProducts(); // Reload products
}

// Price Range Filter Functionality
function filterProductsByPrice(range) {
    const maxPrice = range; // Get the max price from the slider
    filteredProducts = products.filter(product => product.price <= maxPrice);
    displayedProductsCount = 10; // Reset displayed count
    loadMoreProducts(); // Reload products
}

// Update the displayed price value
document.getElementById('price-range').addEventListener('input', (event) => {
    const priceValueElement = document.getElementById('price-value');
    const rangeValue = event.target.value;
    priceValueElement.textContent = `$${rangeValue}`; // Update displayed value
    filterProductsByPrice(rangeValue); // Filter products based on selected price range
});

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchProducts);
document.getElementById('load-more').addEventListener('click', loadMoreProducts);
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', (e) => {
        document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
        e.currentTarget.classList.add('active'); // Highlight active category
        filterProductsByCategory(e.currentTarget.dataset.category);
    });
});
document.getElementById('sort-options').addEventListener('change', (e) => {
    sortProducts(e.target.value);
});
document.getElementById('search-bar').addEventListener('keyup', searchProducts);

// Toggle sidebar for mobile view
document.getElementById('hamburger').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('sidebar-active');
});
