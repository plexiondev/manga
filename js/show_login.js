// show login (in settings)


// initial call (to get user id)

// define XHR GET
const sl_xhr = new XMLHttpRequest();
const sl_url = `https://api.mangadex.org/user/me`;
sl_xhr.open('GET', sl_url, true);
sl_xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);

sl_xhr.onload = function() {
    const data = JSON.parse(this.response);

    let user_id = data.data.id;
    let username = data.data.attributes.username;

    // pass into settings
    document.getElementById('login_info_temp').innerHTML = `Logged in as <strong>${username}</strong><br><br><a href="/auth.html">Re-authorise</a>`;
    // remove temp text
    //document.getElementById('login_info_temp').remove;

    // cache info
    localStorage.setItem('token_user_id',`${user_id}`);
    localStorage.setItem('token_username',`${username}`);
}

// send off
sl_xhr.send();