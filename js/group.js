// view group page


const socials = {
    0: 'contactEmail',
    1: 'discord',
    2: 'ircChannel',
    3: 'ircServer',
    4: 'mangaUpdates',
    5: 'twitter',
    6: 'website'
}
const socials_string = {
    'contactEmail': 'Email',
    'discord': 'Discord',
    'ircChannel': 'IRC',
    'ircServer': 'IRC server',
    'mangaUpdates': 'MangaUpdates',
    'twitter': 'Twitter',
    'website': 'Website'
}

// tags
const tags_icon = {
    'safe': 'check',
    'suggestive': 'alert-circle',
    'erotica': 'alert-circle',
    'pornographic': 'alert-octagon'
}

let group_leader;
let group_member_count = 0;
let group_leader_count = 0;

// pass author id from url
const search = window.location.search;
const query = new URLSearchParams(search);
let group = query.get('u') || "";
if (group == "") {
    // no group supplied
    prompt_no_group();
} else {
    // get group
    get_group();
    // get group's works/feed
    get_works();
}


function get_group() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/group/${group}?includes[]=member&includes[]=leader`;
    log('search',`Searching for ${group} group..`,true);
    xhr.open('GET',url,true);


    // request is received
    xhr.onload = function() {
        log('general',`Found ${group} group!`,true);

        try {
            get_general(JSON.parse(this.response));
            get_members(JSON.parse(this.response));
        } catch(error) {
            log('error',`${error}`,true);
            get_error();
        }
    }

    // send
    xhr.send();
}

function get_general(data) {

    log('search',`Retrieving general attributes..`,true);

    // name
    document.getElementById('attr.name').textContent = data.data.attributes.name;
    // page title
    document.getElementById('page.title').textContent = `${data.data.attributes.name}'s Group Profile`;

    // description
    // ran through showdown to convert markdown
    var converter = new showdown.Converter();
    text = `${data.data.attributes.description}`;
    if (text == 'null') { text = '' }
    html = converter.makeHtml(text);
    // append
    document.getElementById('attr.body').innerHTML = `${html}`;

    // focused language
    if (data.data.attributes.focusedLanguages.length > 0) {
        let focused_language;
        for (let i in data.data.attributes.focusedLanguages) {
            if (i == 0) { focused_language = data.data.attributes.focusedLanguages[i] }
        }

        let focused_language_full = new Intl.DisplayNames(['en'],{type: 'language'});

        document.getElementById('attr.focus_language').innerHTML = (`
        <i class="flag twf twf-${focused_language}"></i> <strong>${focused_language_full.of(`${focused_language}`)}</strong>
        `);
    }

    // actions
    // open in mangadex
    document.getElementById('action.mangadex').href = `https://mangadex.org/group/${group}`;

    // socials
    get_socials(data);
}

// parse socials
function get_socials(data) {
    for (let i in socials) {
        if (socials[i] in data.data.attributes && data.data.attributes[socials[i]] != null) {
            create_social(socials[i],data.data.attributes[socials[i]],data);
        }
    }
}

// create social
function create_social(platform,link,data) {
    let em_tag = document.createElement('a');
    em_tag.classList.add('tag','social',`${platform}`);
    if (platform == 'ircChannel') {
        em_tag.href = `irc://${data.data.attributes.ircServer}/${data.data.attributes.ircChannel.replace('#','')}`;
        em_tag.innerHTML = (`
        <i class="icon w-20" icon-name="hash"></i>
        IRC: ${data.data.attributes.ircServer} ${data.data.attributes.ircChannel}
        `);
    } else if (platform == 'website') {
        em_tag.href = `${link}`;
        em_tag.innerHTML = (`
        <i class="icon w-20" icon-name="globe"></i>
        ${socials_string[platform]}
        `);
    } else{
        em_tag.href = `${link}`;
        em_tag.innerHTML = (`
        <img src="https://unpkg.com/simple-icons@v6/icons/${platform}.svg">
        ${socials_string[platform]}
        `);
    }

    // append
    if (platform != 'ircServer') {
        document.getElementById('attr.socials').appendChild(em_tag);
        lucide.createIcons();
    }
}

function get_members(data) {
    for (let i in data.data.relationships) {
        // create element
        let card = document.createElement('a');
        card.classList.add('manga-card');
        card.href = `/user.html?u=${data.data.relationships[i].id}`;

        if (data.data.relationships[i].type == 'leader') {
            // is group leader
            group_leader = data.data.relationships[i].id;
            card.classList.add('leader');

            card.innerHTML = (`
            <div class="cover" style="height: initial;">
            <i class="icon w-24" icon-name="crown"></i>
            </div>
            <div class="info" style="display: flex; align-items: center;">
            <h5>${data.data.relationships[i].attributes.username}</h5>
            </div>
            `);

            // append
            document.getElementById('feed.leaders').appendChild(card);
            group_leader_count += 1;
        } else if (data.data.relationships[i].id == group_leader) {
            // is group leader (but as a member)
            // (ignore)
        } else {
            card.innerHTML = (`
            <div class="cover" style="height: initial;">
            <i class="icon w-24" icon-name="user"></i>
            </div>
            <div class="info" style="display: flex; align-items: center;">
            <h5>${data.data.relationships[i].attributes.username}</h5>
            </div>
            `);
            
            // append
            document.getElementById('feed.members').appendChild(card);
            group_member_count += 1;
        }

        // append
        if (data.data.relationships[i].type == 'leader') {
            // is group leader
            group_leader = data.data.relationships[i].id;
            card.classList.add('leader');
            document.getElementById('feed.leaders').appendChild(card);
        } else if (data.data.relationships[i].id == group_leader) {
            // is group leader (but as a member)
            // (ignore)
        } else {
            document.getElementById('feed.members').appendChild(card);
        }

        lucide.createIcons();
    }

    // show member count
    document.getElementById('attr.member_count').innerHTML = (`${group_member_count}`);
    document.getElementById('attr.leader_count').innerHTML = (`${group_leader_count}`);
}

// get works
function get_works() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga?limit=32&includes[]=cover_art&contentRating[]=safe${rating_suggestive}${rating_explicit}${rating_nsfw}&group=${group}`;
    xhr.open('GET',url,true);

    xhr.onload = function() {
        const data = JSON.parse(this.response);
        document.getElementById('feed.works').innerHTML = ``;

        for (let i in data.data) {
            generate_card(data.data[i],data.data[i].id,'feed.works',true,i);
        }
    }

    // send
    xhr.send();
}

function get_relationships(data_pass,manga_pass,i) {

    log('search',`Retrieving relationships..`,true);

    // parse
    const data_raw = data_pass;
    const data = JSON.parse(data_pass);
    var manga = manga_pass;

    // relationships
    let relationships = data.data[i].relationships;
    for (let n in relationships) {
        if (relationships[n].type == "cover_art") {
            // cover art

            // create url
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${relationships[n].attributes.fileName}`;
            if (i == 0) document.getElementById('img.background').style = `background-image: url(${cover_url});`;

            create_em(data_raw,cover_url,manga,i);
        }
    }
}

function create_em(data_pass,cover_url_pass,manga_pass,i) {

    const data = JSON.parse(data_pass);
    var cover_art_url = cover_url_pass;
    var manga = manga_pass;

    // create element
    let card = document.createElement('a');
    card.classList.add('manga-card');

    // links
    card.href = `view.html?m=${manga}`;

    // content rating
    try {
        var rating = contentrating_string[data.data[i].attributes.contentRating];
    } catch(error) {
        var rating = `${data.data[i].attributes.contentRating}`;
    }

    // html
    log('general',`Created ${i}!`,true);
    card.innerHTML = (`
    <div class="cover">
    <span class="cover-inner">
    <img src="${cover_art_url}" id="${manga}_cover" alt="Cover art">
    </span>
    </div>
    `);

    // description
    var converter = new showdown.Converter();
    text = `${data.data[i].attributes.description.en}`;
    if (text == 'undefined') { text = '' }
    html = converter.makeHtml(text);

    // info
    let em_info = document.createElement('div');
    em_info.classList.add('info');
    em_info.innerHTML = (`
    <h4 class="text-20">${data.data[i].attributes.title.en}</h4>
    <div class="desc-cont text-16">${html}</div>
    <label class="tag ${data.data[i].attributes.contentRating}" style="margin-left: 0;"><i class="icon w-16" icon-name="${tags_icon[`${data.data[i].attributes.contentRating}`]}" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}</label>
    `);

    // tags
    let tags = data.data[i].attributes.tags;
    for (let i in tags) {
        if (i < 2) {
            // create element
            let tag = document.createElement('label');
            tag.classList.add('tag',`${(tags[i].attributes.name.en).replaceAll(' ','_')}`);

            // text
            tag.textContent = `${tags[i].attributes.name.en}`;

            // append
            em_info.appendChild(tag);
        }
    }

    // append
    card.appendChild(em_info);
    if ((data.data[i].attributes.contentRating == 'suggestive' && localStorage.getItem('op_show_suggestive') == 1) || (data.data[i].attributes.contentRating == 'erotica' && localStorage.getItem('op_show_erotica') == 1) || (data.data[i].attributes.contentRating == 'pornographic' && localStorage.getItem('op_show_nsfw') == 1) || (data.data[i].attributes.contentRating == 'safe')) {
        document.getElementById('feed.works').appendChild(card);
    }

    lucide.createIcons();
}

// expand truncated body
function expand_trunc_body() {
    document.getElementById('attr.trunc_body').classList.toggle('expand');
}

// on error (404)
function get_error() {
    document.getElementById('overview').innerHTML = (`
    <div class="empty-results" style="display: flex;">
        <span>
        <h3>Group not found</h3>
        <p>The requested group was not found on MangaDex.</p>
        <br>
        <br>
        <label class="over">404</label>
        </span>
    </div>
    `);
}

// missing required ?u=groupid
function prompt_no_group() {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','error_window');

    em_window.innerHTML = (`
    <div class="cover"><img src="/img/fufufu.png"></div>
    <div class="header" style="text-align: center;"><h4>Uh oh.</h4></div>
        <div class="info" style="text-align: center;">
        <p>The requested group was not found.<br>Please supply a group using <code>?u=groupid</code> in the URL.</p>
        </div>
        <div class="actions">
        <a role="button" class="button" onclick="history.back()">Go back</a>
        <a role="button" class="button focus" href="/groups.html">Browse Groups</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    lucide.createIcons();
}