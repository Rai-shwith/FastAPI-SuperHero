document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.token) {
        const message = document.getElementById('center');
        message.innerHTML = 'Successfully Logged in'
        message.style.color = 'green'
        message.style.display = 'block';
        document.getElementById('page-body').classList.add('body-opacity');
        setTimeout(() => {
            window.location.href = "/posts"
            setTimeout(() => {
                message.style.display = 'none';
                message.innerHTML = 'Invalid Credentials'
                document.getElementById('page-body').classList.remove('body-opacity');
            }, 50);


        }, 1500);
    }
})


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
                if (response.status == 403) {
                    console.error(response.statusText)
                    const message = document.getElementById('center');
                    message.style.display = 'block';
                    document.getElementById('page-body').classList.add('body-opacity');
                    setTimeout(() => {

                        message.style.display = 'none';
                        document.getElementById('page-body').classList.remove('body-opacity');

                    }, 1500);

                }

                throw new Error("Error while sending info: ", response.statusText)
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.acess_token);
            localStorage.setItem('tokenType', data.token_type);
            const message = document.getElementById('center');
            message.innerHTML = 'Successfully Logged in'
            message.style.color = 'green'
            message.style.display = 'block';
            document.getElementById('page-body').classList.add('body-opacity');
            setTimeout(() => {
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';
                window.location.href = "/posts"
                setTimeout(() => {
                    message.style.display = 'none';
                    message.innerHTML = 'Invalid Credentials'
                    document.getElementById('page-body').classList.remove('body-opacity');
                }, 50);


            }, 1500);


        }).catch(error => {
            console.error('Error while Logging in: ', error)
        })
});
