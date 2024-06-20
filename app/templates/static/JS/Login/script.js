console.log("hello world")

document.getElementById('loginForm').addEventListener('submit',function(event){
    console.log("hello world")
    event.preventDefault()
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    // const credentials = {
    //     'username' : email,
    //     'password' : password
    // }

    const formData = new FormData();
    formData.append("username",email);
    formData.append("password",password);

    fetch('/api/token',{
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    });
});