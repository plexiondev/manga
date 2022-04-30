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

// cached from mangadex
// initial lists for comparison upon sending data later on
var read_cache = [];
var unread_cache = [];


// checks
if (Date.parse(c_now) >= Date.parse(c_cached_out) || c_cached_out == "") {

    // if exceeded cache

    // do everything
    // define xhr GET
    const c_xhr = new XMLHttpRequest();
    const c_url = `https://api.mangadex.org/manga/${manga}/aggregate?translatedLanguage[]=${lang}`;
    log('search',`Searching chapters for ${manga}`,true);
    c_xhr.open('GET', c_url, true);


    // request is received
    c_xhr.onload = function () {
        log('search',`Found ${manga}'s chapters!`,true);

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
    log('general',`Cached chapter info until ${c_now.getHours()}:${c_now.getMinutes()}:${c_now.getSeconds()} (15 min)`,true);
    localStorage.setItem(`${manga}_chapters_${lang}_timeout`, c_now);
} else {
    log('general',`Using cached chapter info until ${new Date(c_cached_out).getHours()}:${new Date(c_cached_out).getMinutes()}:${new Date(c_cached_out).getSeconds()}`,true);

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
        for (let n in chapters_array) {

            // create element
            let chapter_s = document.createElement('li');
            chapter_s.classList.add('chapter-embed');

            if (check_read(`${chapters_links_array[n]}`) == 1) {
                // text
                chapter_s.innerHTML = (`
                <button class="mark_read read" id="mark_${chapters_links_array[n]}" chapter_id="${chapters_links_array[n]}" read="true" onclick="mark_read('${chapters_links_array[n]}',false)"><i class="icon w-20 seen" data-feather="eye"></i><i class="icon w-20 not_seen" data-feather="eye-off"></i></button>
                <a href="read.html?c=${chapters_links_array[n]}&m=${manga}">Chapter ${chapters_array[n]}</a>
                `);
            } else {
                unread_cache.push(`${chapters_links_array[n]}`);
                // text
                chapter_s.innerHTML = (`
                <button class="mark_read" id="mark_${chapters_links_array[n]}" chapter_id="${chapters_links_array[n]}" read="false" onclick="mark_read('${chapters_links_array[n]}',false)"><i class="icon w-20 seen" data-feather="eye"></i><i class="icon w-20 not_seen" data-feather="eye-off"></i></button>
                <a href="read.html?c=${chapters_links_array[n]}&m=${manga}">Chapter ${chapters_array[n]} (${v[i].volume})</a>
                `);
            }

            // append
            chapter_list.appendChild(chapter_s);
        }

        card.appendChild(chapter_list);
        em_mangachlist.appendChild(card);

        feather.replace();
    }

    read_chapters(read_cache,unread_cache);
}

// empty
function empty_results() {
    log('general',`No chapter results found.`,true);
    document.getElementById("no_results").style.display = `flex`;
}


// get read chapters
function read_chapters(read,unread) {
    // define xhr GET
    const r_xhr = new XMLHttpRequest();
    const r_url = `https://api.mangadex.org/manga/${manga}/read`;
    r_xhr.open('GET', r_url, true);
    r_xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);


    // request is received
    r_xhr.onload = function() {
        const data = JSON.parse(this.response);
        
        for (let i in data.data) {
            try {
                read.push(`${data.data[i]}`);
                mark_read(data.data[i],true);
            } catch(error) {}
        }

        // cache arrays
        localStorage.setItem(`${manga}_read_array`,read);
        localStorage.setItem(`${manga}_unread_array`,unread);

        console.log(`CACHE\n\nread (${read.length}):\n${read}\n\nunread (${unread.length}):\n${unread}`);
    }


    // send
    r_xhr.send();
}