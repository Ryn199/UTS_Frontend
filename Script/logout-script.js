    // Fungsi untuk logout
    document.getElementById('logout-btn').addEventListener('click', function(event) {
        event.preventDefault();
        const token = localStorage.getItem('token');
        if (window.confirm('Apakah Anda yakin ingin keluar?')) {
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
        }
    });