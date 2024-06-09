document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; //Redirect ke login
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        if (productId) {
            // Hilangin request di url biar gak keliatan
            window.history.pushState({}, '', `detail_produk.html`);

            fetchProductDetails(token, productId);
        } else {
            console.error('Product ID not found in URL.');
        }
    }

    // Fungsi untuk logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        if (token) {
            fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.removeItem('token'); // Remove token
                    window.location.href = 'login.html'; // Redirect ke login
                } else {
                    console.error('Logout failed:', data.message);
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
        } else {
            console.error('Token not found.');
        }
    });
});

function fetchProductDetails(token, productId) {
    fetch(`http://localhost:8000/api/produk/show/${productId}`, {
        headers: {
            'Authorization': `Bearer ${token}`, // menggunakan token
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            displayProductDetails(data.data.produk); // Akses data produk
        } else {
            console.error('Failed to load product details:', data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching product details:', error);
    });
}

function displayProductDetails(product) {
    const productContainer = document.getElementById('product-detail-container');
    productContainer.innerHTML = `
        <div class="col-md-6">
            <img src="${product.picture_url}" class="img-fluid" alt="${product.nama}">
        </div>
        <div class="col-md-6">
            <h3>${product.nama}</h3>
            <p><strong>Harga:</strong> Rp ${product.harga}</p>
            <p><strong>Stok:</strong> ${product.stok}</p>
            <p><strong>Kategori:</strong> ${product.category.nama}</p>
            <p><strong>Deskripsi Kategori:</strong> ${product.category.deskripsi}</p>
            <hr>
            <h4>Deskripsi</h4>
            <p>${product.deskripsi}</p>
            </div>
            <hr>
            <div class="mt-3">
                <h5>Tambah ke Keranjang:</h5>
                <input type="number" id="jumlah" class="form-control mb-2" placeholder="Jumlah" min="1" value="1" max="${product.stok}">
                <button class="btn btn-success" id="tambah-keranjang-btn">Tambah ke Keranjang</button>
                <p id="error-message" class="text-danger mt-2"></p>
            </div>
        </div>
    `;

    document.getElementById('tambah-keranjang-btn').addEventListener('click', function() {
        const jumlah = document.getElementById('jumlah').value;
        addToCart(product.id, jumlah);
    });
}

function addToCart(productId, jumlah) {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/keranjang/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ product_id: productId, jumlah: jumlah }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Produk berhasil ditambahkan ke keranjang.');
        } else {
            document.getElementById('error-message').textContent = data.message || 'Gagal menambahkan produk ke keranjang.';
        }
    })
    .catch(error => {
        console.error('Error adding product to cart:', error);
        document.getElementById('error-message').textContent = 'Terjadi kesalahan saat menambahkan produk ke keranjang.';
    });
}
