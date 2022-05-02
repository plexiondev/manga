// view author page


// pass author id from url
const search = window.location.search;
const query = new URLSearchParams(search);
let author = query.get('u') || "";
if (author == "") {
    // no author supplied
    prompt_no_author();
}

// cache
let cached_out = localStorage.getItem(`${author}_view_timeout`) || "";
let cache = localStorage.getItem(`${author}_view`) || "";
let now = new Date();


// checks
if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "") {
    
    // if exceeded cache
    
    // do everything
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/author/${author}`;
    log('search',`Searching for ${author} author..`,true);
    xhr.open('GET',url,true);


    // request is received
    xhr.onload = function() {
        log('general',`Found ${author} author!`,true);

        // parse
        localStorage.setItem(`${user}_view`,this.response);

        data_parse = JSON.parse(this.response);

        try {
            get_general(this.response);
        } catch(error) {
            log('error',`${error}`,true);
            get_error();
        }

        // then cache
        now = new Date(now);
        now.setMinutes(now.getMinutes() + 30);
        log('general',`Cached until ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} (30 min)`,true);
        localStorage.setItem(`${author}_view_timeout`,now);
    }


    // send
    xhr.send();
} else {
    log('general',`Using cached info until ${new Date(cached_out).getHours()}:${new Date(cached_out).getMinutes()}:${new Date(cached_out).getSeconds()}`,true);
    const data = JSON.parse(localStorage.getItem(`${author}_view`));

    try {
        get_general(localStorage.getItem(`${author}_view`));
    } catch(error) {
        log('error',`${error}`,true);
        get_error();
    }

}

function get_general(data_pass) {

    log('search',`Retrieving general attributes..`,true);

    // parse
    const data = JSON.parse(data_pass);
    console.log(data)

    // username
    document.getElementById('attr.username').textContent = data.data.attributes.username;
    // page title
    document.getElementById('page.title').textContent = `${data.data.attributes.username}'s Profile`;

    // actions
    // open in mangadex
    document.getElementById('action.mangadex').href = `https://mangadex.org/author/${author}`;

    // info blocks
    document.getElementById('attr.user_id').innerHTML = (`${data.data.id}`);

    // tags
    let roles = data.data.attributes.roles;
    for (let i in roles) {
        // create element
        let tag = document.createElement('label');
        tag.classList.add('tag',`${(roles[i]).replaceAll(' ','_')}`);

        // text
        tag.textContent = `${roles_string[roles[i]]}`;

        // append
        document.getElementById('attr.roles').appendChild(tag);
    }
}

// on error (404)
function get_error() {
    document.getElementById('overview').innerHTML = (`
    <div class="empty-results" style="display: flex;">
        <span>
        <h3>User not found</h3>
        <p>The requested author was not found on MangaDex.</p>
        <br>
        <br>
        <label class="over">404</label>
        </span>
    </div>
    `);
}

// missing required ?u=authorid
function prompt_no_author() {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','error_window');

    em_window.innerHTML = (`
    <div class="cover"><img src="/img/fufufu.png"></div>
    <div class="header" style="text-align: center;"><h4>Uh oh.</h4></div>
        <div class="info" style="text-align: center;">
        <p>The requested author was not found.<br>Please supply a author using <code>?u=authorid</code> in the URL.</p>
        </div>
        <div class="actions">
        <a role="button" class="button focus" onclick="history.back()">Go back</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    feather.replace();
}