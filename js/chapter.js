// view manga's chapters


// cache
var lang = localStorage.getItem('op_translate_language') || "en";
if (lang == 0) {
    lang = "en";
}
let c_cached_out = localStorage.getItem(`${manga}_chapters_${lang}_timeout`) || "";
let c_cache = localStorage.getItem(`${manga}_chapters_${lang}`) || "";
let c_now = new Date();

var assigned_link = false;

let chapters = [];
let groups = [];
let uploaders = [];

get_volumes();


function truncate(string) {
    if (string.length > 23) {
        return string.substring(0,23)+'...';
    } else {
        return string;
    }
}

function get_volumes() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}/aggregate?translatedLanguage[]=${lang}`;
    xhr.open('GET',url,true);

    // request is received
    xhr.onload = function () {
        const data = JSON.parse(this.response);

        // parse
        if (data.volumes.length != 0) {
            for (let i in data.volumes) {
                let volume_name;
                if (data.volumes[i].volume == 'none') {
                    volume_name = 'No Volume';
                } else {
                    volume_name = `Volume ${data.volumes[i].volume}`;
                }

                let em_card = document.createElement('span');
                em_card.classList.add('chapter-card');
                em_card.innerHTML = (`
                <div class="info">
                <h5 class="main">${volume_name}<label class="count" id="feed.volumes.${data.volumes[i].volume}.attr.length"></label></h5>
                </div>
                <ul id="feed.volumes.${data.volumes[i].volume}"></ul>
                `);

                localStorage.setItem(`${manga}.volumes.${data.volumes[i].volume}.attr.length`,0);

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
    const url = `https://api.mangadex.org/manga/${manga}/feed?limit=240&includes[]=scanlation_group&includes[]=user&order[volume]=asc&order[chapter]=asc&translatedLanguage[]=${lang}`;
    xhr.open('GET',url,true);

    // request is received
    xhr.onload = function () {
        const data = JSON.parse(this.response);

        for (let i in data.data) {
            let em_chapter = document.createElement('li');
            em_chapter.classList.add('chapter-embed');
            em_chapter.id = `link.${data.data[i].id}`;

            if (last_read_id == null && assigned_link != true) {
                document.getElementById('action.read').href = `read.html?c=${data.data[i].id}&m=${manga}`;
                assigned_link = true;
            }

            var scanlation_group;
            var scanlation_group_id;
            var uploader;
            var uploader_id;

            for (let n in data.data[i].relationships) {
                if (data.data[i].relationships[n].type == 'scanlation_group') {
                    scanlation_group = data.data[i].relationships[n].attributes.name;
                    scanlation_group_id = data.data[i].relationships[n].id;
                } else if (data.data[i].relationships[n].type == 'user') {
                    uploader = data.data[i].relationships[n].attributes.username;
                    uploader_id = data.data[i].relationships[n].id;
                }
            }

            // store chapter ids
            chapters.push(`${data.data[i].id}`);
            groups.push(`${scanlation_group_id}`);
            uploaders.push(`${uploader_id}`);

            let chapter_name;
            let chapter_name_raw;
            if (data.data[i].attributes.title == '' || data.data[i].attributes.title == null) {
                // no title
                chapter_name = `Chapter ${data.data[i].attributes.chapter}`;
            } else {
                // title present (eg. no chapter number)
                chapter_name = `${data.data[i].attributes.title}`;
            }

            chapter_name_raw = chapter_name;
            chapter_name = truncate(chapter_name);

            // text
            em_chapter.innerHTML = (`
            <button class="mark_read" id="mark_${data.data[i].id}" chapter_id="${data.data[i].id}" onclick="mark_read('${data.data[i].id}',false)"><i class="icon w-20 seen" icon-name="eye" stroke-width="2.5"></i><i class="icon w-20 not_seen" icon-name="eye-off" stroke-width="2.5"></i></button>
            <a href="read.html?c=${data.data[i].id}&m=${manga}" title="${chapter_name_raw}">${chapter_name}</a>
            <span class="right-icons">
            <a href="/user.html?u=${uploader_id}" title="Uploaded by ${uploader}"><i class="icon w-16" icon-name="user" stroke-width="2.5"></i></a>
            <a href="/group.html?u=${scanlation_group_id}" title="Created by ${scanlation_group}"><i class="icon w-16" icon-name="users" stroke-width="2.5"></i></a>
            </span>
            `);

            // append
            if (data.data[i].attributes.volume != null) {
                document.getElementById(`feed.volumes.${data.data[i].attributes.volume}`).appendChild(em_chapter);
                
                let count = parseInt(localStorage.getItem(`${manga}.volumes.${data.data[i].attributes.volume}.attr.length`));
                localStorage.setItem(`${manga}.volumes.${data.data[i].attributes.volume}.attr.length`,`${parseInt(count+1)}`);
                document.getElementById(`feed.volumes.${data.data[i].attributes.volume}.attr.length`).textContent = `${localStorage.getItem(`${manga}.volumes.${data.data[i].attributes.volume}.attr.length`)}`;
            } else {
                // no volume
                document.getElementById('feed.volumes.none').appendChild(em_chapter);
                
                let count = parseInt(localStorage.getItem(`${manga}.volumes.none.attr.length`));
                localStorage.setItem(`${manga}.volumes.none.attr.length`,`${parseInt(count+1)}`);
                document.getElementById(`feed.volumes.none.attr.length`).textContent = `${localStorage.getItem(`${manga}.volumes.none.attr.length`)}`;
            }
        }

        lucide.createIcons();
        read_chapters();
        bind_chapters();
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
            // append to read & mark read
            try {
                mark_read(data.data[i],true);
            } catch(error) {}
        }
    }


    // send
    r_xhr.send();
}

// bind chapters for right-click event listeners
// based on https://itnext.io/how-to-create-a-custom-right-click-menu-with-javascript-9c368bb58724
function bind_chapters() {
    for (let i in chapters) {
        // create menu
        let em_menu = document.createElement('div');
        em_menu.classList.add('menu','standalone');
        em_menu.id = `menu.${chapters[i]}`;
        em_menu.innerHTML = (`
        <ul>
            <li><a href="/view.html?c=${chapters[i]}&m=${manga}">Read chapter</a></li>
            <hr>
            <li><a href="/group.html?u=${groups[i]}">View Group</a></li>
            <li><a href="/user.html?u=${uploaders[i]}">View Uploader</a></li>
            <hr>
            <li><a>Mark Read</a></li>
            <li><a>Mark Unread</a></li>
        </ul>
        `);

        // append
        document.body.appendChild(em_menu);

        // right-click
        console.log(document.getElementById(`link.${chapters[i]}`))
        document.getElementById(`link.${chapters[i]}`).addEventListener('contextmenu', (event) => {
            event.preventDefault();

            const { clientX: mouse_x,clientY: mouse_y } = event;

            document.getElementById(`menu.${chapters[i]}`).style = `top: ${mouse_y}px; left: ${mouse_x}px;`;
            document.getElementById(`menu.${chapters[i]}`).classList.add('shown');
        });

        // click out bounds
        document.body.addEventListener('click', (event_click) => {
            if (event_click.target.offsetParent != document.getElementById(`menu.${chapters[i]}`)) {
                document.getElementById(`menu.${chapters[i]}`).classList.remove('shown');
            }
        });
    }
}