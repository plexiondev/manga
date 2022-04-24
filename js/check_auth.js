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

        get_info();

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


// get user info
function get_info() {
    // define XHR GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/user/me`;
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);

    xhr.onload = function() {
        const data = JSON.parse(this.response);

        let user_id = data.data.id;
        let username = data.data.attributes.username;

        // pass into settings
        document.getElementById('login_info_temp').innerHTML = `Logged in as <strong>${username}</strong><br><br><a href="/auth.html">Re-authorise</a>`;
        // remove temp text
        //document.getElementById('login_info_temp').remove;

        // cache info
        localStorage.setItem('token_user_info',`${this.response}`);
        localStorage.setItem('token_user_id',`${user_id}`);
        localStorage.setItem('token_username',`${username}`);
    }

    // send off
    xhr.send();    
}


// embed info
function embed_info(element) {
    element.innerHTML = `Logged in as <strong>${localStorage.getItem('token_username')}</strong><br><br><a href="/auth.html">Re-authorise</a> <a href="javascript:void(0);" onclick="refresh_auth(false)">Refresh token</a>`;
}