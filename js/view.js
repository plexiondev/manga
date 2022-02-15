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
    console.log("[CACHE] Exceeded cache limit, sending request")
    
    // do everything
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.github.com/orgs/plex1on/repos`;
    console.log(`Searching for ${url}`)
    xhr.open('GET', url, true);


    // request is received
    xhr.onload = function() {
        console.log("Found!")

        // parse
        localStorage.setItem(`${manga}_view`, this.response);
        const data = JSON.parse(this.response)

        // error response
        if (data.message === "Not Found") {

            // log
            console.log("[ERROR] 404")
        } else { // success

            //

        }
    }


    // send
    xhr.send();


    // then cache
    now = new Date(now);
    now.setMinutes ( now.getMinutes() + 10 );
    console.log(`[CACHE] Cached page until ${now} (7 minutes)`)
    localStorage.setItem(`${manga}_view_timeout`, now);
} else {
    console.log(`[CACHE] Not exceeded cache limit yet, using cached information. Wait until ${cached_out}`)
    const data = JSON.parse(localStorage.getItem(`${manga}_view`))

    // error response
    if (data.message === "Not Found") {

        // log
        console.log("[ERROR] 404")
    } else { // success

        //

    }
}