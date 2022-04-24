// check current auth
// - runs on every reload, checking if token is still valid
// - will refresh token if not


let token_cache;
let now;

// run every 3 seconds
check_auth();
window.setInterval(check_auth,3000);

// check auth
function check_auth() {
    token_cache = localStorage.getItem('token_cache') || "";
    now = new Date();
    
    // if over 14m (1m below for safety)
    if (Date.parse(now) >= Date.parse(token_cache) || token_cache == "") {
        refresh_auth(false);
    } else {
        console.log('Auth still valid');
    }
}


// refresh token with mangadex
function refresh_auth(redirect) {
    log('general',`Refreshing auth!`);
    // redirect: if after completion, user redirected to /?logged_in=1

    // define XHR POST
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/auth/refresh`;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {

        const data = JSON.parse(this.response);

        // save token to storage
        localStorage.setItem('token',data.token.session);
        localStorage.setItem('token_refresh',data.token.refresh);

        // swap url
        if (redirect == true) { window.location.href = '/?logged_in=1'; };
    }

    xhr.send(JSON.stringify({
        token: localStorage.getItem('token_refresh')
    }));

    // reset auth cache
    now = new Date(now);
    now.setMinutes(now.getMinutes() + 14);
    log('general',`Authorised again until ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} (14 min)`);
    localStorage.setItem('token_cache', now);
}