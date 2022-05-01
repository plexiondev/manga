// tag listing


// pass tag request
const search = window.location.search;
const query = new URLSearchParams(search);
let tag = query.get('t') || "";

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

var limit = 18;
var offset = 0;
var top_limit = 3600;

load_page();

function load_page() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga?includedTags[]=${tag}&includes[]=cover_art&contentRating[]=safe${rating_suggestive}${rating_explicit}${rating_nsfw}&limit=${limit}&offset=${offset}`;
    xhr.open('GET', url, true);

    // on request
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        document.getElementById('feed').innerHTML = ``;

        // reset total
        if (top_limit > data.total) {
            top_limit = data.total;
        }

        // calculate total
        var total = Math.round(data.total / 18); // 21418 = 1189
        var page = Math.round(offset / 18); // 18 = 1
        var top_limit_round = Math.round(top_limit / 18); // 3600 = 200

        // pages
        document.getElementById('advance_pages').innerHTML =
        (`
        <button class="page-num left" onclick="set_page(0)">1</button>
        <button class="page-num" onclick="set_page(${offset-18})">${page-1}</button>
        <button class="page-num current" onclick="set_page(${offset})">${page}</button>
        <button class="page-num" onclick="set_page(${offset+18})">${page+1}</button>
        <button class="page-num right" onclick="set_page(${top_limit})">${top_limit_round}</button>
        `);
        
        for (let i in data.data) {
            // get manga id
            var manga = data.data[i].id;

            create_em(this.response,manga,i);
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
    <img src="${cover_art_url}" id="${manga}_cover" alt="Cover art">
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
    document.getElementById('feed').appendChild(card);

    feather.replace();
}

// advance pages
function advance_page(direction) {
    if (direction == 1) {
        offset += 18;
        if (offset <= 3600) {
            log('general',`Advancing forward 1 page (${offset})`,true);
            load_page();
        } else {
            offset -= 18;
        }
    } else {
        offset -= 18;
        if (offset >= 0) {
            log('general',`Advancing backward 1 page (${offset})`,true);
            load_page();
        } else {
            offset += 18;
        }
    }
}

// set page directly
function set_page(page) {
    offset_temp = offset;
    offset = page;
    if (offset >= 0 && offset <= 3600) {
        log('general',`Set page to ${offset}`,true);
        load_page();
    } else {
        offset = offset_temp;
    }
}