var loginArray = [];
var currentUser = [];

function loginUser() {
    var userData = {
        email: document.getElementById('email').value,
        psw: document.getElementById('psw').value,
    }

    console.log("user ", userData);

    axios.get('http://localhost:3000/UserData')
        .then(resp => {
            data = resp.data;
            data.forEach(e => {
                loginArray.push(e);
            });
        })
        .catch(error => {
            console.log(error);
        });

    console.log(loginArray);

    setTimeout(() => {

        let value = loginArray.find((element) =>
            userData.email == element.email && userData.psw == element.psw);

        if (value != null) {
            console.log("if condition true");
            currentUser.push(value);
            localStorage.setItem("logindata", JSON.stringify(value));
            window.location = "home.html"
        }
        else {
            alert("No user found! Please Regsiter First");
        }
    }, 500);

    resetForm();
}

function resetForm() {
    document.getElementById('email').value = "";
    document.getElementById('psw').value = "";
}