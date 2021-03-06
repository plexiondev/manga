// check current auth
// - runs on every reload, checking if token is still valid
// - will refresh token if not


let token_cache;
let auth_now;

let authorised = 0;

// run every 3 seconds
if (!window.location.href.includes('/auth.html')) {
    check_auth();
    window.setInterval(check_auth,3000);
}

// check auth
function check_auth() {
    token_cache = localStorage.getItem('token_cache') || "";
    auth_now = new Date();
    
    // if over 14m (1m below for safety)
    if (Date.parse(auth_now) >= Date.parse(token_cache) || token_cache == "") {
        refresh_auth(false);
        authorised = 0;
    } else {
        log('auth',`Auth still valid!`,true);
        authorised = 1;
    }
}


// refresh token with mangadex
function refresh_auth(redirect) {
    log('auth',`Refreshing auth!`,true);
    // redirect: if after completion, user redirected to /?logged_in=1

    // define XHR POST
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/auth/refresh`;
    xhr.open('POST',url,true);
    xhr.setRequestHeader('Content-Type','application/json');

    xhr.onload = function() {
        if (xhr.status == 400 && !window.location.href.includes('/auth.html')) {
            // un-authorised

            window.location.href = `/auth.html`;
        } else if (xhr.status == 429) {
            // exceeded rate-limit

            window.location.href = '/auth-end.html?code=429';
        } else {
            // authorised

            const data = JSON.parse(this.response);

            // save token to storage
            localStorage.setItem('token',data.token.session);
            localStorage.setItem('token_refresh',data.token.refresh);

            get_info(redirect);

            // reset auth cache
            auth_now = new Date(auth_now);
            auth_now.setMinutes(auth_now.getMinutes() + 14);
            log('auth',`Authorised again until ${auth_now.getHours()}:${auth_now.getMinutes()}:${auth_now.getSeconds()} (14 min)`,true);
            localStorage.setItem('token_cache', auth_now);
        }
    }

    xhr.send(JSON.stringify({
        token: localStorage.getItem('token_refresh')
    }));
}


// get user info
function get_info(redirect = false) {
    // define XHR GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/user/me`;
    xhr.open('GET',url,true);
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    xhr.onload = function() {
        const data = JSON.parse(this.response);

        let user_id = data.data.id;
        let username = data.data.attributes.username;

        // cache info
        localStorage.setItem('token_user_info',`${this.response}`);
        localStorage.setItem('token_user_id',`${user_id}`);
        localStorage.setItem('token_username',`${username}`);

        // swap url
        if (redirect) window.location.href = '/auth-end.html?code=200';
    }

    // send off
    xhr.send();    
}


// embed info
function embed_info(element) {
    document.getElementById(element).innerHTML = `Logged in as <strong>${localStorage.getItem('token_username')}</strong><br><br><a href="/auth.html">Re-authorise</a> <a href="javascript:void(0);" onclick="refresh_auth(false)">Refresh token</a>`;
}