// view manga page


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


// checks
if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "") {
    
    // if exceeded cache
    console.log("[ C ] sending request - no cache present or reached timeout");
    
    // do everything
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}`;
    console.log(`[...] searching mangadex for ${manga}`);
    xhr.open('GET', url, true);


    // request is received
    xhr.onload = function() {
        console.log(`[ Y ] found ${manga} via ${url}`);

        // parse
        localStorage.setItem(`${manga}_view`, this.response);
        const data = JSON.parse(this.response);

        // error response
        if (data.message === "Not Found") {

            // log
            console.log("[ X ] 404");
        } else { // success

            //
        }
    }


    // send
    xhr.send();


    // then cache
    now = new Date(now);
    now.setMinutes ( now.getMinutes() + 150000 );
    console.log(`[ C ] cached until ${now} (1h)`);
    localStorage.setItem(`${manga}_view_timeout`, now);
} else {
    console.log(`[ C ] using cached info until ${cached_out}`);
    const data = JSON.parse(localStorage.getItem(`${manga}_view`));

    // error response
    if (data.message === "Not Found") {

        // log
        console.log("[ X ] 404");
    } else { // success

        // titles
        em_mangatitle.textContent = data.data.attributes.title.en;
        em_mangajptitle.textContent = data.data.attributes.altTitles[0].ja;

        // desc
        em_mangadesc.textContent = data.data.attributes.description.en;

        // buttons
        em_mangadex.href = `https://mangadex.org/title/${manga}`;
        // detect if user has read
        if (chapter == null) {
            console.log(`[...] user has not read before`);
            em_mangaread.href = `read?m=${manga}&c=1`;
        } else {
            console.log(`[...] user has previously read`)
            em_mangaread.textContent = `Continue reading`;
            em_mangaread.classList.add("focus");
            em_mangaread.href = `read?m=${manga}&c=${chapter}`;
        }

    }
}