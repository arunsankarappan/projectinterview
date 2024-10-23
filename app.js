const productContainer = document.getElementById('product-list');
const loadMoreButton = document.getElementById('load-more');
const searchButton = document.getElementById('search-button');
const searchBar = document.getElementById('search-bar');
let products = [];
let itemsPerPage = 10;
let currentPage = 1;

// Fetch Products
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        products = await response.json();
        displayProducts(currentPage);
    } catch (error) {
        console.error('Error fetching products:', error);
        productContainer.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

// Display Products
function displayProducts(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const productSlice = products.slice(startIndex, endIndex);

    productSlice.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <p>${product.description.substring(0, 100)}...</p>
        `;
        productContainer.appendChild(productCard);
    });
}

// Lazy Load Products
loadMoreButton.addEventListener('click', () => {
    currentPage++;
    displayProducts(currentPage);
});

// Search Functionality
searchButton.addEventListener('click', () => {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    productContainer.innerHTML = ''; // Clear the product list
    displayFilteredProducts(filteredProducts);
});

function displayFilteredProducts(filteredProducts) {
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <p>${product.description.substring(0, 100)}...</p>
        `;
        productContainer.appendChild(productCard);
    });
}

// Initial fetch
fetchProducts();
