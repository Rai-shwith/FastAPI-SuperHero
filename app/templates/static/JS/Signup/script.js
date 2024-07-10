document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault()
    document.getElementById('wheel').style.display = 'inline-block';
    document.getElementById('wheel').style.animation = 'spin 1s cubic-bezier(1,0,0,1)  infinite alternate';
    document.getElementById('loading').style.display = 'block';

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
            if (response.status == 422) {
                console.error(response.statusText)
                document.getElementById('wheel').style.display = 'none';
                document.getElementById('wheel').style.animation = 'none';
                document.getElementById('loading').style.display = 'none';
                const message = document.getElementById('center');
                message.style.display = 'flex';
                document.getElementById('page-body').classList.add('body-opacity');
                setTimeout(() => {

                    message.style.display = 'none';
                    document.getElementById('page-body').classList.remove('body-opacity');

                }, 1500);

            }
            else if (response.status == 409) {
                console.error(response.statusText)
                document.getElementById('wheel').style.display = 'none';
                document.getElementById('wheel').style.animation = 'none';
                document.getElementById('loading').style.display = 'none';
                const message = document.getElementById('center');
                message.innerHTML = 'Email Already Exist'
                message.style.display = 'flex';
                document.getElementById('page-body').classList.add('body-opacity');
                setTimeout(() => {

                    message.style.display = 'none';
                    message.innerHTML = 'Invalid Email'
                    document.getElementById('page-body').classList.remove('body-opacity');

                }, 1500);

            }
            throw new Error("Error while sending info: ", response.statusText)
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
                throw new Error("Error while receiving token: ", response.statusText)
            }
            return response.json()
        }).then(data => {
            localStorage.setItem('token', data.acess_token);
            fetch('/users/id', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error("Error while sending info: ", response.statusText)
                }
                return response.json();
            }).then(data => {
                localStorage.setItem('userId', data.id);
            }).catch(error => console.error(error))
            // document.getElementById('wheel').style.display = 'none';
            // document.getElementById('wheel').style.animation = 'none';
            // document.getElementById('loading').style.display = 'none';
            const message = document.getElementById('center');
            message.innerHTML = 'Successfully Signed up'
            message.style.color = 'green'
            message.style.display = 'flex';
            document.getElementById('page-body').classList.add('body-opacity');
            setTimeout(() => {
                window.location.href = "/posts"
                setTimeout(() => {
                    document.getElementById('signupName').value = ''
                    document.getElementById('signupEmail').value = ''
                    document.getElementById('signupPassword').value = ''
                    message.style.display = 'none';
                    message.innerHTML = 'Invalid Email'
                    document.getElementById('page-body').classList.remove('body-opacity');
                }, 1000);


            }, 1500);

        })
    })
})