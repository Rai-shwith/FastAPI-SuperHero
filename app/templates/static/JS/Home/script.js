document.body.style.backgroundColor="rgba(126, 166, 212, 0.78)";
const likedList = []
const unLikedList = []
if (!localStorage.token) {
    var dummyToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5ODM4OTc0MTgzNjcxMzk4NDEsImV4cCI6MTcyMTE5NjA4Mn0.Q8si-ntjlU6QiMw0Iks0fGv6wTf0C6KUd9eL2Mn6DME"
    localStorage.setItem('token', dummyToken)
}
fetch("/posts/api", {
    method: "GET",
    headers: {
        'Authorization': `Bearer ${localStorage.token}`
    }
}).then(response => {
    if (!response.ok) {
        console.error(response.statusText)
    }
    return response.json()
}).then(data => {
    topStr = `<div style="display: none;" id="center">You are not logged in</div>
    <div id="page-body">
        <div class="herotxt">Super Heros</div>
        `
    boxStr = ""
    if (data.length) {
        for (let hero_index = 0; hero_index < data.length; hero_index++) {
            if (data[hero_index]["is_liked"]) {
                heartSrc = "/static/images/filledheart.png"
            }
            else {
                heartSrc = "/static/images/blankheart.png"
            }

            boxStr += `<div class="upper-box">
            <div class="box">
                <h1>${data[hero_index]["Post"]["alias"]}</h1>
                <h3>${data[hero_index]["Post"]["name"]}</h3>
                <div class="created-box">
                    <div class="crtby">Created by : </div>
                    <div class="email-txt">${data[hero_index]["Post"]["owner"]["user_name"]}</div>
                </div>
                <a href="/posts/${data[hero_index]["Post"]["id"]}">
                    <div class="more-info">More info</div>
                </a>

            </div>
            <div id="like-box" onclick="toggleHeart(${hero_index},'${data[hero_index]["Post"]["id"]}')">
                <div id="like">
                    <img draggable="false" id="like-img${hero_index}" style="position: absolute;" src=${heartSrc} alt=""
                        srcset="">
                    <span id="likeCount${hero_index}" style="position: absolute; z-index: 1;">${data[hero_index]["likes"]}</span>
                </div>
            
            </div>
        </div>`
        }
    }
    else {
        boxStr += `<div class="upper-box">
            <div class="box">
                <h1>No Hero</h1>
            </div>
        </div>`
    }
    if(data.length<3){
        document.getElementsByTagName('nav')[0].style.position='absolute';
    }
    document.getElementById('placeholder').innerHTML = topStr + boxStr;
    document.getElementsByTagName('nav')[0].style.display = 'block';
    document.getElementById('wheel').style.animation='none'
    document.getElementById('wheel').style.display='none'
    document.getElementById('loading').style.display='none'
})





// document.getElementById('myHeros').addEventListener('click', ev => {
//     fetch('/users/id', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${localStorage.token}`
//         }
//     }).then(response => {
//         if (!response.ok) {
//             if (response.status == 401) {
//                
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

function toggleHeart(id, postId) {
    const src = 'like-img' + id
    const img = document.getElementById(src);
    if (localStorage.token && localStorage.token == dummyToken) {
    
        console.error("You are not logged in")
    }
    else if (img.src.endsWith('blankheart.png')) {
        if (unLikedList.includes(postId)) {
            unLikedList.filter(item => item != postId)
        }
        else { likedList.push(postId) }

        likeNum = document.getElementById(`likeCount${id}`)
        likeNum.innerHTML = parseInt(likeNum.innerHTML) + 1
        img.src = '../static/images/filledheart.png'; // Change to filled heart image

    } else {
        if (likedList.includes(postId)) {
            likedList.filter(item => item != postId)
        }
        else { unLikedList.push(postId) }

        likeNum = document.getElementById(`likeCount${id}`)
        likeNum.innerHTML = parseInt(likeNum.innerHTML) - 1
        img.src = '../static/images/blankheart.png'; // Change to empty heart image

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


