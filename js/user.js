// view user page


const roles_string = {
    'ROLE_MEMBER': 'Member',
    'ROLE_USER': 'User',
    'ROLE_UNVERIFIED': 'Unverified User',
    'ROLE_GROUP_MEMBER': 'Group Member',
    'ROLE_GROUP_LEADER': 'Group Leader',
    'ROLE_ADMIN': 'Admin',
    'ROLE_POWER_UPLOADER': 'Power Uploader'
}

// pass user id from url
const search = window.location.search;
const query = new URLSearchParams(search);
let user = query.get('u') || "";
if (user == "") {
    // no user supplied
    prompt_no_user();
} else {
    // get user
    get_user();
}


function get_user() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/user/${user}`;
    log('search',`Searching for ${user} user..`,true);
    xhr.open('GET',url,true);


    // request is received
    xhr.onload = function() {
        log('general',`Found ${user} user!`,true);

        data_parse = JSON.parse(this.response);

        try {
            get_general(this.response);
        } catch(error) {
            log('error',`${error}`,true);
            get_error();
        }
    }

    // send
    xhr.send();
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
    document.getElementById('action.mangadex').href = `https://mangadex.org/user/${user}`;

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

    // is current user?
    if (data.data.id == localStorage.getItem('token_user_id')) {
        let UserAuthPanel = document.createElement('section');
        UserAuthPanel.classList.add('left','header','no-sep','no-align');
        UserAuthPanel.setAttribute('id','auth');

        UserAuthPanel.innerHTML = (`
        <h4>Your account</h4>
        <p>Control your current session.</p>
        <a role="button" class="button focus left" href="/auth.html">Sign out</a>
        <a role="button" class="button" href="javascript:void(0)" onclick="refresh_auth(false)">Refresh token</a>
        `);

        document.getElementById('main').appendChild(UserAuthPanel);
    }

    get_relationships(data_pass);
}

function get_relationships(data_pass) {
    // get group IDs
    const group_ids = [];
    const data_groups = JSON.parse(data_pass);
    for (let i in data_groups.data.relationships) {
        group_ids.push(data_groups.data.relationships[i].id); // add to group ID array
    }

    // only continue if in more than 1 group
    if (group_ids.length > 0) {
        // create request
        let group_query = '';
        for (let i in group_ids) {
            group_query = `${group_query}&ids[]=${group_ids[i]}`; // append each group ID to query
        }


        // define xhr GET
        const xhr = new XMLHttpRequest();
        const url = `https://api.mangadex.org/group?limit=12${group_query}`;
        xhr.open('GET',url,true);


        // request is received
        xhr.onload = function() {
            const data = JSON.parse(this.response);
            console.log(data);

            // create "Groups" panel
            let RelationshipsPanel = document.createElement('section');
            RelationshipsPanel.classList.add('left','header','no-sep','no-align');
            RelationshipsPanel.setAttribute('id','groups');

            RelationshipsPanel.innerHTML = (`
            <h4>Groups</h4>
            <br>
            <br>
            <div class="cards users" id="feed.groups" style="padding: 20px 0;"></div>
            `);

            document.getElementById('main').appendChild(RelationshipsPanel);

            // filter through groups
            for (let i in data.data) {
                create_group_em(this.response,i);
            }
        }

        // send
        xhr.send();
    }
}

function create_group_em(data_pass,i) {

    const data = JSON.parse(data_pass);

    // create element
    let card = document.createElement('a');
    card.classList.add('manga-card');

    // links
    card.href = `/group.html?u=${data.data[i].id}`;

    // description
    var converter = new showdown.Converter();
    text = `${data.data[i].attributes.description}`;
    if (text == 'null') { text = '' }
    html = converter.makeHtml(text);
    
    // html
    log('general',`Created ${i}!`,true);
    card.innerHTML = (`
    <div class="cover" style="height: initial;">
    <i class="icon w-24" icon-name="users"></i>
    </div>
    <div class="info" style="display: flex; align-items: center;">
    <h5>${data.data[i].attributes.name}</h5>
    </div>
    `);

    // append
    document.getElementById('feed.groups').appendChild(card);

    lucide.createIcons();
}

// on error (404)
function get_error() {
    document.getElementById('overview').innerHTML = (`
    <div class="empty-results" style="display: flex;">
        <span>
        <h3>User not found</h3>
        <p>The requested user was not found on MangaDex.</p>
        <br>
        <br>
        <label class="over">404</label>
        </span>
    </div>
    `);
}

// missing required ?u=userid
function prompt_no_user() {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','error_window');

    em_window.innerHTML = (`
    <div class="cover"><img src="/img/fufufu.png"></div>
    <div class="header" style="text-align: center;"><h4>Uh oh.</h4></div>
        <div class="info" style="text-align: center;">
        <p>The requested user was not found.<br>Please supply a user using <code>?u=userid</code> in the URL.</p>
        </div>
        <div class="actions">
        <a role="button" class="button" onclick="history.back()">Go back</a>
        <a role="button" class="button focus" href="/users.html">Browse Users</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    lucide.createIcons();
}