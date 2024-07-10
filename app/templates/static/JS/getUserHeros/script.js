// document.body.style.backgroundColor="rgba(126, 166, 212, 0.78)";
const likedList = []
const unLikedList = []
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
} 
// else {
// fetch(`/users/posts/${localStorage.userId}`, {
//     method: "GET",
//     headers: {
//         'Authorization': `Bearer ${localStorage.token}`
//     }
// }).then(response => {
//     if (!response.ok) {
//         console.error(response.statusText)
//     }
//     return response.json()
// }).then(data => {
//     topStr = `<div class="sticky-back"><a href="javascript:history.back()">Back</a> </div>`
//     boxStr = ""
//     if (data.length) {
//         for (let hero_index = 0; hero_index < data.length; hero_index++) {
//             if (data[hero_index]["is_liked"]) {
//                 heartSrc = "/static/images/filledheart.png"
//             }
//             else {
//                 heartSrc = "/static/images/blankheart.png"
//             }

//             boxStr += `<div class="upper-box">
//             <div class="box">
//                 <h1>${data[hero_index]["Post"]["alias"]}</h1>
//                 <h3>${data[hero_index]["Post"]["name"]}</h3>
//                 <div class="created-box">
//                     <div class="crtby">Created by : </div>
//                     <div class="email-txt">${data[hero_index]["Post"]["owner"]["user_name"]}</div>
//                 </div>
//                 <a href="/posts/${data[hero_index]["Post"]["id"]}">
//                     <div class="more-info">More info</div>
//                 </a>
//                 <div class="delete-btn"  onclick="deleteHero('${data[hero_index]["Post"]["id"]}')"><img draggable="false" src="../../static/images/material-symbols_delete.png" alt="delete icon" srcset=""></div>

//             </div>
            
//             <div id="like-box" onclick="toggleHeart(${hero_index},'${data[hero_index]["Post"]["id"]}')">
//                 <div id="like">
//                     <img draggable="false" id="like-img${hero_index}" style="position: absolute;" src=${heartSrc} alt=""
//                         srcset="">
//                     <span id="likeCount${hero_index}" style="position: absolute; z-index: 1;">${data[hero_index]["likes"]}</span>
//                 </div>
            
//             </div>
//         </div>`
//         }
//     }
//     else {
//         boxStr += `<div class="upper-box">
//             <div class="box">
//                 <h1>No Hero</h1>
//             </div>
//         </div>`
//     }
//     if(data.length<3){
//         document.getElementsByTagName('nav')[0].style.position='absolute';
//     }
//     document.getElementById('placeholder').innerHTML = topStr + boxStr;
//     document.getElementsByTagName('nav')[0].style.display = 'block';
//     document.getElementById('wheel').style.animation='none'
//     document.getElementById('wheel').style.display='none'
//     document.getElementById('loading').style.display='none'
// })
// }

function toggleHeart(postId) {
    const src = 'like-img' + postId
    const img = document.getElementById(src);
    if (!localStorage.token) {
        console.error("You are not logged in")
    }
    else if (img.src.endsWith('blankheart.png')) {
        if (unLikedList.includes(postId)) {
            unLikedList.filter(item => item != postId)
        }
        else { likedList.push(postId) }

        let likeNum = document.getElementById(`likeCount${postId}`)
        likeNum.innerHTML = parseInt(likeNum.innerHTML) + 1
        img.src = '../../static/images/filledheart.png'; // Change to filled heart image

    } else {
        if (likedList.includes(postId)) {
            likedList.filter(item => item != postId)
        }
        else { unLikedList.push(postId) }

        let likeNum = document.getElementById(`likeCount${postId}`)
        likeNum.innerHTML = parseInt(likeNum.innerHTML) - 1
        img.src = '../../static/images/blankheart.png'; // Change to empty heart image

    }

}

window.addEventListener('beforeunload', () => {
    setTimeout(() => {
        unLikedList.forEach(element => {
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
        likedList.forEach(element => {
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
                    window.location.href = "/users-heros"
                    }})
        }
    }, 300);
}