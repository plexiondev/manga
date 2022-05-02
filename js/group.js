// view group page


const contentrating_string = {
    'safe': 'Safe',
    'suggestive': 'Suggestive',
    'erotica': 'Erotica',
    'pornographic': 'NSFW'
}

// tags
const tags_icon = {
    'safe': 'check',
    'suggestive': 'alert-circle',
    'erotica': 'alert-circle',
    'pornographic': 'alert-octagon'
}

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
    const url = `https://api.mangadex.org/group/${group}`;
    log('search',`Searching for ${group} group..`,true);
    xhr.open('GET',url,true);


    // request is received
    xhr.onload = function() {
        log('general',`Found ${group} group!`,true);

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

    // name
    document.getElementById('attr.name').textContent = data.data.attributes.name;
    // page title
    document.getElementById('page.title').textContent = `${data.data.attributes.name}'s Group Profile`;

    // biography
    // ran through showdown to convert markdown
    if (data.data.attributes.biography.en != undefined) {
        var converter = new showdown.Converter();
        text = `${data.data.attributes.biography.en}`;
        html = converter.makeHtml(text);
        // append
        document.getElementById('attr.body').innerHTML = `${html}`;
    }

    // actions
    // open in mangadex
    document.getElementById('action.mangadex').href = `https://mangadex.org/group/${group}`;

    // socials
    get_socials(data_pass);
}

// get works
function get_works() {
    // get content rating
    let rating_suggestive = "";
    if (localStorage.getItem('op_show_suggestive') == 1) {
        rating_suggestive = '&contentRating[]=suggestive';
    }
    let rating_explicit = "";
    if (localStorage.getItem('op_show_explicit') == 1) {
        rating_explicit = '&contentRating[]=explicit';
    }
    let rating_nsfw = "";
    if (localStorage.getItem('op_show_nsfw') == 1) {
        rating_nsfw = '&contentRating[]=pornographic';
    }

    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga?limit=32&includes[]=cover_art&contentRating[]=safe${rating_suggestive}${rating_explicit}${rating_nsfw}&group=${group}`;
    xhr.open('GET',url,true);

    xhr.onload = function() {
        const data = JSON.parse(this.response);
        document.getElementById('feed.works').innerHTML = ``;

        for (let i in data.data) {
            // get manga id
            var manga = data.data[i].id;

            get_relationships(this.response,manga,i);
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
    <label class="tag ${data.data[i].attributes.contentRating}" style="margin-left: 0;"><i class="icon w-16" data-feather="${tags_icon[`${data.data[i].attributes.contentRating}`]}" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}</label>
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

    feather.replace();
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