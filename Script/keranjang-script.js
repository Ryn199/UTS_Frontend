document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; // Redirect ke login
    } else {
        fetchKeranjang(token);
    }
});

function fetchKeranjang(token) {
    fetch('http://localhost:8000/api/keranjang', {
        headers: {
            'Authorization': `Bearer ${token}`,
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
            displayKeranjang(data.data);
        } else {
            console.error('Failed to load keranjang:', data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching keranjang:', error);
    });
}

function displayKeranjang(keranjang) {
    const keranjangContainer = document.getElementById('keranjang-container');
    keranjangContainer.innerHTML = ''; 

    if (keranjang.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.innerHTML = '<h1>Yahh kamu belum memasukkan produk ke keranjang</h1>';
        keranjangContainer.appendChild(emptyMessage);
    } else {
        keranjang.forEach(item => {
            const productCard = createProductCard(item);
            keranjangContainer.appendChild(productCard);
        });
    }

    hitungTotalHarga(keranjang);
}

function hitungTotalHarga(keranjang) {
    let totalHarga = 0;
    keranjang.forEach(item => {
        totalHarga += parseInt(item.jumlah) * parseInt(item.product.harga);
    });

    const totalHargaElement = document.getElementById('total-harga');
    totalHargaElement.textContent = 'Rp ' + formatCurrency(totalHarga);
}


function createProductCard(item) {
    const card = document.createElement('div');
    card.className = 'col-md-12 product-card';

    if (item.product) { // Tambahkan pengecekan apakah item.product tidak null
        card.innerHTML = `
            <div class="row no-gutters">
                <div class="col-md-3">
                    <img src="${item.product.picture_url ? item.product.picture_url : 'placeholder.jpg'}" class="product-img">
                </div>
                <div class="col-md-9">
                    <div class="product-info">
                        <h5 class="product-name">${truncateString(item.product.nama, 30)}</h5>
                        <p class="product-price">Rp ${item.product.harga}</p>
                        <div class="quantity-container">
                            <input type="number" min="1" class="form-control jumlah-input" data-id="${item.id}" value="${item.jumlah}">
                            <button class="btn btn-primary save-btn" data-id="${item.id}">Simpan</button>
                            <button class="btn btn-danger delete-btn" data-id="${item.id}">Hapus</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        card.innerHTML = `
            <div class="row no-gutters">
                <div class="col-md-3">
                    <img src="placeholder.jpg" class="product-img">
                </div>
                <div class="col-md-9">
                    <div class="product-info">
                        <h5 class="product-name">Produk tidak ditemukan</h5>
                        <p class="product-price">-</p>
                    </div>
                </div>
            </div>
        `;
    }

    return card;
}



// Fungsi formatCurrency untuk memformat nilai mata uang
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


document.addEventListener('click', function(event) {
    if (event.target.classList.contains('save-btn')) {
        const productId = event.target.getAttribute('data-id');
        const jumlahInput = document.querySelector(`.jumlah-input[data-id="${productId}"]`).value;
        updateKeranjang(productId, jumlahInput);
    }

    if (event.target.classList.contains('delete-btn')) {
        const productId = event.target.getAttribute('data-id');
        deleteKeranjang(productId);
    }
});

function updateKeranjang(id, jumlah) {
    const token = localStorage.getItem('token');
    const jumlahInput = parseInt(jumlah); // Konversi nilai input ke tipe data integer

    fetch(`http://localhost:8000/api/keranjang/update/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jumlah: jumlahInput }) 
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Jumlah produk berhasil diperbarui');
            fetchKeranjang(token); // Refresh keranjang
        } else {
            if (data.message === 'Stok tidak mencukupi') {
                alert('Jumlah produk melebihi stok yang tersedia');
            } else {
                console.error('Failed to update keranjang:', data.message);
            }
        }
    })
    .catch(error => {
        console.error('Error updating keranjang:', error);
    });
}


function deleteKeranjang(id) {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8000/api/keranjang/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Produk berhasil dihapus dari keranjang');
            fetchKeranjang(token); 
        } else {
            console.error('Failed to delete product:', data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting product:', error);
    });
}

// Fungsi untuk memotong string
function truncateString(str, maxLen) {
    if (str.length <= maxLen) {
        return str;
    }
    return str.substr(0, maxLen) + '...';
}
