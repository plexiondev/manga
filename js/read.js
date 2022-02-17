// read a chapter


// pass manga id from url
const search = window.location.search;
const query = new URLSearchParams(search);
let manga = query.get('m');
let chapter_id = query.get('c');
// has user read before?
let chapter = localStorage.getItem("chapter") || null;


// create array for images
var images = [];

// get elements
let manga_page = document.getElementById("manga");
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
    console.log(`[ Y ] received filenames and hash`);

    // parse
    const first_data = JSON.parse(this.response)

    // store base url
    let base_url = first_data.baseUrl;
    localStorage.setItem("base_url",base_url);
    console.log(`[ Y ] base url: ${base_url}`);

    // store hash
    let hash = first_data.chapter.hash;
    localStorage.setItem("hash",hash);
    console.log(`[ Y ] hash: ${hash}`);

    // grab images
    if (localStorage.getItem("op_lowq_downloads") == 1) {
        for (let i in first_data.chapter.dataSaver) {
            // store in array
            images.push(first_data.chapter.dataSaver[i]);
            localStorage.setItem(`manga_${i}`,`${first_data.chapter.dataSaver[i]}`);
            console.log(`[ A ] pushed ${first_data.chapter.dataSaver[i]} into images array`);
        }
    } else {
        for (let i in first_data.chapter.data) {
            // store in array
            images.push(first_data.chapter.data[i]);
            localStorage.setItem(`manga_${i}`,`${first_data.chapter.data[i]}`);
            console.log(`[ A ] pushed ${first_data.chapter.data[i]} into images array`);
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