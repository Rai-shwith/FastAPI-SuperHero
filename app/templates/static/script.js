const btn = document.getElementById("btn");

btn.addEventListener("click",async () =>{
    try{
        const response = await fetch("/posts");
        const data = await response.json();
        console.log(data);
    }catch (error){
        console.error(error)
    }
});