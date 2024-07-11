
let likedList = new Set()
let unLikedList = new Set()






document.getElementById('myHeros').addEventListener('click', ()=> {
    if (!localStorage.userId) {
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
    } else{
        window.location.href = `/users/posts/${localStorage.userId}`;
    }
})
document.getElementById('profile').addEventListener('click', ev => {
    if (!localStorage.userId) {
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


    } else {
        window.location.href = `/users/${localStorage.userId}`;
    }
})
fetch(`/users/voted/${localStorage.userId}`,{
    method: 'GET',
}).then((response)=>{
    if (!response.ok){
        throw new Error(response.statusText)
    }
    return response.json()
}).then(data=>{
    const likedPostId=data;
    document.querySelectorAll('.like img').forEach((img)=>{
        if (likedPostId.includes(img.id)){
            img.src = '../../static/images/filledheart.png';
        }
    })
})
function toggleHeart(postId) {
    const src = postId
    const img = document.getElementById(src);
    if (!localStorage.token) {
    
        console.error("You are not logged in")
    }
    else if (img.src.endsWith('blankheart.png')) {
        if (unLikedList.has(postId)) {
            unLikedList= new Set(Array.from(unLikedList).filter(item => item != postId))
        }
        else { likedList.add(postId) }

        likeNum = document.getElementById(`likeCount${postId}`)
        likeNum.innerHTML = parseInt(likeNum.innerHTML) + 1
        img.src = '../static/images/filledheart.png'; // Change to filled heart image

    } else {
        if (likedList.has(postId)) {
            likedList = new Set(Array.from(likedList).filter(item => item != postId))
        }
        else { unLikedList.add(postId) }

        likeNum = document.getElementById(`likeCount${postId}`)
        likeNum.innerHTML = parseInt(likeNum.innerHTML) - 1
        img.src = '../static/images/blankheart.png'; // Change to empty heart image

    }

}

window.addEventListener('beforeunload', () => {
setTimeout(() => {
    Array.from(unLikedList).forEach(element => {
        data = {
            "post_id": element,
            "direction": 0
        }
        fetch('/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }

        }).catch(error => {
            console.error(error) });
    })

}, 0);
setTimeout(() => {
    Array.from(likedList).forEach(element => {
        data = {
            "post_id": element,
            "direction": 1
        }
        fetch('/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }

        }).catch(error => {
            console.error(error) });
    }) 
}, 0);

})


