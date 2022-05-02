// view manga's chapters


// cache
var lang = localStorage.getItem("op_translate_language") || "en";
if (lang == 0) {
    lang = "en";
}
let c_cached_out = localStorage.getItem(`${manga}_chapters_${lang}_timeout`) || "";
let c_cache = localStorage.getItem(`${manga}_chapters_${lang}`) || "";
let c_now = new Date();

// cached from mangadex
// initial lists for comparison upon sending data later on
var read_cache = [];
var unread_cache = [];

var assigned_link = false;

get_volumes();


function get_volumes() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}/aggregate?translatedLanguage[]=${lang}`;
    xhr.open('GET',url,true);

    // request is received
    xhr.onload = function () {
        const data = JSON.parse(this.response);
        console.log(data)

        // parse
        if (data.volumes.length != 0) {
            for (let i in data.volumes) {
                let em_card = document.createElement('span');
                em_card.classList.add('chapter-card');
                em_card.innerHTML = (`
                <div class="info">
                <h5 class="main">Volume ${data.volumes[i].volume}</h5>
                </div>
                <ul id="feed.volumes.${data.volumes[i].volume}"></ul>
                `);

                // append
                document.getElementById('feed.volumes').appendChild(em_card);
            }

            get_chapters();
        } else {
            empty_results()
        }
    }

    // send
    xhr.send();
}

function get_chapters() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}/feed?limit=150&includes[]=scanlation_group&includes[]=user&order[volume]=asc&order[chapter]=asc&translatedLanguage[]=${lang}`;
    xhr.open('GET',url,true);

    // request is received
    xhr.onload = function () {
        const data = JSON.parse(this.response);
        console.log(data)

        for (let i in data.data) {
            let em_chapter = document.createElement('li');
            em_chapter.classList.add('chapter-embed');

            if (last_read_id == null && assigned_link != true) {
                document.getElementById('action.read').href = `read.html?c=${data.data[i].id}&m=${manga}`;
                assigned_link = true;
            }

            if (check_read(`${data.data[i].id}`) == 1) {
                // text
                em_chapter.innerHTML = (`
                <button class="mark_read read" id="mark_${data.data[i].id}" chapter_id="${data.data[i].id}" read="true" onclick="mark_read('${data.data[i].id}',false)" title="Marking as read currently does not work. Please do so from mangadex.org" disabled><i class="icon w-20 seen" data-feather="eye"></i><i class="icon w-20 not_seen" data-feather="eye-off"></i></button>
                <a href="read.html?c=${data.data[i].id}&m=${manga}">Chapter ${data.data[i].attributes.chapter}</a>
                `);
            } else {
                unread_cache.push(`${data.data[i].id}`);
                // text
                em_chapter.innerHTML = (`
                <button class="mark_read" id="mark_${data.data[i].id}" chapter_id="${data.data[i].id}" read="false" onclick="mark_read('${data.data[i].id}',false)" title="Marking as read currently does not work. Please do so from mangadex.org" disabled><i class="icon w-20 seen" data-feather="eye"></i><i class="icon w-20 not_seen" data-feather="eye-off"></i></button>
                <a href="read.html?c=${data.data[i].id}&m=${manga}">Chapter ${data.data[i].attributes.chapter}</a>
                `);
            }

            // append
            document.getElementById(`feed.volumes.${data.data[i].attributes.volume}`).appendChild(em_chapter);
        }

        read_chapters();
    }

    // send
    xhr.send();
}

// empty
function empty_results() {
    log('general',`No chapter results found.`,true);
    document.getElementById('error.empty').style.display = `flex`;
}


// get read chapters
function read_chapters() {
    // define xhr GET
    const r_xhr = new XMLHttpRequest();
    const r_url = `https://api.mangadex.org/manga/${manga}/read`;
    r_xhr.open('GET',r_url,true);
    r_xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);


    // request is received
    r_xhr.onload = function() {
        const data = JSON.parse(this.response);
        
        for (let i in data.data) {
            // remove from unread (if there)
            unread_cache.slice(unread_cache.indexOf(`${data.data[i]}`),1);
            log('general',`Removed ${data.data[i]} from unread.`,true);
            // append to read & mark read
            try {
                read_cache.push(`${data.data[i]}`);
                mark_read(data.data[i],true);
            } catch(error) {}
        }

        // cache arrays
        localStorage.setItem(`${manga}_read_array`,read_cache);
        localStorage.setItem(`${manga}_unread_array`,unread_cache);

        console.log(`CACHE\n\nread (${read_cache.length}):\n${read_cache}\n\nunread (${unread_cache.length}):\n${unread_cache}`);
    }


    // send
    r_xhr.send();
}