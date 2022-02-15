// view manga's chapters


// cache
let c_cached_out = localStorage.getItem(`${manga}_chapters_timeout`) || "";
let c_cache = localStorage.getItem(`${manga}_chapters`) || "";
let c_now = new Date();

// get elements
let em_mangachlist = document.getElementById("manga-chapters");


// checks
if (Date.parse(c_now) >= Date.parse(c_cached_out) || c_cached_out == "") {
    
    // if exceeded cache
    console.log("[ C ] sending request - no cache present or reached timeout");
    
    // do everything
    // define xhr GET
    const c_xhr = new XMLHttpRequest();
    const c_url = `https://api.mangadex.org/manga/${manga}/aggregate`;
    console.log(`[...] searching mangadex chapters for ${manga}`);
    c_xhr.open('GET', c_url, true);


    // request is received
    c_xhr.onload = function() {
        console.log(`[ Y ] found ${manga} via ${c_url}`);

        // parse
        localStorage.setItem(`${manga}_chapters`, this.response);
        const c_data = JSON.parse(this.response);

        // error response
        if (c_data.message === "Not Found") {

            // log
            console.log("[ X ] 404");
        } else { // success

            //
        }
    }


    // send
    c_xhr.send();


    // then cache
    c_now = new Date(c_now);
    c_now.setMinutes ( c_now.getMinutes() + 150000 );
    console.log(`[ C ] cached until ${c_now} (15m)`);
    localStorage.setItem(`${manga}_chapters_timeout`, c_now);
} else {
    console.log(`[ C ] using cached info until ${c_cached_out}`);
    const c_data = JSON.parse(localStorage.getItem(`${manga}_chapters`));

    // error response
    if (c_data.message === "Not Found") {

        // log
        console.log("[ X ] 404");
    } else { // success

        // simplicity
        let v = c_data.volumes;

        // loop over pool of volumes
        for (let i in v) {
            
            // create element
            let card = document.createElement('a');
            card.classList.add('chapter-card');

            // link
            //card.href = `read?m=${manga}&c=${c1}`;

            // html
            card.innerHTML = (`
            <div class="info">
            <h4 class="text-20">VOL. ${v[i].volume}</h4>
            </div>
            `);

            em_mangachlist.appendChild(card);
        }

    }
}

//function chapter(id) {
//    console.log(`[...] coming soon! ${id}`)
//}