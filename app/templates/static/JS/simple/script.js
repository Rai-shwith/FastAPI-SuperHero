document.getElementById('myHeros').addEventListener('click', ev =>{
    fetch('/users/id',{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.token}`
    }}).then(response =>{
        if (!response.ok){
            throw new Error(response.statusText);
        }
        return response.json();
    }).then(userId=>{
        id = userId.id;
        window.location.href=`/users/posts/${id}`;
    })
})