// home feed
// requires auth via auth.js


var limit = 24;
var offset = 0;
var top_limit = 120;

feed_ready();

function feed_ready() {
    if (authorised == 1) {
        load_page();
    } else {
        window.setTimeout(feed_ready,200);
    }
}

// tags
const tags_icon = {
    'safe': 'check',
    'suggestive': 'alert-circle',
    'erotica': 'alert-circle',
    'pornographic': 'alert-octagon'
}

function load_page() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/user/follows/manga/?includes[]=cover_art&includes[]=author&includes[]=artist&limit=${limit}&offset=${offset}`;
    xhr.open('GET',url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    // on request
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        document.getElementById('feed').innerHTML = ``;

        // reset total
        if (top_limit > data.total) {
            top_limit = data.total;
        }

        // calculate total
        var total = Math.round(data.total / limit); // 21418 = 1189
        var page = Math.round(offset / limit); // 18 = 1
        var top_limit_round = Math.round(top_limit / limit); // 3600 = 200

        // pages
        document.getElementById('advance_pages').innerHTML =
        (`
        <button class="page-num left" onclick="set_page(0)">1</button>
        <button class="page-num" onclick="set_page(${offset-limit})">${page-1}</button>
        <button class="page-num current" onclick="set_page(${offset})">${page}</button>
        <button class="page-num" onclick="set_page(${offset+limit})">${page+1}</button>
        <button class="page-num right" onclick="set_page(${top_limit})">${top_limit_round}</button>
        `);
        
        for (let i in data.data) {
            // get manga id
            var manga = data.data[i].id;
            
            generate_card(data.data[i],manga,'feed',true,i);
        }
    }

    // send
    xhr.send();
}