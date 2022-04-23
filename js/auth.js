// authorise with mangadex


// parse login form
function parse_form() {
    create_auth(0,document.getElementById('email'),document.getElementById('password'));
}

// create auth post
function create_auth(accept,username,email,password) {
    // accepts an auth type of:
    // - password & email [0]
    // - password & username [1]
    // - password & username & email [2]
    // [accept]


    // define XHR POST
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/auth/login`;
    xhr.open('POST', url, true);

    xhr.onload = function() {

        // send off
        parse_auth(this.response);
    }

    if (accept == 1) {
        // - password & username [1]
        xhr.send({
            username: username,
            password: password
        });
    } else if (accept == 2) {
        // - password & username & email [2]
        xhr.send({
            username: username,
            email: email,
            password: password
        });
    } else {
        // - password & email [0]
        xhr.send({
            email: email,
            password: password
        });
    }
}



// parse auth
function parse_auth(response) {
    const data = JSON.parse(response);

    console.log(response,data);
    console.log('worked?');
}