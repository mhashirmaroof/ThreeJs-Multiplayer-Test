var userArray = [];
function registeruser() {
    var userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        psw: document.getElementById('psw').value,
    }

    userArray.push(userData)
    console.log(userArray);
    
    axios.post('http://localhost:3000/UserData', {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        psw: document.getElementById('psw').value,
    })

    resetForm();
}

function resetForm() {
    document.getElementById('username').value = "";
    document.getElementById('email').value = "";
    document.getElementById('psw').value = "";
}