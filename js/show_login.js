// show login (in settings)


// initial call (to get user id)

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
    localStorage.setItem('token_user_id',`${user_id}`);
    localStorage.setItem('token_username',`${username}`);
}

// send off
xhr.send();