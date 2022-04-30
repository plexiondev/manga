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

// cache
let cached_out = localStorage.getItem(`${search_req}_search_timeout`) || "";
let cache = localStorage.getItem(`${search_req}_search`) || "";
let now = new Date();

// get elements
let em_searchbody = document.getElementById("search-body");
let em_searchresults = document.getElementById("showing-results");
// images
let em_mangabg = document.getElementById("manga-bg");

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


// checks
if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "") {
    
    // if exceeded cache
    
    // do everything
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga?title=${search_req}&includes[]=cover_art&contentRating[]=safe${rating_suggestive}${rating_explicit}${rating_nsfw}`;
    log('search',`Searching for ${search_req}..`,false);
    xhr.open('GET', url, true);


    // request is received
    xhr.onload = function() {
        log('search',`Displaying results for ${search_req}`,true);

        // parse
        localStorage.setItem(`${search_req}_search`, this.response);
        const data = JSON.parse(this.response);

        em_searchresults.textContent = `Showing ${data.data.length} results for ${search_req}`;

        // check results aren't empty
        if (data.data.length != 0) {
            for (let i in data.data) {
            
                localStorage.setItem("i",i);
    
                // get manga id
                var manga = data.data[i].id;
    
                get_relationships(this.response,manga);
    
                // pass cover art into here along with extra info etc.
    
                // make layout of cards similar to gsot:
                // big cover on left, then info on right (all rounded etc.)
                // possibly include extra info (tags?) n cool stuff
    
            }
        } else {
            empty_results()
        }

    }


    // send
    xhr.send();
}

function get_relationships(data_pass,manga_pass) {

    log('search',`Retrieving relationships..`,true);

    // parse
    const data_raw = data_pass;
    const data = JSON.parse(data_pass);
    var x = localStorage.getItem("i");
    var manga = manga_pass;

    // relationships
    let relationships = data.data[x].relationships;
    for (let i in relationships) {
        if (relationships[i].type == "cover_art") {
            // cover art

            // create url
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${relationships[i].attributes.fileName}`;

            create_em(data_raw,cover_url,manga);
        }
    }
}

function create_em(data_pass,cover_url_pass,manga_pass) {

    const data = JSON.parse(data_pass);
    var cover_art_url = cover_url_pass;
    var i = localStorage.getItem("i");
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

    // info
    let em_info = document.createElement('div');
    em_info.classList.add('info');
    em_info.innerHTML = (`
    <h4 class="text-20">${data.data[i].attributes.title.en}</h4>
    <p class="text-16">${data.data[i].attributes.description.en}</p>
    <label class="tag ${data.data[i].attributes.contentRating}" style="margin-left: 0;"><i class="icon w-16" data-feather="${tags_icon[`${data.data[i].attributes.contentRating}`]}" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}</label>
    `);

    // tags
    let tags = data.data[i].attributes.tags;
    for (let i in tags) {
        // create element
        let tag = document.createElement('label');
        tag.classList.add('tag',`${(tags[i].attributes.name.en).replaceAll(' ','_')}`);

        // text
        tag.textContent = `${tags[i].attributes.name.en}`;

        // append
        em_info.appendChild(tag);
    }

    // append
    card.appendChild(em_info);
    em_searchbody.appendChild(card);

    feather.replace();
}

// empty
function empty_results() {
    log('general',`No search results found.`,true);
    document.getElementById("no_results").style.display = `flex`;
}