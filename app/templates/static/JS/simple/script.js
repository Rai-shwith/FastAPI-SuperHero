document.getElementById('myHeros').addEventListener('click', ev => {
    fetch('/users/id', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.token}`
        }
    }).then(response => {
        if (!response.ok) {
            if (response.status == 401) {
                console.error(response.statusText)
                const message = document.getElementById('center');
                message.style.display = 'block';
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
        return response.json();
    }).then(userId => {
        id = userId.id;
        window.location.href = `/users/posts/${id}`;
    })
})
document.getElementById('profile').addEventListener('click', ev => {
    fetch('/users/id', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.token}`
        }
    }).then(response => {
        if (!response.ok) {
            if (response.status == 401) {
                console.error(response.statusText)
                const message = document.getElementById('center');
                message.style.display = 'block';
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
        return response.json();
    }).then(userId => {
        id = userId.id;
        window.location.href = `/users/${id}`;
    })
})

// document.getElementById('like-box').addEventListener('click',function(clicked){
//     console.log(clicked)
// })

function toggleHeart(id) {
    const src = 'like-img' + id
    console.log(src)
    const img = document.getElementById(src);
    if (img.src.endsWith('blankheart.png')) {
        console.log("OALSKDFJOI")
        img.src = '../static/images/filledheart.png'; // Change to filled heart image
    } else {
        img.src = '../static/images/blankheart.png'; // Change to empty heart image
    }
}


function deleteAccount() {
    id = window.location.pathname.substring(7)//THis is because I cannot transfer large int from html so iam using id from the endpoint
    fetch(`/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.token}`
        }
    }).then(response => {
        if (response.status == 204) {
            localStorage.clear()
            console.log("Account Deleted")
            window.location.href = "/login"
        }})
}