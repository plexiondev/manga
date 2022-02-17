// search for manga


// pass search request
const search = window.location.search;
const query = new URLSearchParams(search);
let search_req = query.get('q')

// cache
let cached_out = localStorage.getItem(`${search_req}_search_timeout`) || "";
let cache = localStorage.getItem(`${search_req}_search`) || "";
let now = new Date();

// get elements
let em_searchbody = document.getElementById("search-body");
let em_searchresults = document.getElementById("showing-results");
// images
let em_mangabg = document.getElementById("manga-bg");


// checks
if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "") {
    
    // if exceeded cache
    console.log("[ C ] sending request - no cache present or reached timeout");
    
    // do everything
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga?title=${search_req}`;
    console.log(`[...] searching mangadex for ${search_req}`);
    xhr.open('GET', url, true);


    // request is received
    xhr.onload = function() {
        console.log(`[ Y ] displaying search results for ${search_req} via ${url}`);

        // parse
        localStorage.setItem(`${search_req}_search`, this.response);
        const data = JSON.parse(this.response);

        em_searchresults.textContent = `Showing ${data.data.length} results for ${search_req}`;

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

    }


    // send
    xhr.send();


    // then cache
    now = new Date(now);
    now.setMinutes ( now.getMinutes() + 60 );
    console.log(`[ C ] cached until ${now} (1h)`);
    localStorage.setItem(`${search_req}_search_timeout`, now);
} else {
    console.log(`[ C ] using cached info until ${cached_out}`);
    const data = JSON.parse(localStorage.getItem(`${search_req}_search`));

    em_searchresults.textContent = `Showing ${data.data.length} results for ${search_req}`;

    for (let i in data.data) {
            
        localStorage.setItem("i",i);

        // get manga id
        var manga = data.data[i].id;

        get_relationships(localStorage.getItem(`${search_req}_search`),manga);

        // pass cover art into here along with extra info etc.

        // make layout of cards similar to gsot:
        // big cover on left, then info on right (all rounded etc.)
        // possibly include extra info (tags?) n cool stuff

    }

}

function get_general(data_pass) {

    console.log(`[ Y ] G: retrieving...`);

    // parse
    const data = JSON.parse(data_pass);

    // titles
    em_mangatitle.textContent = data.data.attributes.title.en;
    console.log(`[ Y ] G: title (${data.data.attributes.title.en})`);
    // edge-case when multiple alt titles
    for (let i in data.data.attributes.altTitles) {
        if (data.data.attributes.altTitles[i].ja != undefined) {
            em_mangajptitle.textContent = `${data.data.attributes.altTitles[i].ja}`;
            console.log(`[ Y ] G: jp title (${data.data.attributes.altTitles[i].ja})`);
        }
    }
    // desc
    em_mangadesc.textContent = data.data.attributes.description.en;
    console.log(`[ Y ] G: description`);


    // buttons
    em_mangadex.href = `https://mangadex.org/title/${manga}`;
}

function get_relationships(data_pass,manga_pass) {

    console.log(`[ Y ] R: retrieving...`);

    // parse
    const data_raw = data_pass;
    const data = JSON.parse(data_pass);
    var x = localStorage.getItem("i");
    var manga = manga_pass;

    // relationships
    let relationships = data.data[x].relationships;
    for (let i in relationships) {
        console.log(`[ Y ] R: found ${relationships[i].type}`);
        if (relationships[i].type == "cover_art") {
            var cover_art = relationships[i].id;

            get_cover(cover_art,manga,data_raw,x);
        }
    }
}

function get_cover(cover_art_pass,manga_pass,data_pass,y) {

    var cover_art = cover_art_pass;
    var manga = manga_pass;
    var data = JSON.parse(data_pass);
    var data_raw = data_pass;
    var x = y;

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
            if (x == 0) {
                em_mangabg.style = `background-image: url(${cover_url});`;
            }
            localStorage.setItem(`${manga}_cover_img`,`${cover_url}`);

            document.getElementById(`${manga}_cover`).src = `${cover_url}`;
        }
        // send
        xhr.send();

        // then cache
        now = new Date(now);
        now.setMinutes ( now.getMinutes() + 120 );
        console.log(`[ C ] cached until ${now} (2h)`);
        localStorage.setItem(`${manga}_img_timeout`, now);

        create_em(data_raw,cover_url,manga);
    } else {
        console.log(`[ C ] using cached info until ${cached_out}`);
        const data = JSON.parse(localStorage.getItem(`${manga}_img`));

        // take data
        var filename = data.data.attributes.fileName;

        // create url
        var cover_url = `https://uploads.mangadex.org/covers/${manga}/${filename}`;

        // expose on page
        em_mangabg.style = `background-image: url(${cover_url});`;
        localStorage.setItem(`${manga}_cover_img`,`${cover_url}`);

        create_em(data_raw,cover_url,manga);
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

    // html
    console.log(`[ Y ] created (${i})`);
    card.innerHTML = (`
    <div class="cover">
    <img src="${cover_art_url}" id="${manga}_cover" alt="Cover art">
    </div>
    <div class="info">
    <h4 class="text-20">${data.data[i].attributes.title.en}</h4>
    <p class="text-16">${data.data[i].attributes.description.en}</p>
    </div>
    `);

    em_searchbody.appendChild(card);
}