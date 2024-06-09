document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; //Redirect ke login
    } else {
        fetchCategories(token);
        fetchProducts(token);
    }
});


function fetchProducts(token) {
    fetch('http://localhost:8000/api/admin/produk', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Cek respons data
        displayProducts(data.data.produk); // memanggil fungsi displayProducts
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });
}

function fetchCategories(token) {
    fetch('http://localhost:8000/api/admin/kategori', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const kategoriProdukSelect = document.getElementById('kategoriProduk');
        const editKategoriProdukSelect = document.getElementById('editKategoriProduk');
        
        // Clear opsi pilihan
        kategoriProdukSelect.innerHTML = '';
        editKategoriProdukSelect.innerHTML = '';

        // Populate the select elements
        data.data.forEach(kategori => {
            const option1 = document.createElement('option');
            option1.value = kategori.id;
            option1.text = kategori.nama;
            kategoriProdukSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = kategori.id;
            option2.text = kategori.nama;
            editKategoriProdukSelect.appendChild(option2);
        });
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
    });
}


function displayProducts(products) {
    const tableBody = document.getElementById('produk-table-body');
    tableBody.innerHTML = ''; // Clear table content

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.picture_url}" width="100" height="100" overflow="hidden"></td>
            <td>${product.nama}</td>
            <td>${product.deskripsi}</td>
            <td>Rp ${formatCurrency(product.harga)}</td>
            <td>${product.stok}</td>
            <td>${product.category.nama}</td> <!-- Display category name -->
            <td>
            <button type="button" class="btn btn-danger mr-2" onclick="deleteProduct(${product.id})">Delete</button>
            <button type="button" class="btn btn-primary" onclick="openEditModal(${product.id})">Edit</button> <!-- Added Edit button -->
        </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteProduct(id) {
    const token = localStorage.getItem('token');

    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        fetch(`http://localhost:8000/api/admin/produk/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Check response data
            alert('Produk berhasil dihapus');
            fetchProducts(token); // Refresh product list
        })
        .catch(error => {
            console.error('Error deleting product:', error);
        });
    }
}

// format rupiah
function formatCurrency(amount) {
    return (amount / 1000).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, -1); 
}

function displayCategories(categories) {
    const selectCategory = document.getElementById('selectCategory');
    selectCategory.innerHTML = ''; 

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.nama;
        selectCategory.appendChild(option);
    });
}


// Mendapatkan data dari form dan mengirimnya ke API
document.getElementById('formTambahProduk').addEventListener('submit', function(event) {
    event.preventDefault(); // Menghentikan aksi default form (submit)

    const token = localStorage.getItem('token');
    const nama = document.getElementById('namaProduk').value;
    const deskripsi = document.getElementById('deskripsiProduk').value;
    const harga = document.getElementById('hargaProduk').value;
    const stok = document.getElementById('stokProduk').value;
    const kategoriId = document.getElementById('kategoriProduk').value;
    const image = document.getElementById('imageProduk').files[0];

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);
    formData.append('harga', harga);
    formData.append('stok', stok);
    formData.append('category_id', kategoriId);
    formData.append('image', image);

    fetch('http://localhost:8000/api/admin/produk/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Cek respons data
        alert('Produk berhasil ditambahkan');
        window.location.href = 'kelola_produk.html'; // Redirect ke l login
    })
    .catch(error => {
        console.error('Error adding product:', error);
    });
});


function openEditModal(id) {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8000/api/admin/produk/show/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const product = data.data.produk;
        
        // Set value
        document.getElementById('editProdukId').value = product.id;
        document.getElementById('editNamaProduk').value = product.nama;
        document.getElementById('editDeskripsiProduk').value = product.deskripsi;
        document.getElementById('editHargaProduk').value = product.harga;
        document.getElementById('editStokProduk').value = product.stok;

        fetchCategories(token);
        document.getElementById('editKategoriProduk').value = product.category_id;

        // Show the modal
        $('#modalEditProduk').modal('show');
    })
    .catch(error => {
        console.error('Error fetching product details for edit:', error);
    });
}



document.getElementById('formEditProduk').addEventListener('submit', function(event) {
    event.preventDefault();

    const id = document.getElementById('editProdukId').value;
    const token = localStorage.getItem('token');
    const nama = document.getElementById('editNamaProduk').value;
    const deskripsi = document.getElementById('editDeskripsiProduk').value;
    const harga = document.getElementById('editHargaProduk').value;
    const stok = document.getElementById('editStokProduk').value;
    const kategoriId = document.getElementById('editKategoriProduk').value;
    const image = document.getElementById('editImageProduk') ? document.getElementById('editImageProduk').files[0] : null;

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);
    formData.append('harga', harga);
    formData.append('stok', stok);
    formData.append('category_id', kategoriId);
    if (image) {
        formData.append('image', image);
    }

    fetch(`http://localhost:8000/api/admin/produk/update/${id}`, {
        method: 'POST', 
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); 
        $('#modalEditProduk').modal('hide'); 
        fetchProducts(token); 
    })
    .catch(error => {
        console.error('Error updating product:', error);
    });
});
