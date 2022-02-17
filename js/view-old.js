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
// tags
let em_tags = document.getElementById("tags");
// images
let em_mangabg = document.getElementById("manga-bg");
let em_mangaimg = document.getElementById("manga-img");


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

        data_parse = JSON.parse(this.response)

        get_general(this.response);
        get_relationships(this.response);
    }


    // send
    xhr.send();


    // then cache
    now = new Date(now);
    now.setMinutes ( now.getMinutes() + 120 );
    console.log(`[ C ] cached until ${now} (2h)`);
    localStorage.setItem(`${manga}_view_timeout`, now);
} else {
    console.log(`[ C ] using cached info until ${cached_out}`);
    const data = JSON.parse(localStorage.getItem(`${manga}_view`));

    get_general(localStorage.getItem(`${manga}_view`));
    get_relationships(localStorage.getItem(`${manga}_view`));

}

function get_general(data_pass) {

    console.log(`[ Y ] G: retrieving...`);

    // parse
    const data = JSON.parse(data_pass);

    // titles
    em_mangatitle.textContent = data.data.attributes.title.en;
    console.log(`[ Y ] G: title (${data.data.attributes.title.en})`);
    // page title
    let page_title = document.getElementById("page-title");
    page_title.textContent = `Viewing ${data.data.attributes.title.en}`;
    // edge-case when multiple alt titles
    for (let i in data.data.attributes.altTitles) {
        if (data.data.attributes.altTitles[i].ja != undefined) {
            em_mangajptitle.textContent = `${data.data.attributes.altTitles[i].ja}`;
            console.log(`[ Y ] G: jp title (${data.data.attributes.altTitles[i].ja})`);
            // page title
            page_title.textContent = `Viewing ${data.data.attributes.title.en} (${data.data.attributes.altTitles[i].ja})`;
        }
    }
    // desc
    em_mangadesc.textContent = data.data.attributes.description.en;
    console.log(`[ Y ] G: description`);


    // buttons
    em_mangadex.href = `https://mangadex.org/title/${manga}`;
}

function get_relationships(data_pass) {

    console.log(`[ Y ] R: retrieving...`);

    // parse
    const data = JSON.parse(data_pass);

    // relationships
    let relationships = data.data.relationships;
    for (let i in relationships) {
        console.log(`[ Y ] R: found ${relationships[i].type}`);
        if (relationships[i].type == "cover_art") {
            var cover_art = relationships[i].id;

            get_cover(cover_art);
        } else if (relationships[i].type == "author") {
            let em_author = document.getElementById("manga-author");
            em_author.href = `https://mangadex.org/author/${relationships[i].id}`;
            em_author.innerHTML = `<h5 class="text-16">View author</h5>`;
        } else if (relationships[i].type == "artist") {
            let em_artist = document.getElementById("manga-artist");
            em_artist.href = `https://mangadex.org/author/${relationships[i].id}`;
            em_artist.innerHTML = `<h5 class="text-16">View artist</h5>`;
        } else {
            
            // create element
            let tag = document.createElement('label');
            tag.classList.add('tag');

            // text
            tag.textContent = `${relationships[i].type}`;

            em_tags.appendChild(tag);

        }
    }
}

function get_cover(cover_art_pass) {

    var cover_art = cover_art_pass;

    // cache
    let cached_out = localStorage.getItem(`${manga}_img_timeout`) || "";
    let cache = localStorage.getItem(`${manga}_img`) || "";
    let now = new Date();

    // checks
    if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "" || cache == "") {
        // define xhr GET
        const xhr = new XMLHttpRequest();
        const url = `https://api.mangadex.org/cover/${cover_art}`;
        console.log(`[...] searching mangadex for ${cover_art} cover art`);
        xhr.open('GET', url, true);


        // request is received
        xhr.onload = function() {
            console.log(`[ Y ] found ${cover_art} cover art via ${url}`);

            // parse
            localStorage.setItem(`${manga}_img`, this.response);
            const data = JSON.parse(this.response);

            // take data
            var filename = data.data.attributes.fileName;

            // create url
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${filename}`;

            // expose on page
            em_mangabg.style = `background-image: url(${cover_url});`;
            em_mangaimg.src = `${cover_url}`;
        }
        // send
        xhr.send();

        // then cache
        now = new Date(now);
        now.setMinutes ( now.getMinutes() + 120 );
        console.log(`[ C ] cached until ${now} (2h)`);
        localStorage.setItem(`${manga}_img_timeout`, now);
    } else {
        console.log(`[ C ] using cached info until ${cached_out}`);
        const data = JSON.parse(localStorage.getItem(`${manga}_img`));

        // take data
        var filename = data.data.attributes.fileName;

        // create url
        var cover_url = `https://uploads.mangadex.org/covers/${manga}/${filename}`;

        // expose on page
        em_mangabg.style = `background-image: url(${cover_url});`;
        em_mangaimg.src = `${cover_url}`;
    }
}