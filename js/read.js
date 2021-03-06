// read a chapter


// pass manga id from url
const search = window.location.search;
const query = new URLSearchParams(search);
let manga = query.get('m');
let chapter_id = query.get('c');

var manga_length = 0;
var images = [];
let chapters;
// auth
var hash;
var base_url;

var index = 1;

let this_volume;
let this_chapter;

// aggregate for chapter list
aggregate();


// no caching, pulling directly from the MangaDex@Home network


// first request to get hash etc.
const first_xhr = new XMLHttpRequest();
const first_url = `https://api.mangadex.org/at-home/server/${chapter_id}`;
first_xhr.open('GET',first_url,true);
var done = 0;
// request is received
first_xhr.onload = function() {
    log('general',`Received filenames and hash successfully`,true);

    // parse
    const first_data = JSON.parse(this.response)

    // store base url
    base_url = first_data.baseUrl;
    log('auth',`Base URL: ${base_url}`,true);

    // store hash
    hash = first_data.chapter.hash;
    log('auth',`Hash: ${hash}`,true);

    // grab images
    if (localStorage.getItem('op_lowq_downloads') == 1) {
        for (let i in first_data.chapter.dataSaver) {
            // store in array
            images.push(first_data.chapter.dataSaver[i]);
            log('general',`Pushed ${first_data.chapter.dataSaver[i]}`,true);

            // create
            create_page('dataSaver',`${first_data.chapter.dataSaver[i]}`);
        }
    } else {
        for (let i in first_data.chapter.data) {
            // store in array
            images.push(first_data.chapter.data[i]);
            log('general',`Pushed ${first_data.chapter.data[i]}`,true);

            // create
            create_page('data',`${first_data.chapter.data[i]}`);
        }
    }

    // manga length
    manga_length = `${images.length}`;
    document.getElementById('chapter-length').textContent = `${manga_length}`;

    done = 1;
}
// send
first_xhr.send();

function exit() {
    window.location.href = `view.html?m=${manga}`;
}

// create page
function create_page(type,id) {
    let em_page = document.createElement('img');
    em_page.classList.add('page');
    em_page.alt = 'Page is loading or unavailable';

    // generate url
    // - base_url   assigned from MD@H
    // - type       data/dataSaver
    // - id         page id from MD@H
    em_page.src = `${base_url}/${type}/${hash}/${id}?a=${Math.random()}`;
    
    // append
    document.getElementById('manga_wrap').appendChild(em_page);
}

// turn page
function turn_page(i) {
    read_page(index += i);
}

// read page
function read_page(id) {
    // get pages
    let pages = document.getElementsByClassName('page');
    var i;
    index = id;

    // checks
    if (index > pages.length) {
        advance_chapter();
    }
    if (index < 1) {
        backtrack_chapter();
    }

    // display
    // display
    for (i = 0; i < pages.length; i++) {
        pages[i].classList.remove('shown');
    }
    pages[index-1].classList.add('shown');

    // info
    document.getElementById('page-title').textContent = `Reading ${index}/${localStorage.getItem("manga_length")}`;
    document.getElementById('page').textContent = `${index}`;
}

// auto-show first image
check_done()
var index = 0;
function check_done() {
    if (done == 1) {
        read_page(1);
    } else {
        setTimeout(check_done, 1);
    }
}

function get_info() {
    // find position of current chapter
    for (let n in chapters) {
        for (let i in chapters[n].chapters) {
            if (chapters[n].chapters[i].id == chapter_id) {
                // jackpot

                this_volume = n;
                this_chapter = i;
            }
        }
    }

    document.getElementById('this_volume').textContent = `${this_volume}`;
    document.getElementById('this_chapter').textContent = `${this_chapter}`;

    // continue reading (where left off)
    localStorage.setItem(`${manga}_read_volume`,`${this_volume}`);
    localStorage.setItem(`${manga}_read_chapter`,`${this_chapter}`);
    localStorage.setItem(`${manga}_read_id`,`${chapter_id}`);
}

// detect key input
$(document).keydown(function(event) {
    // <
    if (event.keyCode === 37) {
        turn_page(-1);
        event.preventDefault();
    }
    // >
    if (event.keyCode === 39) {
        turn_page(1);
        event.preventDefault();
    }
    // o
    if (event.keyCode === 79) {
        show_nav();
        event.preventDefault();
    }
    // x
    if (event.keyCode === 88) {
        exit();
    }
});

// aggregate for chapter list
function aggregate() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}/aggregate?translatedLanguage[]=${localStorage.getItem('op_translate_language')}`;
    xhr.open('GET',url,true);

    // on receival
    xhr.onload = function() {
        const data = JSON.parse(this.response);

        chapters = data.volumes;

        get_info();
    }

    // send
    xhr.send();
}

// backtrack chapter
function backtrack_chapter() {
    // find position of current chapter
    for (let n in chapters) {
        for (let i in chapters[n].chapters) {
            if (chapters[n].chapters[i].id == chapter_id) {
                // jackpot

                // locate next chapter
                window.location.href = `/read.html?c=${chapters[n].chapters[parseInt(i)-1].id}&m=${manga}`;
            }
        }
    }
}

// advance chapter
function advance_chapter() {
    // find position of current chapter
    for (let n in chapters) {
        for (let i in chapters[n].chapters) {
            if (chapters[n].chapters[i].id == chapter_id) {
                // jackpot

                // locate next chapter
                try {
                    let next_chapter = `${chapters[n].chapters[parseInt(i)+1].id}`;
                    window.location.href = `/read.html?c=${next_chapter}&m=${manga}`;
                } catch(error) {
                    // no more chapters, advance volume
                    advance_volume(n);
                }
            }
        }
    }
}

// advance volume
function advance_volume(volume) {
    // find position of current volume
    for (let i in chapters[parseInt(volume)+1].chapters) {
        let next_chapter = chapters[parseInt(volume)+1].chapters[i].id;
        window.location.href = `/read.html?c=${next_chapter}&m=${manga}`;
        break
    }
}

// navbar
document.getElementById('header').innerHTML =
(`
<span class="links" id="header_links">
    <ul>
    <li><a href="javascript:void(0)" onclick="history.back()"><i class="icon w-20" icon-name="arrow-left"></i>Back</a></li>
    <li><a href="javascript:void(0)" onclick="location.reload()"><i class="icon w-20" icon-name="repeat"></i>Reload</a></li>
    </ul>
    <hr>
    <ul>
    <li>Vol. <strong id="this_volume"></strong> Ch. <strong id="this_chapter"></strong></li>
    </ul>
    <hr>
    <ul>
    <li><a href="javascript:void(0)" onclick="exit()" class="keycode-cont"><i class="icon w-20" icon-name="log-out"></i>Exit<label class="overl keycode">X</label></a></li>
    <li><a href="/settings" target="_blank"><i class="icon w-20" icon-name="settings"></i>Settings</a></li>
    </ul>
</span>
`);

function show_nav() {
    document.getElementById('nav-manga').classList.toggle('shown');
    document.getElementById('show_nav').classList.toggle('shown');
}