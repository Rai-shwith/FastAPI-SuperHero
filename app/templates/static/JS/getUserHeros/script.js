let likedList = new Set()
let unLikedList = new Set()
let path=window.location.href.split('/')
if (path[path.length-1]!=localStorage.userId) {

    document.querySelector('.item2').style.backgroundColor='rgba(82, 114, 152, 1)';
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
}


function toggleHeart(postId) {
    const src = postId
    const img = document.getElementById(src);
    if (!localStorage.token) {
        throw new Error("You are not logged in")
    }
    else if (img.src.endsWith('blankheart.png')) {
        if (unLikedList.has(postId)) {
            unLikedList = new Set(Array.from(unLikedList).filter(item => item != postId))
        }
        else { likedList.add(postId) }

        let likeNum = document.getElementById(`likeCount${postId}`)
        likeNum.innerHTML = parseInt(likeNum.innerHTML) + 1
        img.src = '../../static/images/filledheart.png'; // Change to filled heart image

    } else {
        if (likedList.has(postId)) {
            likedList = new Set(Array.from(likedList).filter(item => item != postId))
        }
        else { unLikedList.add(postId) }

        let likeNum = document.getElementById(`likeCount${postId}`)
        likeNum.innerHTML = parseInt(likeNum.innerHTML) - 1
        img.src = '../../static/images/blankheart.png'; // Change to empty heart image

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
    },0);
    
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
function deleteHero(heroId) {
    setTimeout(() => {
        if (confirm('Are you sure you want to delete?')){
            fetch(`/posts/${heroId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.token}`
                }
            }).then(response => {
                if (response.status == 204) {
                    console.log("Heo Deleted")
                    window.location.href = `/users/posts/${localStorage.userId}`;
                    }})
        }
    }, 300);
}