document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; // Redirect to login
    } else {
        fetchCategories(token);
    }
});

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
        const tableBody = document.getElementById('kategori-table-body');
        tableBody.innerHTML = '';

        data.data.forEach(kategori => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${kategori.id}</td>
                <td>${kategori.nama}</td>
                <td>${kategori.deskripsi}</td>
                <td>
                    <button class="btn btn-danger mr-2" onclick="deleteKategori(${kategori.id})">Delete</button>
                    <button class="btn btn-primary" onclick="openEditModal(${kategori.id})">Edit</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
    });
}

document.getElementById('formTambahKategori').addEventListener('submit', function(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const nama = document.getElementById('namaKategori').value;
    const deskripsi = document.getElementById('deskripsiKategori').value;

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);

    fetch('http://localhost:8000/api/admin/kategori/create', {
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
        console.log(data); // Check response data
        $('#modalTambahKategori').modal('hide'); // Hide add modal
        fetchCategories(token); // Refresh category list
    })
    .catch(error => {
        console.error('Error adding category:', error);
    });
});

function openEditModal(id) {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8000/api/admin/kategori/show/${id}`, {
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
        const kategori = data.data.kategori;
        document.getElementById('editKategoriId').value = kategori.id;
        document.getElementById('editNamaKategori').value = kategori.nama;
        document.getElementById('editDeskripsiKategori').value = kategori.deskripsi;

        $('#modalEditKategori').modal('show'); // Show edit modal
    })
    .catch(error => {
        console.error('Error fetching category details for edit:', error);
    });
}

document.getElementById('formEditKategori').addEventListener('submit', function(event) {
    event.preventDefault();

    const id = document.getElementById('editKategoriId').value;
    const token = localStorage.getItem('token');
    const nama = document.getElementById('editNamaKategori').value;
    const deskripsi = document.getElementById('editDeskripsiKategori').value;

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('deskripsi', deskripsi);

    fetch(`http://localhost:8000/api/admin/kategori/update/${id}`, {
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
        console.log(data); // Check response data
        $('#modalEditKategori').modal('hide'); 
        fetchCategories(token); // Refresh category list
    })
    .catch(error => {
        console.error('Error updating category:', error);
    });
});

function deleteKategori(id) {
    const token = localStorage.getItem('token');

    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
        fetch(`http://localhost:8000/api/admin/kategori/delete/${id}`, {
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
            alert('Kategori berhasil dihapus');
            fetchCategories(token); // Refresh category list
        })
        .catch(error => {
            console.error('Error deleting category:', error);
        });
    }
}
