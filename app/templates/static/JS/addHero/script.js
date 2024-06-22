document.getElementById('inputForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const alias = document.getElementById('heroName').value;
    const name = document.getElementById('personName').value;
    const data = {
        "name": name,
        "alias": alias
    }
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
            if (response.status == 401){
                console.error(response.statusText)
                const message = document.getElementById('center');
                message.style.display='block';
                document.getElementById('page-body').classList.add('body-opacity');
                setTimeout(() => {
                    window.location.href="/login"
                    setTimeout(() => {
                        message.style.display='none';
                        document.getElementById('page-body').classList.remove('body-opacity');
                        
                    }, 50);
                }, 1500);
                

            }
            throw new Error(response.statusText);
        }
        else{
            return response.json()

        }
    }).then(data => {
        if (!(data == undefined))
        window.location.href = `/posts/${data.id}`;
    })
})