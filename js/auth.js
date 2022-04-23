// authorise with mangadex


// create auth post
function create_auth(accept,username,password,email) {
    // accepts an auth type of:
    // - password & email
    // - password & username
    // - password & username & email


    // define XHR POST
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/auth/login`;
    xhr.open('POST', url, true);

    xhr.onload = function() {

        // send off
        parse_auth(this.response);
    }

    xhr.send({
        username: username,
        email: email,
        password: password
    })
}



// parse auth
function parse_auth(response) {
    const data = JSON.parse(response);

    console.log(response,data);
    console.log('worked?');
}