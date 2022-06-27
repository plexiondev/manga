// view list page


const mangadex_user = 'd2ae45e0-b5e2-4e7f-a688-17925c2d7d6b';

// pass manga id from url
const search = window.location.search;
const query = new URLSearchParams(search);
let list = query.get('l');
if (list == "") {
    // no list supplied
    prompt_no_list();
} else {
    // get list
    get_list();
}

// get list's manga
let titles = [];

// rating
let rating_dist;
let rating_average;
let user_rating;


// checks
function get_list() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/list/${list}`;
    xhr.open('GET',url,true);

    xhr.onload = function() {
        get_general(JSON.parse(this.response));
    }


    // send
    xhr.send();
}

/**
 * parses general manga info (eg. title, description)
 * @param {string} data data passed from API or cache
 */
function get_general(data) {
    // titles
    document.getElementById('attr.title').textContent = data.data.attributes.name;

    // actions
    // open in mangadex
    document.getElementById('action.mangadex').href = `https://mangadex.org/list/${list}`;

    for (let i in data.data.relationships) {
        if (data.data.relationships[i].type == 'manga') {
            titles.push(data.data.relationships[i].id);
        } else if (data.data.relationships[i].type == 'user') {
            // is seasonal?
            if (data.data.relationships[i].id == mangadex_user) document.getElementById('attr.title').classList.add('highlight');
        }
    }

    get_titles();
}

// get titles
function get_titles() {
    // append each ID to query
    let append_list = '';
    for (let i in titles) {
        append_list = `${append_list}&ids[]=${titles[i]}`;
    }

    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga?includes[]=cover_art&includes[]=author&includes[]=artist&contentRating[]=safe${rating_suggestive}${rating_explicit}${rating_nsfw}${append_list}`;
    xhr.open('GET',url,true);

    // on request
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        
        for (let i in data.data) {
            // get manga id
            var manga = data.data[i].id;
            
            generate_card(data.data[i],manga,'feed.titles',true);
        }
    }

    // send
    xhr.send();
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
        <h3>List not found</h3>
        <p>The requested list was not found on MangaDex.</p>
        <br>
        <br>
        <label class="over">404</label>
        </span>
    </div>
    `);
}