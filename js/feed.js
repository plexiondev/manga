// home feed
// requires auth via auth.js


const contentrating_string = {
    'safe': 'Safe',
    'suggestive': 'Suggestive',
    'erotica': 'Erotica',
    'pornographic': 'NSFW'
}

// tags
const tags_icon = {
    'safe': 'check',
    'suggestive': 'alert-circle',
    'erotica': 'alert-circle',
    'pornographic': 'alert-octagon'
}

// define xhr GET
const xhr = new XMLHttpRequest();
const url = `https://api.mangadex.org/user/follows/manga/?includes[]=cover_art&limit=16`;
xhr.open('GET', url, true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);

// on request
xhr.onload = function() {
    const data = JSON.parse(this.response);
    
    for (let i in data.data) {
        // get manga id
        var manga = data.data[i].id;
            
        get_relationships(this.response,manga,i);
    }
}

// send
xhr.send();

function get_relationships(data_pass,manga_pass,i) {

    log('search',`Retrieving relationships..`,true);

    // parse
    const data_raw = data_pass;
    const data = JSON.parse(data_pass);
    var manga = manga_pass;

    // relationships
    let relationships = data.data[i].relationships;
    for (let i in relationships) {
        if (relationships[i].type == "cover_art") {
            // cover art

            // create url
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${relationships[i].attributes.fileName}`;

            create_em(data_raw,cover_url,manga);
        }
    }
}

function create_em(data_pass,cover_url_pass,manga_pass) {

    const data = JSON.parse(data_pass);
    var cover_art_url = cover_url_pass;
    var i = localStorage.getItem("i");
    var manga = manga_pass;

    // create element
    let card = document.createElement('a');
    card.classList.add('manga-card');

    // links
    card.href = `view.html?m=${manga}`;

    // content rating
    try {
        var rating = contentrating_string[data.data[i].attributes.contentRating];
    } catch(error) {
        var rating = `${data.data[i].attributes.contentRating}`;
    }

    // html
    log('general',`Created ${i}!`,true);
    card.innerHTML = (`
    <div class="cover">
    <img src="${cover_art_url}" id="${manga}_cover" alt="Cover art">
    </div>
    `);

    // info
    let em_info = document.createElement('div');
    em_info.classList.add('info');
    em_info.innerHTML = (`
    <h4 class="text-20">${data.data[i].attributes.title.en}</h4>
    <p class="text-16">${data.data[i].attributes.description.en}</p>
    <label class="tag ${data.data[i].attributes.contentRating}" style="margin-left: 0;"><i class="icon w-16" data-feather="${tags_icon[`${data.data[i].attributes.contentRating}`]}" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}</label>
    `);

    // tags
    let tags = data.data[i].attributes.tags;
    for (let i in tags) {
        // create element
        let tag = document.createElement('label');
        tag.classList.add('tag',`${(tags[i].attributes.name.en).replaceAll(' ','_')}`);

        // text
        tag.textContent = `${tags[i].attributes.name.en}`;

        // append
        em_info.appendChild(tag);
    }

    // append
    card.appendChild(em_info);
    document.getElementById('feed').appendChild(card);

    feather.replace();
}