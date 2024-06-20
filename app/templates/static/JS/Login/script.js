document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault()
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    // const credentials = {
    //     'username' : email,
    //     'password' : password
    // }

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    fetch('/api/token', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('token', data.acess_token)
        }).catch(error => {
            console.error('Error while Logging in: ', error)
        })
});
