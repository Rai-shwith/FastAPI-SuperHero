document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault()
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    fetch('/api/token', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.acess_token);
            localStorage.setItem('tokenType', data.token_type);
            window.location.href = "/posts"
        }).catch(error => {
            console.error('Error while Logging in: ', error)
        })
});
