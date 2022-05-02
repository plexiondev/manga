// users listing


var limit = 30;
var offset = 0;
var top_limit = 3600;

load_page();

function load_page() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/user?limit=${limit}&offset=${offset}`;
    xhr.open('GET',url,true);

    // on request
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        document.getElementById('feed').innerHTML = ``;

        // reset total
        if (top_limit > data.total) {
            top_limit = data.total;
        }

        // calculate total
        var total = Math.round(data.total / 18); // 21418 = 1189
        var page = Math.round(offset / 18); // 18 = 1
        var top_limit_round = Math.round(top_limit / 18); // 3600 = 200

        // pages
        document.getElementById('advance_pages').innerHTML =
        (`
        <button class="page-num left" onclick="set_page(0)">1</button>
        <button class="page-num" onclick="set_page(${offset-18})">${page-1}</button>
        <button class="page-num current" onclick="set_page(${offset})">${page}</button>
        <button class="page-num" onclick="set_page(${offset+18})">${page+1}</button>
        <button class="page-num right" onclick="set_page(${top_limit})">${top_limit_round}</button>
        `);
        
        for (let i in data.data) {
            create_em(this.response,i);
        }
    }

    // send
    xhr.send();
}

function create_em(data_pass,i) {

    const data = JSON.parse(data_pass);

    // create element
    let card = document.createElement('a');
    card.classList.add('manga-card');

    // links
    card.href = `/user.html?u=${data.data[i].id}`;

    // description
    var converter = new showdown.Converter();
    text = `${data.data[i].attributes.description}`;
    if (text == 'null') { text = '' }
    html = converter.makeHtml(text);
    
    // html
    log('general',`Created ${i}!`,true);
    card.innerHTML = (`
    <div class="cover" style="height: initial;">
    <i class="icon w-24" data-feather="users"></i>
    </div>
    <div class="info" style="display: flex; align-items: center;">
    <h5>${data.data[i].attributes.username}</h5>
    </div>
    `);

    // append
    document.getElementById('feed').appendChild(card);

    feather.replace();
}

// advance pages
function advance_page(direction) {
    if (direction == 1) {
        offset += 18;
        if (offset <= 3600) {
            log('general',`Advancing forward 1 page (${offset})`,true);
            load_page();
        } else {
            offset -= 18;
        }
    } else {
        offset -= 18;
        if (offset >= 0) {
            log('general',`Advancing backward 1 page (${offset})`,true);
            load_page();
        } else {
            offset += 18;
        }
    }
}

// set page directly
function set_page(page) {
    offset_temp = offset;
    offset = page;
    if (offset >= 0 && offset <= 3600) {
        log('general',`Set page to ${offset}`,true);
        load_page();
    } else {
        offset = offset_temp;
    }
}