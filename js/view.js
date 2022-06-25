// view manga page


// reading status
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


// Index page's query strings
const PageQuery = new URLSearchParams(window.location.search);
let manga = PageQuery.get('m');

// Has the user locally read before?
var UserLastReadVolume = localStorage.getItem(`${manga}_read_volume`) || null;
var UserLastReadChapter = localStorage.getItem(`${manga}_read_chapter`) || null;
var UserLastReadChapterID = localStorage.getItem(`${manga}_read_id`) || null;

if (UserLastReadChapterID != null) {
    document.getElementById('action.read').textContent = `Continue from Vol. ${UserLastReadVolume} Ch. ${UserLastReadChapter}`;
    document.getElementById('action.read').href = `/read.html?c=${UserLastReadChapterID}&m=${manga}`;
}

// cache
let cached_out = localStorage.getItem(`${manga}_view_timeout`) || "";
let cache = localStorage.getItem(`${manga}_view`) || "";
let now = new Date();

// cover art
var cover_art;

// rating
let rating_dist;
let rating_average;
let user_rating;


// checks
if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "") {
    
    // if exceeded cache
    
    // do everything
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}?includes[]=author&includes[]=artist&includes[]=cover_art&includes[]=manga`;
    log('search',`Searching for ${manga} manga..`,true);
    xhr.open('GET',url,true);


    // request is received
    xhr.onload = function() {
        log('general',`Found ${manga} manga!`,true);

        // parse
        localStorage.setItem(`${manga}_view`,this.response);

        data_parse = JSON.parse(this.response);

        try {
            ParseMangaGeneral(this.response);
            ParseMangaRelationships(this.response);
        } catch(error) {
            log('error',error,true);
            get_error();
        }

        // then cache
        now = new Date(now);
        now.setMinutes(now.getMinutes() + 120);
        log('general',`Cached until ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} (2 hr)`,true);
        localStorage.setItem(`${manga}_view_timeout`,now);
    }


    // send
    xhr.send();
} else {
    log('general',`Using cached info until ${new Date(cached_out).getHours()}:${new Date(cached_out).getMinutes()}:${new Date(cached_out).getSeconds()}`,true);
    const data = JSON.parse(localStorage.getItem(`${manga}_view`));

    try {
        ParseMangaGeneral(localStorage.getItem(`${manga}_view`));
        ParseMangaRelationships(localStorage.getItem(`${manga}_view`));
    } catch(error) {
        log('error',`${error}`,true);
        get_error();
    }

}

/**
 * Parses general information (eg. title, description, content rating, etc.)
 * @param {string} data_pass - Raw data from either MangaDex API or cache
 */
function ParseMangaGeneral(data_pass) {

    log('search',`Retrieving general attributes..`,true);

    // parse
    const data = JSON.parse(data_pass);

    // titles
    document.getElementById('attr.title').textContent = data.data.attributes.title.en;
    // alt titles
    for (let i in data.data.attributes.altTitles) {
        // only check for ja (for now)
        if (data.data.attributes.altTitles[i].ja != undefined) {
            document.getElementById('attr.alt_title').textContent = `${data.data.attributes.altTitles[i].ja}`;
            // page title (with alt)
            document.getElementById('page.title').textContent = `Viewing ${data.data.attributes.title.en} (${data.data.attributes.altTitles[i].ja})`;
        } else {
            // page title (without alt)
            document.getElementById('page.title').textContent = `Viewing ${data.data.attributes.title.en}`;
        }
    }

    // description
    // ran through showdown to convert markdown
    var converter = new showdown.Converter();
    text = `${data.data.attributes.description.en}`;
    if (text == 'undefined') text = '';
    html = converter.makeHtml(text);
    // append
    document.getElementById('attr.body').innerHTML = `${html}`;

    // content rating
    try {
        var rating = TranslateString(`RATING_${data.data.attributes.contentRating.toUpperCase()}`);
    } catch(error) {
        var rating = `${data.data.attributes.contentRating}`;
    }
    // create element
    let em_rating = document.createElement('label');
    em_rating.classList.add('tag',`${data.data.attributes.contentRating}`);
    em_rating.innerHTML = (`<i class="icon w-16" icon-name="${tags_icon[`${data.data.attributes.contentRating}`]}" stroke-width="2.5" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}`);
    document.getElementById('attr.tags').appendChild(em_rating);

    // check if content rating matches
    if ((data.data.attributes.contentRating == 'suggestive' && localStorage.getItem('op_show_suggestive') != 1) || (data.data.attributes.contentRating == 'erotica' && localStorage.getItem('op_show_erotica') != 1) || (data.data.attributes.contentRating == 'pornographic' && localStorage.getItem('op_show_nsfw') != 1)) {
        warn_content_rating(`<label class="tag big ${data.data.attributes.contentRating}" stroke-width="2.5" style="margin: 0;"><i class="icon w-24" icon-name="${tags_icon[`${data.data.attributes.contentRating}`]}" style="margin-right: 5px; top: -1.3px !important;"></i>${rating}</label>`);
    }

    // actions
    // open in mangadex
    document.getElementById('action.mangadex').href = `https://mangadex.org/title/${manga}`;

    // Parse user-required interactions
    // Is the user actively reading?
    FetchUserReadStatus();
    // Is the user following?
    FetchUserFollowing();
    // Did the user rate this manga?
    FetchUserRating();
    // Get the manga's rating & follow count
    FetchMangaStatistics();

    // info blocks
    document.getElementById('attr.date_created').innerHTML = (`${new Date(`${data.data.attributes.createdAt}`).toLocaleDateString()}`);
    document.getElementById('attr.date_updated').innerHTML = (`${new Date(`${data.data.attributes.updatedAt}`).toLocaleDateString()}`);
}

/**
 * Parses a manga's relationships (eg. cover art, author, artist, and related manga)
 * @param {string} data_pass - Raw data from either MangaDex API or cache
 */
function ParseMangaRelationships(data_pass) {

    log('search',`Retrieving relationships..`,true);

    // parse
    const data = JSON.parse(data_pass);

    // relationships
    let relationships = data.data.relationships;
    for (let i in relationships) {
        if (relationships[i].type == 'cover_art') {
            // cover art

            // create url
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${relationships[i].attributes.fileName}`;
            cover_art = cover_url;

            // expose on page
            document.getElementById('img.background').style = `background-image: url(${cover_url});`;
            document.getElementById('img.cover').src = `${cover_url}`;
            document.getElementById('attr.img_link').href = `${cover_url}`;
        } else if (relationships[i].type == 'author') {
            // author
            document.getElementById('attr.author').href = `/author.html?u=${relationships[i].id}`;
            document.getElementById('attr.author').innerHTML = `<i class="icon w-24" style="margin-right: 5px;" icon-name="user"></i><h5 class="text-16">${relationships[i].attributes.name}</h5>`;
            lucide.createIcons();
        } else if (relationships[i].type == 'artist') {
            // artist
            document.getElementById('attr.artist').href = `/author.html?u=${relationships[i].id}`;
            document.getElementById('attr.artist').innerHTML = `<i class="icon w-24" style="margin-right: 5px;" icon-name="image"></i><h5 class="text-16">${relationships[i].attributes.name}</h5>`;
            lucide.createIcons();
        } else if (relationships[i].type == 'manga' && relationships[i].attributes != undefined) {
            // other relationships

            // create element
            let related_card = document.createElement('a');
            related_card.classList.add('manga-card');
            related_card.style.margin = '0';

            // link
            related_card.href = `view.html?m=${relationships[i].id}`;

            // how related
            try {
                var relationship = TranslateString(`RELATIONSHIP_${relationships[i].related.toUpperCase()}`);
            } catch(error) {
                // if the relationship string is not found
                var relationship = `${relationships[i].related}`;
            }

            // content rating
            try {
                var rating = TranslateString(`RATING_${relationships[i].attributes.contentRating.toUpperCase()}`);
            } catch(error) {
                // if the rating string is not found
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
            <label class="tag ${relationships[i].attributes.contentRating}"><i class="icon w-16" icon-name="${tags_icon[`${relationships[i].attributes.contentRating}`]}" stroke-width="2.5" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}</label>
            </div>
            `);

            // append
            if ((relationships[i].attributes.contentRating == 'suggestive' && localStorage.getItem('op_show_suggestive') == 1) || (relationships[i].attributes.contentRating == 'erotica' && localStorage.getItem('op_show_erotica') == 1) || (relationships[i].attributes.contentRating == 'pornographic' && localStorage.getItem('op_show_nsfw') == 1) || (relationships[i].attributes.contentRating == 'safe')) {
                document.getElementById('feed.related').appendChild(related_card);
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

        if (localStorage.getItem('op_show_nsfw') != 1 && (tags[i].attributes.name.en == 'Sexual Violence' || tags[i].attributes.name.en == 'Gore')) {
            warn_content_rating(`<label class="tag big ${(tags[i].attributes.name.en).replaceAll(' ','_')}" style="margin: 0;">${tags[i].attributes.name.en}</label>`);
        }

        // text
        tag.textContent = `${tags[i].attributes.name.en}`;

        // append
        document.getElementById('attr.tags').appendChild(tag);
    }
}

// expand truncated body
function expand_trunc_body() {
    document.getElementById('attr.trunc_body').classList.toggle('expand');
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
function FetchUserReadStatus() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}/status`;
    xhr.open('GET',url,true);
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);


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

        document.getElementById('action.status').setAttribute('onclick',`open_FetchUserReadStatus('${status}')`);
        document.getElementById('action.status').setAttribute('status',`${status}`);
        document.getElementById('action.status').innerHTML = (`
        <i class="icon w-20" icon-name="${readstatus_icon[status]}" stroke-width="2.5" style="top: -2px !important; margin-right: 5px;"></i> ${TranslateString(`READ_${status.toUpperCase()}`)}
        `);

        lucide.createIcons();
    }


    // send
    xhr.send();
}

// open reading status window
function open_FetchUserReadStatus(status) {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','FetchUserReadStatus_window');

    em_window.innerHTML = (`
        <div class="cover"><img src="${cover_art}"></div>
        <div class="header" style="text-align: center;"><h4>Reading status</h4></div>
        <div class="info" style="text-align: center;">
            <p>Keep track of all things manga, note down what you've<br>completed, are currently reading, and more.</p>
            <br>
            <div class="select">
                <select name="status" id="status">
                    <option value="reading" id="op_reading">${TranslateString('READ_READING')}</option>
                    <option value="on_hold" id="op_on_hold">${TranslateString('READ_ON_HOLD')}</option>
                    <option value="plan_to_read" id="op_plan_to_read">${TranslateString('READ_PLAN_TO_READ')}</option>
                    <option value="dropped" id="op_dropped">${TranslateString('READ_DROPPED')}</option>
                    <option value="re_reading" id="op_re_reading">${TranslateString('READ_RE_READING')}</option>
                    <option value="completed" id="op_completed">${TranslateString('READ_COMPLETED')}</option>
                    <option style="font-size: 10px;" disabled>&nbsp;</option>
                    <option value="null" id="op_add">Remove from Library</option>
                </select>
            </div>
        </div>
        <div class="actions">
            <a role="button" class="button focus" onclick="save_FetchUserReadStatus()">Save</a>
            <a role="button" class="button" onclick="exit_FetchUserReadStatus()">Cancel</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    lucide.createIcons();

    // auto-select
    document.getElementById(`op_${status}`).setAttribute('selected','');
}

// save reading status (to mangadex)
function save_FetchUserReadStatus() {
    let status = document.getElementById('status').value;

    // define xhr POST
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}/status`;
    xhr.open('POST',url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);


    xhr.onload = function() {
        log('enabled',`Saved status as ${status}`,false);
        // clear window
        document.getElementById('window_parent').innerHTML = ``;

        if (status == undefined || status == null || status == 'null') { status = 'add' };

        // show on button
        document.getElementById('action.status').setAttribute('onclick',`open_FetchUserReadStatus('${status}')`);
        document.getElementById('action.status').setAttribute('status',`${status}`);
        document.getElementById('action.status').innerHTML = (`
        <i class="icon w-20" icon-name="${readstatus_icon[status]}" stroke-width="2.5" style="top: -2px !important; margin-right: 5px;"></i> ${TranslateString(`READ_${status.toUpperCase()}`)}
        `);

        lucide.createIcons();
    }


    // send
    xhr.send(JSON.stringify({
        status: status
    }));
}

// exit window
function exit_FetchUserReadStatus() {
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
        <a role="button" class="button" onclick="exit_FetchUserReadStatus()">Continue</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
}

// following manga?
function FetchUserFollowing() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/user/follows/manga/${manga}`;
    xhr.open('GET',url,true);
    xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);


    // on request
    xhr.onload = function() {
        if (xhr.status == 404) {
            // not following

            DisplayUserFollowing(false);
        } else {
            // following

            DisplayUserFollowing(true);
        }
    }


    // send
    xhr.send();
}

/**
 * Display the user's following status
 * @param {string} status 
 */
function DisplayUserFollowing(status) {
    if (status == false) {
        // User is not following

        document.getElementById('action.following').setAttribute('onclick',`open_following(false)`);
        document.getElementById('attr.follows').setAttribute('onclick',`open_following(false)`);
        document.getElementById('action.following').classList.remove('focus');
        document.getElementById('action.following').innerHTML = (`
        <i class="icon w-22" icon-name="bookmark-plus" stroke-width="2.5" style="top: -1px !important;"></i>
        `);
    } else {
        // User is following
        
        document.getElementById('action.following').setAttribute('onclick',`open_following(true)`);
        document.getElementById('attr.follows').setAttribute('onclick',`open_following(true)`);
        document.getElementById('action.following').classList.add('focus');
        document.getElementById('action.following').innerHTML = (`
        <i class="icon w-22" icon-name="bookmark" stroke-width="2.5" style="top: -1px !important;"></i>
        `);
    }

    lucide.createIcons();
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
            <a role="button" class="button" onclick="exit_FetchUserReadStatus()">Cancel</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    lucide.createIcons();

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
        xhr.open('POST',url,true);
    } else {
        xhr.open('DELETE',url,true);
    }
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    xhr.onload = function() {
        if (status == 'follow') {
            log('enabled',`You are now following!`,false);
            DisplayUserFollowing(true);
        } else {
            log('disabled',`You are no longer following`,false);
            DisplayUserFollowing(false);
        }
        // clear window
        document.getElementById('window_parent').innerHTML = ``;
    }

    // send
    xhr.send();
}

// get statistics
function FetchMangaStatistics() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/statistics/manga/${manga}`;
    xhr.open('GET',url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    xhr.onload = function() {
        const data = JSON.parse(this.response);
        rating_dist = data.statistics[`${manga}`].rating.distribution;
        rating_average = data.statistics[`${manga}`].rating.average.toFixed(2);

        // rating
        document.getElementById('attr.rating').innerHTML = (`${data.statistics[`${manga}`].rating.average.toFixed(2)} <i class="icon w-18" icon-name="star" stroke-width="2.5" style="top: -2px !important"></i>`);
        // follows
        document.getElementById('attr.follows').innerHTML = (`${data.statistics[`${manga}`].follows}  <i class="icon w-18" icon-name="bookmark" stroke-width="2.5" style="top: -2px !important"></i>`);

        lucide.createIcons();
    }

    // send
    xhr.send();
}

// open rating distribution window
function view_rating() {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','rating_window');

    em_window.innerHTML = (`
    <div class="cover"><img src="${cover_art}"></div>
        <div class="header" style="text-align: center;"><h4>User rating</h4></div>
    `);

    // info
    let em_info = document.createElement('div');
    em_info.classList.add('info');

    // distribution
    let em_dist = document.createElement('table');
    em_dist.classList.add('distribution');

    // get highest rating
    let max_rating = 0;
    for (let i in rating_dist) {
        if (rating_dist[i] > max_rating) {
            max_rating = rating_dist[i]
        }
    }

    // calculate
    for (let i in rating_dist) {
        let rating_init = rating_dist[i] / max_rating;
        let rating = rating_init * 360;

        let em_bar = document.createElement('tr');
        em_bar.innerHTML = (`
        <td class="rating-type">${i}</td>
        <td class="rating-bar"><span class="bar" style="width: 360px;"><span class="fill" style="width: ${rating}px;"></span></span></td>
        <td class="rating-count"><strong class="text-14">${rating_dist[i]} <i class="icon w-14" icon-name="star" stroke-width="2.5" style="top: -2px !important"></i></strong></td>
        `);

        // append
        em_dist.appendChild(em_bar);
    }

    // average rating
    let em_avg = document.createElement('p');
    em_avg.classList.add('rating');
    em_avg.style = 'text-align: center;';
    em_avg.innerHTML = (`${rating_average} <i class="icon w-18" icon-name="star" stroke-width="2.5" style="top: -2px !important"></i>`);

    // actions
    let em_actions = document.createElement('div');
    em_actions.classList.add('actions');
    em_actions.innerHTML = (`<a role="button" class="button focus" onclick="exit_FetchUserReadStatus()">Done</a>`);

    // append
    em_info.appendChild(em_avg);
    em_info.appendChild(em_dist);
    em_window.appendChild(em_info);
    em_window.appendChild(em_actions);
    document.getElementById('window_parent').appendChild(em_window);
    lucide.createIcons();
}

// more options menu
function more_options() {
    document.getElementById('action.more_menu').classList.toggle('shown');
}

// get user rating
function FetchUserRating() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/rating/?manga[]=${manga}`;
    xhr.open('GET',url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    xhr.onload = function() {
        const data = JSON.parse(this.response);

        user_rating = data.ratings[`${manga}`].rating;
    }

    // send
    xhr.send();
}

// TODO: - add case for if user has not rated ^
// TODO: - make frontend for leaving user rating

// open set rating window
function open_rating_window(rating) {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','following_window');

    em_window.innerHTML = (`
    <div class="cover"><img src="${cover_art}"></div>
        <div class="header" style="text-align: center;"><h4>Rate manga</h4></div>
        <div class="info" style="text-align: center;">
            <p>How would you rate this manga from 1-10?</p>
            <div class="select">
                <select name="rating" id="rating">
                    <option value="1" id="op_1">1</option>
                    <option value="2" id="op_2">2</option>
                    <option value="3" id="op_3">3</option>
                    <option value="4" id="op_4">4</option>
                    <option value="5" id="op_5">5</option>
                    <option value="6" id="op_6">6</option>
                    <option value="7" id="op_7">7</option>
                    <option value="8" id="op_8">8</option>
                    <option value="9" id="op_9">9</option>
                    <option value="10" id="op_10">10</option>
                </select>
            </div>
        </div>
        <div class="actions">
            <a role="button" class="button focus" onclick="save_following(document.getElementById('status').value)">Save</a>
            <a role="button" class="button" onclick="exit_FetchUserReadStatus()">Cancel</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    lucide.createIcons();

    // auto-select
    document.getElementById(`op_${rating}`).setAttribute('selected','');
}

// set manga rating
function set_rating(rating) {
    // define xhr POST
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/rating/${manga}`;
    xhr.open('POST',url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    xhr.onload = function() {
        log('enabled',`Set rating as ${rating}!`,false);
    }

    // send
    xhr.send(JSON.stringify({
        "rating": rating
    }));
}

// remove manga rating
function remove_rating() {
    // define xhr DELETE
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/rating/${manga}`;
    xhr.open('DELETE',url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    xhr.onload = function() {
        log('disabled',`Removed your rating`,false);
    }

    // send
    xhr.send();
}