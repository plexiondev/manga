// view manga page


// pass manga id from url
const search = window.location.search;
const query = new search(queryString);
let manga = query.get('m')

// cache
let cached_out = localStorage.getItem(`${manga}_view_timeout`) || "";
let cache = localStorage.getItem(`${manga}_view`) || "";
let now = new Date();


// checks
if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "") {
    
    // if exceeded cache
    console.log("[ C ] sending request - no cache present or reached timeout")
    
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


    // then cache
    now = new Date(now);
    now.setMinutes ( now.getMinutes() + 10 );
    console.log(`[ C ] cached until ${now} (10m)`)
    localStorage.setItem(`${manga}_view_timeout`, now);
} else {
    console.log(`[ C ] using cached info until ${cached_out}`)
    const data = JSON.parse(localStorage.getItem(`${manga}_view`))

    // error response
    if (data.message === "Not Found") {

        // log
        console.log("[ X ] 404")
    } else { // success

        //

    }
}