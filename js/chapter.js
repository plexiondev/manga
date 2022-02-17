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
    c_xhr.onload = function () {
        console.log(`[ Y ] found ${manga} via ${c_url}`);

        // parse
        create_chapter(this.response);
        localStorage.setItem(`${manga}_chapters`, this.response);
    }


    // send
    c_xhr.send();


    // then cache
    c_now = new Date(c_now);
    c_now.setMinutes(c_now.getMinutes() + 150000);
    console.log(`[ C ] cached until ${c_now} (15m)`);
    localStorage.setItem(`${manga}_chapters_timeout`, c_now);
} else {
    console.log(`[ C ] using cached info until ${c_cached_out}`);

    create_chapter(localStorage.getItem(`${manga}_chapters`));
}

//function chapter(id) {
//    console.log(`[...] coming soon! ${id}`)
//}

function create_chapter(data_pass) {

    // parse
    const data = JSON.parse(data_pass);

    // simplicity
    let v = data.volumes;

    // loop over pool of volumes
    for (let i in v) {

        // create element
        let card = document.createElement('span');
        card.classList.add('chapter-card');

        // links
        let chapters_parent = v[i].chapters;
        var chapters_array = [];
        for (let x in chapters_parent) {
            chapters_array.push(x);
        }
        var read_now = `read.html?c=${chapters_parent[chapters_array[0]].id}&m=${manga}`;

        // append to button if first chapter
        // detect if user has read
        if (chapter == null) {
            console.log(`[...] user has not read before`);
            em_mangaread.href = `read.html?c=${chapters_parent[chapters_array[0]].id}&m=${manga}`;
        } else {
            console.log(`[...] user has previously read`)
            em_mangaread.textContent = `Continue reading`;
            em_mangaread.classList.add("focus");
            em_mangaread.href = `read?m=${manga}&c=${chapter}`;
        }

        // html
        card.innerHTML = (`
        <div class="info">
        <h4 class="text-20">Read volume ${v[i].volume}</h4>
        </div>
        <div class="overlay-icons">
        <a onclick="mark_read('${manga}')" title="Mark as read"><i class="icon w-32" data-feather="bookmark"></i></a>
        <a href="${read_now}" title="Read now"><i class="icon w-32" data-feather="arrow-right-circle"></i></a>
        </div>
        `);

        em_mangachlist.appendChild(card);

        feather.replace();
    }
}