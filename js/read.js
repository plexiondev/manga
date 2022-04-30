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

// lengths
let em_manga_page = document.getElementById("chapter");
let em_manga_page_full = document.getElementById("chapter-length");


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
    if (localStorage.getItem("op_lowq_downloads") == 1) {
        for (let i in first_data.chapter.dataSaver) {
            // store in array
            images.push(first_data.chapter.dataSaver[i]);
            log('general',`Pushed ${first_data.chapter.data[i]}`,true);
        }
    } else {
        for (let i in first_data.chapter.data) {
            // store in array
            images.push(first_data.chapter.data[i]);
            log('general',`Pushed ${first_data.chapter.data[i]}`,true);
        }
    }
    console.log(`[ Y ] stored array of images, ${images}`);
    localStorage.setItem("image_array",images);
    localStorage.setItem("manga_length",`${images.length}`);
    em_manga_page_full.textContent = `${images.length -= 1}`;

    done = 1;
}
// send
first_xhr.send();

function exit() {
    window.location.href = `view.html?m=${manga}`;
}

// requests to pull images dynamically (will set to specific page number)
function image(id) {
    
    var index = id;

    em_manga_page.textContent = `${index}`;

    let page_title = document.getElementById("page-title");
    page_title.textContent = `Reading ${index}/${localStorage.getItem("manga_length")}`;

    // get from local storage
    let base_url = localStorage.getItem("base_url");
    let hash = localStorage.getItem("hash");
    let image_length = (localStorage.getItem("manga_length") - 1);
    let image_id = localStorage.getItem(`manga_${id}`);

    // if reached end
    if (index > image_length) {

    } else {
        console.log(`[...] requested image ${id}`);
        if (localStorage.getItem("op_lowq_downloads") == 1) {
            console.log(`[...] user requested dataSaver preset`);
            var url = `${base_url}/data-saver/${hash}/${image_id}`;
            manga_page.setAttribute("src",`${url}?a=${Math.random()}`);
        } else {
            var url = `${base_url}/data/${hash}/${image_id}`;
            manga_page.setAttribute("src",`${url}?a=${Math.random()}`);
        }
    }
}

// auto-show first image
check_done()
var index = 0;
function check_done() {
    if (done == 1) {
        image(0);
    } else {
        setTimeout(check_done, 1);
    }
}