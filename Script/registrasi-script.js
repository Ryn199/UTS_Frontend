document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const password_confirmation = document.getElementById('password_confirmation').value;

        fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, password_confirmation }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registrasi berhasil.');
                window.location.href = 'login.html'; // Redirect ke login
            } else {
                alert('Registrasi gagal, silahkan coba lagi.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
