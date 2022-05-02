// search for manga


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

// pass search request
const search = window.location.search;
const query = new URLSearchParams(search);
let search_req = query.get('q') || "";
document.getElementById('search').value = `${search_req}`;

// cache
let cached_out = localStorage.getItem(`${search_req}_search_timeout`) || "";
let cache = localStorage.getItem(`${search_req}_search`) || "";
let now = new Date();

// page title
document.getElementById('page-title').textContent = `Searching for ${search_req}`;


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
const url = `https://api.mangadex.org/manga?title=${search_req}&includes[]=cover_art&contentRating[]=safe${rating_suggestive}${rating_explicit}${rating_nsfw}`;
log('search',`Searching for ${search_req}..`,false);
xhr.open('GET',url,true);


// request is received
xhr.onload = function() {
    const data = JSON.parse(this.response);
    log('search',`Displaying results for ${search_req}`,true);

    document.getElementById('attr.results').textContent = `Showing ${data.data.length} results for ${search_req}`;

    // check results aren't empty
    if (data.data.length != 0) {
        for (let i in data.data) {
            // get manga id
            var manga = data.data[i].id;

            get_relationships(this.response,manga,i);

        }
    } else {
        empty_results()
    }

}

// send
xhr.send();

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
            if (i == 0) { document.getElementById('manga-bg').style = `background-image: url(${cover_url});`; }

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
        if (i < 8) {
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
    document.getElementById('search.body').appendChild(card);

    feather.replace();
}

// empty
function empty_results() {
    log('general',`No search results found.`,true);
    document.getElementById('error.empty').style.display = `flex`;
}