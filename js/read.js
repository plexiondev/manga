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


// no caching, pulling directly from the MangaDex@Home network


// first request to get hash etc.
const first_xhr = new XMLHttpRequest();
const first_url = `https://api.mangadex.org/at-home/server/${chapter_id}`;
first_xhr.open('GET', first_url, true);
// request is received
first_xhr.onload = function() {
    console.log(`[ Y ] received filenames and hash`)

    // parse
    const first_data = JSON.parse(this.response)

    // error response
    if (first_data.message === "Not Found") {

        // log
        console.log("[ X ] 404")
    } else { // success

        // store base url
        let base_url = first_data.baseUrl;
        localStorage.setItem("base_url",base_url);
        console.log(`[ Y ] base url: ${base_url}`);

        // store hash
        let hash = first_data.chapter.hash;
        localStorage.setItem("hash",hash);
        console.log(`[ Y ] hash: ${hash}`);

        // grab images
        for (let i in first_data.chapter.data) {
            // store in array
            images.push(first_data.chapter.data[i]);
            localStorage.setItem(`manga_${i}`,`${first_data.chapter.data[i]}`)
            console.log(`[ A ] pushed ${first_data.chapter.data[i]} into images array`);
        }
        console.log(`[ Y ] stored array of images, ${images}`);
        localStorage.setItem("image_array",images);
        localStorage.setItem("manga_length",`${images.length}`);
    }
}
// send
first_xhr.send();


// requests to pull images dynamically
function image(id) {

    // get from local storage
    let base_url = localStorage.getItem("base_url");
    let hash = localStorage.getItem("hash");
    let image_array = localStorage.getItem("image_array");
    let image_id = localStorage.getItem(`manga_${id}`);

    console.log(`[...] requested image ${id}`);

    var url = `${base_url}/data/${hash}/${image_id}`;

    manga_page.setAttribute("src",`${url}`);
}