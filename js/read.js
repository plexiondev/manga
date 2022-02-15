// read a chapter


// pass manga id from url
const search = window.location.search;
const query = new URLSearchParams(search);
let manga = query.get('m');
// has user read before?
let chapter = localStorage.getItem("chapter") || null;


// get elements
let em_mangatitle = document.getElementById("manga-title");
let em_mangajptitle = document.getElementById("manga-jptitle");
let em_mangadesc = document.getElementById("manga-desc");
// buttons
let em_mangaread = document.getElementById("manga-read");
let em_mangadex = document.getElementById("mangadex");


// no caching, pulling directly from the MangaDex@Home network


// do everything
// define xhr GET
const xhr = new XMLHttpRequest();
const url = `https://api.mangadex.org/manga/${manga}`;
console.log(`[...] searching mangadex for ${manga}`)
xhr.open('GET', url, true);


// request is received
xhr.onload = function() {
    console.log(`[ Y ] found ${manga} via ${url}`)

    // parse
    localStorage.setItem(`${manga}_view`, this.response);
    const data = JSON.parse(this.response)

    // error response
    if (data.message === "Not Found") {

        // log
        console.log("[ X ] 404")
    } else { // success

        //
    }
}


// send
xhr.send();