document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (password !== confirmPassword) {
        document.getElementById('password-error-message').textContent = "Passwords do not match!";
        return;
    } else {
        document.getElementById('password-error-message').textContent = "";
    }

    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: password,
    };

    fetch('https://localhost:7019/api/v1/Users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('registration-success-message').textContent = "User registered successfully!";
        // Redirect to login page after a delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});