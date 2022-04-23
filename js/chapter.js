// view manga's chapters


// cache
var lang = localStorage.getItem("op_translate_language") || "en";
if (lang == 0) {
    lang = "en";
}
let c_cached_out = localStorage.getItem(`${manga}_chapters_${lang}_timeout`) || "";
let c_cache = localStorage.getItem(`${manga}_chapters_${lang}`) || "";
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
    const c_url = `https://api.mangadex.org/manga/${manga}/aggregate?translatedLanguage[]=${lang}`;
    log('general',`Searching chapters for ${manga}`);
    c_xhr.open('GET', c_url, true);


    // request is received
    c_xhr.onload = function () {
        log('general',`Found ${manga} via ${c_url}`);

        const data = JSON.parse(this.response);
        let v = data.volumes;

        // parse
        if (v.length != 0) {
            create_chapter(this.response);
            localStorage.setItem(`${manga}_chapters_${lang}`, this.response);
        } else {
            empty_results()
            localStorage.setItem(`${manga}_chapters_${lang}`, this.response);
        }
    }


    // send
    c_xhr.send();


    // then cache
    c_now = new Date(c_now);
    c_now.setMinutes(c_now.getMinutes() + 15);
    log('general',`Cached until ${c_now.getHours()}:${c_now.getMinutes()}:${c_now.getSeconds()} (15 min)`);
    localStorage.setItem(`${manga}_chapters_${lang}_timeout`, c_now);
} else {
    log('general',`Using cached info until ${new Date(c_cached_out).getHours()}:${new Date(c_cached_out).getMinutes()}:${new Date(c_cached_out).getSeconds()}`);

    const data = JSON.parse(localStorage.getItem(`${manga}_chapters_${lang}`));
    let v = data.volumes;

    if (v.length != 0) {
        create_chapter(localStorage.getItem(`${manga}_chapters_${lang}`));
    } else {
        empty_results()
    }
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
        // store chapter links
        var chapters_links_array = [];
        for (let x in chapters_parent) {
            chapters_links_array.push(chapters_parent[x].id);
        }

        // append to button if first chapter
        // detect if user has read
        if (chapter == null) {
            /*log('general',`User not read before`);*/
            em_mangaread.href = `read.html?c=${chapters_parent[chapters_array[0]].id}&m=${manga}`;
        } else {
            /*log('general',`User previously read`);*/
            em_mangaread.textContent = `Continue reading`;
            em_mangaread.classList.add("focus");
            em_mangaread.href = `read?m=${manga}&c=${chapter}`;
        }

        // html
        card.innerHTML = (`
        <div class="info">
        <h5>Volume ${v[i].volume}</h5>
        </div>
        `);

        let chapter_list = document.createElement("ul");

        // show chapters
        for (let i in chapters_array) {

            // create element
            let chapter_s = document.createElement('li');
            chapter_s.classList.add('chapter-embed');

            if (check_read(`${chapters_links_array[i]}`) == 1) {
                // text
                chapter_s.innerHTML = (`
                <button class="mark_read read" id="mark_${chapters_links_array[i]}" onclick="mark_read('${chapters_links_array[i]}',false)"><i class="icon w-20 seen" data-feather="eye"></i><i class="icon w-20 not_seen" data-feather="eye-off"></i></button>
                <a href="read.html?c=${chapters_links_array[i]}&m=${manga}">Chapter ${chapters_array[i]}</a>
                `);
            } else {
                // text
                chapter_s.innerHTML = (`
                <button class="mark_read" id="mark_${chapters_links_array[i]}" onclick="mark_read('${chapters_links_array[i]}',false)"><i class="icon w-20 seen" data-feather="eye"></i><i class="icon w-20 not_seen" data-feather="eye-off"></i></button>
                <a href="read.html?c=${chapters_links_array[i]}&m=${manga}">Chapter ${chapters_array[i]}</a>
                `);
            }

            // append
            chapter_list.appendChild(chapter_s);
        }

        card.appendChild(chapter_list);
        em_mangachlist.appendChild(card);

        feather.replace();
    }

    read_chapters();
}

// empty
function empty_results() {
    log('general',`No results`);
    document.getElementById("no_results").style.display = `flex`;
}


// get read chapters
function read_chapters() {
    // define xhr GET
    const r_xhr = new XMLHttpRequest();
    const r_url = `https://api.mangadex.org/manga/${manga}/read`;
    r_xhr.open('GET', r_url, true);
    r_xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);


    // request is received
    r_xhr.onload = function () {
        const data = JSON.parse(this.response);
        
        for (let i in data.data) {
            mark_read(data.data[i],true);
        }
    }


    // send
    r_xhr.send();
}