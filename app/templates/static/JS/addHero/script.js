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
            if (response.status == 401) {
                window.location.href='/login';
                // throw new Error(response.statusText);
                
            }
        }
        else{
            return response.json()

        }
    }).then(data => {
        if (!(data == undefined))
        window.location.href = `/posts/${data.id}`;
    })
})