document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const token = data.data.access_token;
                const role = data.data.user.role;

                localStorage.setItem('token', token);

                if (role === 'customer') {
                    window.location.href = 'katalog.html'; // Redirect ke katalogh
                } else if (role === 'admin') {
                    window.location.href = 'Admin/kelola_produk.html'; // Redirect ke kelola produk
                } else {
                    alert('Unknown user role. Please contact support.');
                }
            } else {
                alert('Login failed. Please check your credentials.');
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
        });
    });
});
