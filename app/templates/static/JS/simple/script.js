// document.getElementById('myHeros').addEventListener('click', ev => {
//     fetch('/users/id', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${localStorage.token}`
//         }
//     }).then(response => {
//         if (!response.ok) {
//             if (response.status == 401) {
//                 console.error(response.statusText)
//                 const message = document.getElementById('center');
//                 message.style.display = 'block';
//                 document.getElementById('page-body').classList.add('body-opacity');
//                 setTimeout(() => {
//                     window.location.href = "/login"
//                     setTimeout(() => {
//                         message.style.display = 'none';
//                         document.getElementById('page-body').classList.remove('body-opacity');

//                     }, 50);
//                 }, 1500);


//             }
//             throw new Error(response.statusText);
//         }
//         return response.json();
//     }).then(userId => {
//         id = userId.id;
//         window.location.href = `/users/posts/${id}`;
//     })
// })
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
        return response.json();
    }).then(userId => {
        id = userId.id;
        window.location.href = `/users/${id}`;
    })
})


function deleteAccount() {
    setTimeout(() => {
        if (confirm('Are you sure you want to delete?')){
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
    }, 300);
    }