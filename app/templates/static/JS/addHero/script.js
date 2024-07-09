document.getElementById('inputForm').addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('wheel').style.display = 'inline-block';
    document.getElementById('wheel').style.animation = 'spin 1s cubic-bezier(1,0,0,1)  infinite alternate';
    document.getElementById('loading').style.display = 'block';
    const alias = document.getElementById('heroName').value;
    const name = document.getElementById('personName').value;
    const data = {
        "name": name,
        "alias": alias
    }
    document.getElementById('heroName').value = '';
    document.getElementById('personName').value = '';
    fetch('/posts/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    }
    ).then(response => {
        if (!response.ok) {
            console.error(response.statusText)
            if (response.status == 401) {
                console.error(response.statusText)
                document.getElementById('wheel').style.display = 'none';
                document.getElementById('wheel').style.animation = 'none';
                document.getElementById('loading').style.display = 'none';
                const message = document.getElementById('center');
                message.style.display = 'flex';
                document.getElementById('page-body').classList.add('body-opacity');
                setTimeout(() => {
                    window.location.href = "/login"
                    setTimeout(() => {
                        message.style.display = 'none';
                        document.getElementById('page-body').classList.remove('body-opacity');

                    }, 50);
                }, 1500);


            }
            throw new Error(response.statusText);
        }
        else {
            return response.json()

        }
    }).then(data => {
        if (!(data == undefined)) {
            document.getElementById('wheel').style.display = 'none';
            document.getElementById('wheel').style.animation = 'none';
            document.getElementById('loading').style.display = 'none';
            const message = document.getElementById('center');
            message.innerHTML = `${data.alias} is Succesfully Added`
            message.style.color = 'green'
            message.style.display = 'flex';
            document.getElementById('page-body').classList.add('body-opacity');
            setTimeout(() => {

                window.location.href = `/posts/${data.id}`;
                setTimeout(() => {
                    message.style.display = 'none';
                    message.innerHTML = ''
                    document.getElementById('page-body').classList.remove('body-opacity');
                }, 50);


            }, 1500);



        }
    })
})