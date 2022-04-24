// view manga page


const relationships_string = {
    'based_on': 'Original',
    'doujinshi': 'Doujinshi',
    'sequel': 'Sequel',
    'adapted_from': 'Original',
    'side_story': 'Side-story',
    'prequel': 'Prequel',
    'spin_off': 'Spin-off',
    'shared_universe': 'Shared universe'
}

const contentrating_string = {
    'safe': 'Safe',
    'suggestive': 'Suggestive',
    'erotica': 'Erotica',
    'pornographic': 'NSFW'
}

// reading status
const readstatus_string = {
    'reading': 'Reading',
    'on_hold': 'On Hold',
    'plan_to_read': 'Plan To Read',
    'dropped': 'Dropped',
    're_reading': 'Re-reading',
    'completed': 'Completed'
}
const readstatus_icon = {
    'reading': 'book',
    'on_hold': 'pause-circle',
    'plan_to_read': 'clock',
    'dropped': 'stop-circle',
    're_reading': 'book',
    'completed': 'check-circle'
}

// pass manga id from url
const search = window.location.search;
const query = new URLSearchParams(search);
let manga = query.get('m')
// has user read before?
let chapter = localStorage.getItem("chapter") || null;

// cache
let cached_out = localStorage.getItem(`${manga}_view_timeout`) || "";
let cache = localStorage.getItem(`${manga}_view`) || "";
let now = new Date();

// get elements
let em_mangatitle = document.getElementById("manga-title");
let em_mangajptitle = document.getElementById("manga-jptitle");
let em_mangadesc = document.getElementById("manga-desc");
// buttons
let em_mangaread = document.getElementById("manga-read");
let em_mangadex = document.getElementById("mangadex");
// tags
let em_tags = document.getElementById("tags");
// images
let em_mangabg = document.getElementById("manga-bg");
let em_mangaimg = document.getElementById("manga-img");
// reading status
let em_readstatus = document.getElementById('reading_status');


// checks
if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "") {
    
    // if exceeded cache
    
    // do everything
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}?includes[]=author&includes[]=artist&includes[]=cover_art&includes[]=manga`;
    log('search',`Searching for ${manga} manga..`,true);
    xhr.open('GET', url, true);


    // request is received
    xhr.onload = function() {
        log('general',`Found ${manga} manga!`,true);

        // parse
        localStorage.setItem(`${manga}_view`, this.response);

        data_parse = JSON.parse(this.response)

        try {
            get_general(this.response);
            get_relationships(this.response);
        } catch(error) {
            log('error',`${error}`,true);
            get_error();
        }
    }


    // send
    xhr.send();


    // then cache
    now = new Date(now);
    now.setMinutes (now.getMinutes() + 120);
    log('general',`Cached until ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} (2 hr)`,true);
    localStorage.setItem(`${manga}_view_timeout`, now);
} else {
    log('general',`Using cached info until ${new Date(cached_out).getHours()}:${new Date(cached_out).getMinutes()}:${new Date(cached_out).getSeconds()}`,true);
    const data = JSON.parse(localStorage.getItem(`${manga}_view`));

    try {
        get_general(localStorage.getItem(`${manga}_view`));
        get_relationships(localStorage.getItem(`${manga}_view`));
    } catch(error) {
        log('error',`${error}`,true);
        get_error();
    }

}

function get_general(data_pass) {

    log('search',`Retrieving general attributes..`,true);

    // parse
    const data = JSON.parse(data_pass);

    // titles
    em_mangatitle.textContent = data.data.attributes.title.en;
    // page title
    let page_title = document.getElementById("page-title");
    page_title.textContent = `Viewing ${data.data.attributes.title.en}`;
    // edge-case when multiple alt titles
    for (let i in data.data.attributes.altTitles) {
        if (data.data.attributes.altTitles[i].ja != undefined) {
            em_mangajptitle.textContent = `${data.data.attributes.altTitles[i].ja}`;
            // page title
            page_title.textContent = `Viewing ${data.data.attributes.title.en} (${data.data.attributes.altTitles[i].ja})`;
        }
    }
    // desc
    var converter = new showdown.Converter();
    text = `${data.data.attributes.description.en}`;
    html = converter.makeHtml(text);
    em_mangadesc.innerHTML = `${html}`;

    // content rating
    try {
        var rating = contentrating_string[data.data.attributes.contentRating];
    } catch(error) {
        var rating = `${data.data.attributes.contentRating}`;
    }
    // create element
    let em_rating = document.createElement('label');
    em_rating.classList.add('tag',`${data.data.attributes.contentRating}`);
    em_rating.innerHTML = (`${rating}`);
    em_tags.appendChild(em_rating);


    // buttons
    em_mangadex.href = `https://mangadex.org/title/${manga}`;

    // reading status
    read_status();
}

function get_relationships(data_pass) {

    log('search',`Retrieving relationships..`,true);

    // parse
    const data = JSON.parse(data_pass);

    // relationships
    let relationships = data.data.relationships;
    for (let i in relationships) {
        if (relationships[i].type == "cover_art") {
            // cover art

            // create url
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${relationships[i].attributes.fileName}`;

            // expose on page
            em_mangabg.style = `background-image: url(${cover_url});`;
            em_mangaimg.src = `${cover_url}`;
        } else if (relationships[i].type == "author") {
            // author
            let em_author = document.getElementById("manga-author");
            em_author.href = `https://mangadex.org/author/${relationships[i].id}`;
            em_author.innerHTML = `<i class="icon w-24" style="margin-right: 5px;" data-feather="user"></i><h5 class="text-16">${relationships[i].attributes.name}</h5>`;
            feather.replace();
        } else if (relationships[i].type == "artist") {
            // artist
            let em_artist = document.getElementById("manga-artist");
            em_artist.href = `https://mangadex.org/author/${relationships[i].id}`;
            em_artist.innerHTML = `<i class="icon w-24" style="margin-right: 5px;" data-feather="image"></i><h5 class="text-16">${relationships[i].attributes.name}</h5>`;
            feather.replace();
        } else if (relationships[i].type == "manga") {
            // other relationships

            // create element
            let related_card = document.createElement('a');
            related_card.classList.add('manga-card');
            related_card.style.margin = '0';

            // link
            related_card.href = `view.html?m=${relationships[i].id}`;

            // how related
            try {
                var relationship = relationships_string[relationships[i].related];
            } catch(error) {
                var relationship = `${relationships[i].related}`;
            }

            // content rating
            try {
                var rating = contentrating_string[relationships[i].attributes.contentRating];
            } catch(error) {
                var rating = `${relationships[i].attributes.contentRating}`;
            }

            // description
            var converter = new showdown.Converter();
            text = `${relationships[i].attributes.description.en}`;
            html = converter.makeHtml(text);

            // text
            related_card.innerHTML = (`
            <div class="info">
            <h4 class="text-20">${relationships[i].attributes.title.en}</h4>
            <div class="desc-cont">${html}</div>
            <br>
            <label class="tag">${relationship}</label>
            <label class="tag ${relationships[i].attributes.contentRating}">${rating}</label>
            </div>
            `);

            // append
            document.getElementById("manga-related").appendChild(related_card);
        }
    }

    // tags
    let tags = data.data.attributes.tags;
    for (let i in tags) {
        // create element
        let tag = document.createElement('label');
        tag.classList.add('tag',`${(tags[i].attributes.name.en).replaceAll(' ','_')}`);

        // text
        tag.textContent = `${tags[i].attributes.name.en}`;

        // append
        em_tags.appendChild(tag);
    }
}

// on error (404)
function get_error() {
    document.getElementById('overview').innerHTML = (`
    <div class="empty-results" style="display: flex;">
        <span>
        <h3>Title not found</h3>
        <p>The requested title was not found on MangaDex.</p>
        <br>
        <br>
        <label class="over">404</label>
        </span>
    </div>
    `);
}

// reading status
function read_status() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}/status`;
    xhr.open('GET', url, true);


    // on request
    xhr.onload = function() {
        let data = JSON.parse(this.response);

        // spec
        // - reading
        // - on_hold
        // - plan_to_read
        // - dropped
        // - re_reading
        // - completed

        console.log(data.status)

        em_readstatus.setAttribute('title',`${readstatus_string[data.status]}`);
        em_readstatus.innerHTML = (`
        <i class=icon w-24" data-feather="${readstatus_icon[data.status]}">
        `);

        feather.replace();
    }


    // send
    xhr.send();
}