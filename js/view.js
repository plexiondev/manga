// view manga page


const relationships_string = {
    'based_on': 'Original',
    'doujinshi': 'Doujinshi',
    'sequel': 'Sequel',
    'adapted_from': 'Original',
    'side_story': 'Side-story',
    'prequel': 'Prequel',
    'spin_off': 'Spin-off',
    'shared_universe': 'Shared universe'
}

const contentrating_string = {
    'safe': 'Safe',
    'suggestive': 'Suggestive',
    'erotica': 'Erotica',
    'pornographic': 'NSFW'
}

// reading status
const readstatus_string = {
    'reading': 'Reading',
    'on_hold': 'On Hold',
    'plan_to_read': 'Plan To Read',
    'dropped': 'Dropped',
    're_reading': 'Re-reading',
    'completed': 'Completed',
    'add': 'Add to Library'
}
const readstatus_icon = {
    'reading': 'book',
    'on_hold': 'pause-circle',
    'plan_to_read': 'clock',
    'dropped': 'stop-circle',
    're_reading': 'book',
    'completed': 'check-circle',
    'add': 'plus-circle'
}

// tags
const tags_icon = {
    'safe': 'check',
    'suggestive': 'alert-circle',
    'erotica': 'alert-circle',
    'pornographic': 'alert-octagon'
}

// pass manga id from url
const search = window.location.search;
const query = new URLSearchParams(search);
let manga = query.get('m');
// has user read before?
var last_read_volume = localStorage.getItem(`${manga}_read_volume`) || null;
var last_read_chapter = localStorage.getItem(`${manga}_read_chapter`) || null;
var last_read_id = localStorage.getItem(`${manga}_read_id`) || null;

// cache
let cached_out = localStorage.getItem(`${manga}_view_timeout`) || "";
let cache = localStorage.getItem(`${manga}_view`) || "";
let now = new Date();

// get elements
let em_mangatitle = document.getElementById("manga-title");
let em_mangajptitle = document.getElementById("manga-jptitle");
let em_mangadesc = document.getElementById("manga-desc");
// buttons
let em_mangaread = document.getElementById("manga-read");
let em_mangadex = document.getElementById("mangadex");
// tags
let em_tags = document.getElementById("tags");
// images
let em_mangabg = document.getElementById("manga-bg");
let em_mangaimg = document.getElementById("manga-img");
// reading status
let em_readstatus = document.getElementById('reading_status');

// cover art
var cover_art;


// checks
if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "") {
    
    // if exceeded cache
    
    // do everything
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}?includes[]=author&includes[]=artist&includes[]=cover_art&includes[]=manga`;
    log('search',`Searching for ${manga} manga..`,true);
    xhr.open('GET', url, true);


    // request is received
    xhr.onload = function() {
        log('general',`Found ${manga} manga!`,true);

        // parse
        localStorage.setItem(`${manga}_view`, this.response);

        data_parse = JSON.parse(this.response);

        try {
            get_general(this.response);
            get_relationships(this.response);
        } catch(error) {
            log('error',`${error}`,true);
            get_error();
        }
    }


    // send
    xhr.send();


    // then cache
    now = new Date(now);
    now.setMinutes(now.getMinutes() + 120);
    log('general',`Cached until ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} (2 hr)`,true);
    localStorage.setItem(`${manga}_view_timeout`, now);
} else {
    log('general',`Using cached info until ${new Date(cached_out).getHours()}:${new Date(cached_out).getMinutes()}:${new Date(cached_out).getSeconds()}`,true);
    const data = JSON.parse(localStorage.getItem(`${manga}_view`));

    try {
        get_general(localStorage.getItem(`${manga}_view`));
        get_relationships(localStorage.getItem(`${manga}_view`));
    } catch(error) {
        log('error',`${error}`,true);
        get_error();
    }

}

function get_general(data_pass) {

    log('search',`Retrieving general attributes..`,true);

    // parse
    const data = JSON.parse(data_pass);

    // titles
    em_mangatitle.textContent = data.data.attributes.title.en;
    // page title
    let page_title = document.getElementById("page-title");
    page_title.textContent = `Viewing ${data.data.attributes.title.en}`;
    // edge-case when multiple alt titles
    for (let i in data.data.attributes.altTitles) {
        if (data.data.attributes.altTitles[i].ja != undefined) {
            em_mangajptitle.textContent = `${data.data.attributes.altTitles[i].ja}`;
            // page title
            page_title.textContent = `Viewing ${data.data.attributes.title.en} (${data.data.attributes.altTitles[i].ja})`;
        }
    }
    // desc
    var converter = new showdown.Converter();
    text = `${data.data.attributes.description.en}`;
    if (text == 'undefined') { text = '' }
    html = converter.makeHtml(text);
    em_mangadesc.innerHTML = `${html}`;

    // content rating
    try {
        var rating = contentrating_string[data.data.attributes.contentRating];
    } catch(error) {
        var rating = `${data.data.attributes.contentRating}`;
    }
    // create element
    let em_rating = document.createElement('label');
    em_rating.classList.add('tag',`${data.data.attributes.contentRating}`);
    em_rating.innerHTML = (`<i class="icon w-16" data-feather="${tags_icon[`${data.data.attributes.contentRating}`]}" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}`);
    em_tags.appendChild(em_rating);

    // check if content rating matches
    if ((data.data.attributes.contentRating == 'suggestive' && localStorage.getItem('op_show_suggestive') != 1) || (data.data.attributes.contentRating == 'erotica' && localStorage.getItem('op_show_erotica') != 1) || (data.data.attributes.contentRating == 'pornographic' && localStorage.getItem('op_show_nsfw') != 1)) {
        warn_content_rating(`<label class="tag big ${data.data.attributes.contentRating}" style="margin: 0;"><i class="icon w-24" data-feather="${tags_icon[`${data.data.attributes.contentRating}`]}" style="margin-right: 5px; top: -1.3px !important;"></i>${rating}</label>`);
    }

    // buttons
    em_mangadex.href = `https://mangadex.org/title/${manga}`;

    // reading status
    read_status();
    // check following
    check_following();

    // info blocks
    document.getElementById('date_created').innerHTML = (`${new Date(`${data.data.attributes.createdAt}`).toLocaleDateString()}`);
    document.getElementById('date_updated').innerHTML = (`${new Date(`${data.data.attributes.updatedAt}`).toLocaleDateString()}`);
}

function get_relationships(data_pass) {

    log('search',`Retrieving relationships..`,true);

    // parse
    const data = JSON.parse(data_pass);

    // relationships
    let relationships = data.data.relationships;
    for (let i in relationships) {
        if (relationships[i].type == "cover_art") {
            // cover art

            // create url
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${relationships[i].attributes.fileName}`;
            cover_art = cover_url;

            // expose on page
            em_mangabg.style = `background-image: url(${cover_url});`;
            em_mangaimg.src = `${cover_url}`;
            document.getElementById('manga-img-link').href = `${cover_url}`;
        } else if (relationships[i].type == "author") {
            // author
            let em_author = document.getElementById("manga-author");
            em_author.href = `https://mangadex.org/author/${relationships[i].id}`;
            em_author.innerHTML = `<i class="icon w-24" style="margin-right: 5px;" data-feather="user"></i><h5 class="text-16">${relationships[i].attributes.name}</h5>`;
            feather.replace();
        } else if (relationships[i].type == "artist") {
            // artist
            let em_artist = document.getElementById("manga-artist");
            em_artist.href = `https://mangadex.org/author/${relationships[i].id}`;
            em_artist.innerHTML = `<i class="icon w-24" style="margin-right: 5px;" data-feather="image"></i><h5 class="text-16">${relationships[i].attributes.name}</h5>`;
            feather.replace();
        } else if (relationships[i].type == "manga" && relationships[i].attributes != undefined) {
            // other relationships

            // create element
            let related_card = document.createElement('a');
            related_card.classList.add('manga-card');
            related_card.style.margin = '0';

            // link
            related_card.href = `view.html?m=${relationships[i].id}`;

            // how related
            try {
                var relationship = relationships_string[relationships[i].related];
            } catch(error) {
                var relationship = `${relationships[i].related}`;
            }

            // content rating
            try {
                var rating = contentrating_string[relationships[i].attributes.contentRating];
            } catch(error) {
                var rating = `${relationships[i].attributes.contentRating}`;
            }

            // description
            var converter = new showdown.Converter();
            text = `${relationships[i].attributes.description.en}`;
            if (text == 'undefined') { text = '' }
            html = converter.makeHtml(text);

            // text
            related_card.innerHTML = (`
            <div class="info">
            <h4 class="text-20">${relationships[i].attributes.title.en}</h4>
            <div class="desc-cont">${html}</div>
            <br>
            <label class="tag ${relationship}">${relationship}</label>
            <label class="tag ${relationships[i].attributes.contentRating}"><i class="icon w-16" data-feather="${tags_icon[`${relationships[i].attributes.contentRating}`]}" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}</label>
            </div>
            `);

            // append
            if ((relationships[i].attributes.contentRating == 'suggestive' && localStorage.getItem('op_show_suggestive') == 1) || (relationships[i].attributes.contentRating == 'erotica' && localStorage.getItem('op_show_erotica') == 1) || (relationships[i].attributes.contentRating == 'pornographic' && localStorage.getItem('op_show_nsfw') == 1) || (relationships[i].attributes.contentRating == 'safe')) {
                document.getElementById("manga-related").appendChild(related_card);
            }
        }
    }

    // tags
    let tags = data.data.attributes.tags;
    for (let i in tags) {
        // create element
        let tag = document.createElement('a');
        tag.classList.add('tag',`${(tags[i].attributes.name.en).replaceAll(' ','_')}`);
        tag.href = `/tags.html?t=${tags[i].id}`;

        // text
        tag.textContent = `${tags[i].attributes.name.en}`;

        // append
        em_tags.appendChild(tag);
    }
}

// on error (404)
function get_error() {
    document.getElementById('overview').innerHTML = (`
    <div class="empty-results" style="display: flex;">
        <span>
        <h3>Title not found</h3>
        <p>The requested title was not found on MangaDex.</p>
        <br>
        <br>
        <label class="over">404</label>
        </span>
    </div>
    `);
}

// reading status
function read_status() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}/status`;
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);


    // on request
    xhr.onload = function() {
        let data = JSON.parse(this.response);

        // spec
        // - reading
        // - on_hold
        // - plan_to_read
        // - dropped
        // - re_reading
        // - completed
        
        let status = data.status;
        if (status == undefined || status == null) { status = 'add' };

        em_readstatus.setAttribute('onclick',`open_read_status('${status}')`);
        em_readstatus.setAttribute('status',`${status}`);
        em_readstatus.innerHTML = (`
        <i class="icon w-20" data-feather="${readstatus_icon[status]}" style="top: -2px !important; margin-right: 5px;"></i> ${readstatus_string[status]}
        `);

        feather.replace();
    }


    // send
    xhr.send();
}

// open reading status window
function open_read_status(status) {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','read_status_window');

    em_window.innerHTML = (`
        <div class="cover"><img src="${cover_art}"></div>
        <div class="header" style="text-align: center;"><h4>Reading status</h4></div>
        <div class="info" style="text-align: center;">
            <p>Keep track of all things manga, note down what you've<br>completed, are currently reading, and more.</p>
            <br>
            <div class="select">
                <select name="status" id="status">
                    <option value="reading" id="op_reading">${readstatus_string['reading']}</option>
                    <option value="on_hold" id="op_on_hold">${readstatus_string['on_hold']}</option>
                    <option value="plan_to_read" id="op_plan_to_read">${readstatus_string['plan_to_read']}</option>
                    <option value="dropped" id="op_dropped">${readstatus_string['dropped']}</option>
                    <option value="re_reading" id="op_re_reading">${readstatus_string['re_reading']}</option>
                    <option value="completed" id="op_completed">${readstatus_string['completed']}</option>
                    <option style="font-size: 10px;" disabled>&nbsp;</option>
                    <option value="null" id="op_add">Remove from Library</option>
                </select>
            </div>
        </div>
        <div class="actions">
            <a role="button" class="button focus" onclick="save_read_status()">Save</a>
            <a role="button" class="button" onclick="exit_read_status()">Cancel</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    feather.replace();

    // auto-select
    document.getElementById(`op_${status}`).setAttribute('selected','');
}

// save reading status (to mangadex)
function save_read_status() {
    let status = document.getElementById('status').value;

    // define xhr POST
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}/status`;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);


    xhr.onload = function() {
        log('enabled',`Saved status as ${status}`,false);
        // clear window
        document.getElementById('window_parent').innerHTML = ``;

        if (status == undefined || status == null || status == 'null') { status = 'add' };

        // show on button
        em_readstatus.setAttribute('onclick',`open_read_status('${status}')`);
        em_readstatus.setAttribute('status',`${status}`);
        em_readstatus.innerHTML = (`
        <i class="icon w-20" data-feather="${readstatus_icon[status]}" style="top: -2px !important; margin-right: 5px;"></i> ${readstatus_string[status]}
        `);

        feather.replace();
    }


    // send
    xhr.send(JSON.stringify({
        status: status
    }));
}

// exit window
function exit_read_status() {
    document.getElementById('window_parent').innerHTML = ``;
}

// content rating warning
function warn_content_rating(type) {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','warn_content_rating_window');

    em_window.innerHTML = (`
        <div class="cover">${type}</div>
        <div class="header" style="text-align: center;"><h4>Content warning</h4></div>
        <div class="info" style="text-align: center;">
            <p>This manga contains content you have filtered out.<br>Are you sure you want to proceed?</p>
        </div>
        <div class="actions">
        <a role="button" class="button focus" onclick="history.back()">Go back</a>
            <a role="button" class="button" onclick="exit_read_status()">Continue</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
}

// following manga?
function check_following() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/user/follows/manga/${manga}`;
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);


    // on request
    xhr.onload = function() {
        if (xhr.status == 404) {
            // not following

            create_following(false);
        } else {
            // following

            create_following(true);
        }
    }


    // send
    xhr.send();
}

// show following on button
function create_following(status) {
    if (status == false) {
        // not following

        // show on button
        document.getElementById('following').setAttribute('onclick',`open_following(false)`);
        document.getElementById('following').classList.remove('focus');
        document.getElementById('following').innerHTML = (`
        <i class="icon w-22" data-feather="minus-circle" style="top: -1px !important;"></i>
        `);

        feather.replace();
    } else {
        // following
            
        // show on button
        document.getElementById('following').setAttribute('onclick',`open_following(true)`);
        document.getElementById('following').classList.add('focus');
        document.getElementById('following').innerHTML = (`
        <i class="icon w-22" data-feather="bell" style="top: -1px !important;"></i>
        `);

        feather.replace();
    }
}

// open following window
function open_following(status) {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','following_window');

    em_window.innerHTML = (`
    <div class="cover"><img src="${cover_art}"></div>
        <div class="header" style="text-align: center;"><h4>Follow manga</h4></div>
        <div class="info" style="text-align: center;">
            <p>Following a manga adds it to your feed and<br>allows you to quickly see updates.</p>
            <div class="select">
                <select name="status" id="status">
                    <option value="follow" id="op_true">Follow</option>
                    <option value="unfollow" id="op_false">Unfollow</option>
                </select>
            </div>
        </div>
        <div class="actions">
            <a role="button" class="button focus" onclick="save_following()">Save</a>
            <a role="button" class="button" onclick="exit_read_status()">Cancel</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    feather.replace();

    // auto-select
    document.getElementById(`op_${status}`).setAttribute('selected','');
}

// save following (to mangadex)
function save_following() {
    let status = document.getElementById('status').value;

    // define xhr POST
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}/follow`;
    if (status == 'follow') {
        xhr.open('POST', url, true);
    } else {
        xhr.open('DELETE', url, true);
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);


    xhr.onload = function() {
        if (status == 'follow') {
            log('enabled',`You are now following!`,false);
            create_following(true);
        } else {
            log('disabled',`You are no longer following`,false);
            create_following(false);
        }
        // clear window
        document.getElementById('window_parent').innerHTML = ``;
    }


    // send
    xhr.send();
}