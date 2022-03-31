var loginArray = [{
    "username": "mhashir",
    "email": "hashir.bhatti@gmail.com",
    "psw": "zz",
    "id": 1
  },
  {
    "username": "saad",
    "email": "saad@saad.com",
    "psw": "x",
    "id": 2
  },
  {
    "username": "asasa",
    "email": "aaaa@aaa.com",
    "psw": "12345r",
    "id": 3
  },
  {
    "username": "M Amir",
    "email": "asdf@ali.com",
    "psw": "22",
    "id": 4
  },
  {
    "username": "Umer",
    "email": "umer@gmail.com",
    "psw": "112233",
    "id": 5
  },
  {
    "username": "hassan",
    "email": "hassan123@gmail.com",
    "psw": "h12h",
    "id": 6
  }];
var currentUser = [];

function loginUser() {
    var userData = {
        email: document.getElementById('email').value,
        psw: document.getElementById('psw').value,
    }

    console.log("user ", userData);

    // axios.get('http://localhost:3000/UserData')
    //     .then(resp => {
    //         data = resp.data;
    //         data.forEach(e => {
    //             loginArray.push(e);
    //         });
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });

    // console.log(JSON.parse(loginArray));

    setTimeout(() => {

        // let value = loginArray.find((element) =>
        //     userData.email == element.email && userData.psw == element.psw);
        
        let value = "yes";

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