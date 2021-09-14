function login(){
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    fetch('/api/v1/login', {
        method: 'POST',
        headers: {
            Authorization: username+";"+session+";"+password
        }
    }).then(data => data.text()).then(data => {
        if(data === "ok"){
            document.getElementById('error').innerHTML =  'Loading...';

            window.location = '/';
        } else if(data === "loginerror"){
            document.getElementById('error').innerHTML =  'Wrong username or password.'
        } else if(data === "sessionerror"){
            document.getElementById('error').innerHTML =  'Session has expired. Please try again.'
        } else if(data === "error"){
            document.getElementById('error').innerHTML =  'Unknown server error.'
        }
    })
}