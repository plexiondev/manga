// read a chapter


// pass manga id from url
const search = window.location.search;
const query = new URLSearchParams(search);
let manga = query.get('m');
let chapter_id = query.get('c');
// has user read before?
let chapter = localStorage.getItem("chapter") || null;

var manga_length = 0;
var images = [];
// auth
var hash;
var base_url;

var index = 1;


// no caching, pulling directly from the MangaDex@Home network


// first request to get hash etc.
const first_xhr = new XMLHttpRequest();
const first_url = `https://api.mangadex.org/at-home/server/${chapter_id}`;
first_xhr.open('GET', first_url, true);
var done = 0;
// request is received
first_xhr.onload = function() {
    log('general',`Received filenames and hash successfully`,true);

    // parse
    const first_data = JSON.parse(this.response)

    // store base url
    base_url = first_data.baseUrl;
    log('auth',`Base URL: ${base_url}`,true);

    // store hash
    hash = first_data.chapter.hash;
    log('auth',`Hash: ${hash}`,true);

    // grab images
    if (localStorage.getItem('op_lowq_downloads') == 1) {
        for (let i in first_data.chapter.dataSaver) {
            // store in array
            images.push(first_data.chapter.dataSaver[i]);
            log('general',`Pushed ${first_data.chapter.dataSaver[i]}`,true);

            // create
            create_page('dataSaver',`${first_data.chapter.dataSaver[i]}`);
        }
    } else {
        for (let i in first_data.chapter.data) {
            // store in array
            images.push(first_data.chapter.data[i]);
            log('general',`Pushed ${first_data.chapter.data[i]}`,true);

            // create
            create_page('data',`${first_data.chapter.data[i]}`);
        }
    }

    // manga length
    manga_length = `${images.length}`;
    document.getElementById('chapter-length').textContent = `${manga_length}`;

    done = 1;
}
// send
first_xhr.send();

function exit() {
    window.location.href = `view.html?m=${manga}`;
}

// create page
function create_page(type,id) {
    let em_page = document.createElement('img');
    em_page.classList.add('page');
    em_page.alt = 'Page is loading or unavailable';

    // generate url
    // - base_url   assigned from MD@H
    // - type       data/dataSaver
    // - id         page id from MD@H
    em_page.src = `${base_url}/${type}/${hash}/${id}?a=${Math.random()}`;
    
    // append
    document.getElementById('manga_wrap').appendChild(em_page);
}

// turn page
function turn_page(i) {
    read_page(index += i);
}

// read page
function read_page(id) {
    // get pages
    let pages = document.getElementsByClassName('page');
    var i;
    index = id;

    // checks
    if (index > pages.length) {
        index = 1;
    }
    if (index < 1) {
        index = pages.length;
    }

    // display
    // display
    for (i = 0; i < pages.length; i++) {
        pages[i].classList.remove('shown');
    }
    pages[index-1].classList.add('shown');

    // info
    document.getElementById('page-title').textContent = `Reading ${index}/${localStorage.getItem("manga_length")}`;
    document.getElementById('chapter').textContent = `${index}`;
}

// auto-show first image
check_done()
var index = 0;
function check_done() {
    if (done == 1) {
        read_page(1);
    } else {
        setTimeout(check_done, 1);
    }
}

// detect key input
$(document).keydown(function(event) {
    // <
    if (event.keyCode === 37) {
        turn_page(-1);
    }
    // >
    if (event.keyCode === 39) {
        turn_page(1);
    }
});