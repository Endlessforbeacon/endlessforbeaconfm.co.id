let xhr = new XMLHttpRequest();
xhr.open("GET","https://jsonplaceholder.typicode.com/todos/1")
xhr.send();

xhr.onload = ()=>{
    if(xhr.status == 200){
        console.log(xhr.response)
    } else{
        console.log(`error ${xhr.status}`)
    }
}
xhr.onerror = ()=>{
    console.log(xhr);
}
