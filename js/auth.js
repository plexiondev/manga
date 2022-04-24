// authorise with mangadex


// parse login form
function parse_form() {
    create_auth(0,document.getElementById('email'),document.getElementById('password'));
    log('general',`Accepted input`);
}

// get params
const auth_query = window.location.search;
const auth_url = new URLSearchParams(auth_query);
// email
const auth_email = auth_url.get('email') || undefined;
// password
const auth_password = auth_url.get('password') || undefined;

// if values inputted
if (auth_email != undefined && auth_password != undefined) {
    create_auth(0,"",auth_email,auth_password);
}

// create auth post
function create_auth(accept,username,email,password) {
    log('general',`Creating auth..`);
    // accepts an auth type of:
    // - password & email [0]
    // - password & username [1]
    // - password & username & email [2]
    // [accept]


    // define XHR POST
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/auth/login`;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {

        // send off
        parse_auth(this.response);
    }

    if (accept == 1) {
        // - password & username [1]
        xhr.send(JSON.stringify({
            username: username,
            password: password
        }));
    } else if (accept == 2) {
        // - password & username & email [2]
        xhr.send(JSON.stringify({
            username: username,
            email: email,
            password: password
        }));
    } else {
        // - password & email [0]
        xhr.send(JSON.stringify({
            email: email,
            password: password
        }));
    }
}



// parse auth
function parse_auth(response) {
    log('general',`Done! Parsing auth..`);
    const data = JSON.parse(response);

    // save token to storage
    localStorage.setItem('token',data.token.session);
    localStorage.setItem('token_refresh',data.token.refresh);


    // refresh token (and redirect)
    refresh_auth(true);
}