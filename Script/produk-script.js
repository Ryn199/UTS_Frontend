document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; // Redirect ke login
    } else {
        fetchProducts(token);
    }

});

function fetchProducts(token) {
    fetch('http://localhost:8000/api/produk', {
        headers: {
            'Authorization': `Bearer ${token}`, // Gunakan token yang sudah tersimpan
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        console.log('Products fetch response data:', data); // Log response data
        if (data.success) {
            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = ''; // Kosongkan konten sebelum menambahkan produk baru
            data.data.produk.forEach(product => {
                const productCard = createProductCard(product);
                productContainer.appendChild(productCard);
            });
        } else {
            console.error('Failed to load products:', data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';

    card.innerHTML = `
        <div class="card" data-product-id="${product.id}">
            <img src="${product.picture_url}" class="card-img-top" alt="${product.nama}" height="300">
            <div class="card-body">
                <h5 class="card-title">${product.nama}</h5>
                <p class="card-text"><strong>Harga:</strong> Rp ${product.harga}</p>
                <p class="card-text"><strong>Stok:</strong> ${product.stok}</p>
            </div>
        </div>
    `;

    return card;
}

