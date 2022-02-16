// search for manga


// pass search request
const search = window.location.search;
const query = new URLSearchParams(search);
let search = query.get('q')

// cache
let cached_out = localStorage.getItem(`${search}_search_timeout`) || "";
let cache = localStorage.getItem(`${search}_search`) || "";
let now = new Date();

// get elements
let em_searchbody = document.getElementById("search-body");


// checks
if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "") {
    
    // if exceeded cache
    console.log("[ C ] sending request - no cache present or reached timeout");
    
    // do everything
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga?title=${search}`;
    console.log(`[...] searching mangadex for ${search}`);
    xhr.open('GET', url, true);


    // request is received
    xhr.onload = function() {
        console.log(`[ Y ] displaying search results for ${search} via ${url}`);

        // parse
        localStorage.setItem(`${search}_search`, this.response);
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
    localStorage.setItem(`${search}_search_timeout`, now);
} else {
    console.log(`[ C ] using cached info until ${cached_out}`);
    const data = JSON.parse(localStorage.getItem(`${search}_search`));

    // error response
    if (data.message === "Not Found") {

        // log
        console.log("[ X ] 404");
    } else { // success

        for (let i in data.data) {
            // create element
            let card = document.createElement('a');
            card.classList.add('manga-card');

            // links
            card.href = `view.html?m=${data.data[i].id}`;
        
            // relationships
            let relationships = data.data[i].relationships;
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
                }
            }

            // pass cover art into here along with extra info etc.

            // make layout of cards similar to gsot:
            // big cover on left, then info on right (all rounded etc.)
            // possibly include extra info (tags?) n cool stuff

            // html
            card.innerHTML = (`
            <div class="cover">
            <img src="" alt="Cover art">
            </div>
            <div class="info">
            <h4 class="text-20">Read volume ${v[i].volume}</h4>
            </div>
            <div class="overlay-icons">
            <a onclick="mark_read('${manga}')" title="Mark as read"><i class="icon w-32" data-feather="bookmark"></i></a>
            <a href="${read_now}" title="Read now"><i class="icon w-32" data-feather="arrow-right-circle"></i></a>
            </div>
            `);

            em_searchbody.appendChild(card);
        
        }

    }
}