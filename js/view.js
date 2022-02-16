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
        //em_mangajptitle.textContent = data.data.attributes.altTitles[0].ja;
        // edge-case when multiple alt titles
        for (i in data.data.attributes.altTitles) {
            if (data.data.attributes.altTitles[i].ja != undefined) {
                em_mangajptitle.textContent = `${data.data.attributes.altTitles[i].ja}`;
            }
        }
        

        // desc
        em_mangadesc.textContent = data.data.attributes.description.en;

        // buttons
        em_mangadex.href = `https://mangadex.org/title/${manga}`;
        // detect if user has read
        if (chapter == null) {
            console.log(`[...] user has not read before`);
            em_mangaread.href = `read.html?m=${manga}&c=1`;
        } else {
            console.log(`[...] user has previously read`)
            em_mangaread.textContent = `Continue reading`;
            em_mangaread.classList.add("focus");
            em_mangaread.href = `read?m=${manga}&c=${chapter}`;
        }

        // relationships
        let relationships = data.data.relationships;
        for (let i in relationships) {
            console.log(`[ Y ] found ${relationships[i].type} relationship`);
            if (relationships[i].type == "cover_art") {
                var cover_art = relationships[i].id;

                // cache
                let cached_out = localStorage.getItem(`${manga}_img_timeout`) || "";
                let cache = localStorage.getItem(`${manga}_img`) || "";
                let now = new Date();

                // checks
                if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "") {
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

                        // error response
                        if (data.message === "Not Found") {

                            // log
                            console.log("[ X ] 404");
                        } else { // success

                            // take data
                            var filename = data.data.attributes.fileName;

                            // create url
                            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${filename}`;

                            // expose on page
                            em_mangabg.style = `background-image: url(${cover_url});`;
                            em_mangaimg.src = `${cover_url}`;
                        }
                    }
                    // send
                    xhr.send();

                    // then cache
                    now = new Date(now);
                    now.setMinutes ( now.getMinutes() + 12000000 );
                    console.log(`[ C ] cached until ${now} (2h)`);
                    localStorage.setItem(`${manga}_img_timeout`, now);
                } else {
                    console.log(`[ C ] using cached info until ${cached_out}`);
                    const data = JSON.parse(localStorage.getItem(`${manga}_img`));

                    // error response
                    if (data.message === "Not Found") {

                        // log
                        console.log("[ X ] 404");
                    } else { // success

                        // take data
                        var filename = data.data.attributes.fileName;

                        // create url
                        var cover_url = `https://uploads.mangadex.org/covers/${manga}/${filename}`;

                        // expose on page
                        em_mangabg.style = `background-image: url(${cover_url});`;
                        em_mangaimg.src = `${cover_url}`;
                    }
                }
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
}