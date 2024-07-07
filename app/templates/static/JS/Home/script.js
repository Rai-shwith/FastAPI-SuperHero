if (!localStorage.token){
    localStorage.setItem('token',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5ODM4OTc0MTgzNjcxMzk4NDEsImV4cCI6MTcyMTE5NjA4Mn0.Q8si-ntjlU6QiMw0Iks0fGv6wTf0C6KUd9eL2Mn6DME")
}
fetch("api",{
    method: "GET",
    headers: {
        'Authorization': `Bearer ${localStorage.token}`
    }
}).then(response=>{
    if (!response.ok){
        console.error(response.statusText)
    }
    return response.json()
}).then(data =>{
    topStr=`<div style="display: none;" id="center">You are not logged in</div>
    <div id="page-body">
        <div class="herotxt">Super Heros</div>
        `
    boxStr=""
    if (data.length){
    for (let hero_index=0;hero_index<data.length;hero_index++) {
        boxStr+=`<div class="upper-box">
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
            <div id="like-box" onclick="toggleHeart(${hero_index})">
                <div id="like">
                    <img id="like-img${hero_index}" style="position: absolute;" src="/static/images/blankheart.png" alt=""
                        srcset="">
                    <span style="position: absolute; z-index: 1;">${data[hero_index]["likes"]}</span>
                </div>
            
            </div>
        </div>`
    }}
    else{
        boxStr+=`<div class="upper-box">
            <div class="box">
                <h1>No Hero</h1>
            </div>
        </div>`
    }
    document.getElementById('placeholder').innerHTML=topStr+boxStr;
    document.getElementsByTagName('nav')[0].style.display='block';
})





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


