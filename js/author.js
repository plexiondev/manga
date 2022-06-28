// view author page


const socials = {
    0: 'booth',
    1: 'fanBox',
    2: 'fantia',
    3: 'melonBook',
    4: 'naver',
    5: 'nicoVideo',
    6: 'pixiv',
    7: 'skeb',
    8: 'tumblr',
    9: 'twitter',
    10: 'website',
    11: 'weibo',
    12: 'youtube'
}
const socials_string = {
    'booth': 'Booth',
    'fanBox': 'Fanbox',
    'fantia': 'Fantia',
    'melonBook': 'Melonbooks',
    'naver': 'NAVER',
    'nicoVideo': 'Niconico',
    'pixiv': 'pixiv',
    'skeb': 'Skeb',
    'tumblr': 'Tumblr',
    'twitter': 'Twitter',
    'website': 'Website',
    'weibo': 'Weibo',
    'youtube': 'YouTube'
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
let author = query.get('u') || "";
if (author == "") {
    // no author supplied
    prompt_no_author();
} else {
    // get author
    get_author();
    // get author's works
    get_works();
}

// cache
let cached_out = localStorage.getItem(`${author}_view_timeout`) || "";
let cache = localStorage.getItem(`${author}_view`) || "";
let now = new Date();


// checks
function get_author() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/author/${author}`;
    log('search',`Searching for ${author} author..`,true);
    xhr.open('GET',url,true);


    // request is received
    xhr.onload = function() {
        log('general',`Found ${author} author!`,true);

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

    // name
    document.getElementById('attr.name').textContent = data.data.attributes.name;
    // page title
    document.getElementById('page.title').textContent = `${data.data.attributes.name}'s Author Profile`;

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
    document.getElementById('action.mangadex').href = `https://mangadex.org/author/${author}`;

    // socials
    get_socials(data_pass);
}

// parse socials
function get_socials(data_pass) {
    const data = JSON.parse(data_pass);

    for (let i in socials) {
        if (socials[i] in data.data.attributes && data.data.attributes[socials[i]] != null) {
            create_social(socials[i],data.data.attributes[socials[i]]);
        }
    }
}

// create social
function create_social(platform,link) {
    let em_tag = document.createElement('a');
    em_tag.classList.add('tag','social',`${platform}`);
    em_tag.href = `${link}`;
    if (platform != 'website') {
        em_tag.innerHTML = (`
        <img src="https://unpkg.com/simple-icons@v6/icons/${platform}.svg">
        ${socials_string[platform]}
        `);
    } else {
        em_tag.innerHTML = (`
        <i class="icon w-20" icon-name="globe"></i>
        ${socials_string[platform]}
        `);
    }

    // append
    document.getElementById('attr.socials').appendChild(em_tag);
    lucide.createIcons();
}

// get works
function get_works() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga?limit=32&includes[]=cover_art&contentRating[]=safe${rating_suggestive}${rating_explicit}${rating_nsfw}&authors[]=${author}&artists[]=${author}`;
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

// on error (404)
function get_error() {
    document.getElementById('overview').innerHTML = (`
    <div class="empty-results" style="display: flex;">
        <span>
        <h3>Author not found</h3>
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
    lucide.createIcons();
}