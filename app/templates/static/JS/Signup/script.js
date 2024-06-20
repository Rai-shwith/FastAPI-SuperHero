console.log("hello, jfaoif")
document.getElementById('signupForm').addEventListener('submit', function (event) {
    console.log("hello, jfaoif")
    event.preventDefault()
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const credentials = {
        "user_name": name,
        "email": email,
        "password": password
    };
    fetch('/users/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(response => {
        if (!response.ok) {
            throw new Error("Error while sending info: ",response.statusText)
        }
        return response.json()
    }).then(userinfo => {
        const formdata = new FormData();
        formdata.append('username', userinfo.email);
        formdata.append('password', credentials.password);
        fetch('/api/token', {
            method: 'POST',
            body: formdata
        }).then(response => {
            if (!response.ok) {
                throw new Error("Error while receiving token: ",response.statusText)
            }
            return response.json()
        }).then(data =>{
            localStorage.setItem('token',data.acess_token);
            localStorage.setItem('tokenType',data.token_type);
            window.location.href = '/posts';
        })
    })
})