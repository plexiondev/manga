// create generic manga cards


const MAX_TAGS = 2;

const contentrating_string = {
    'safe': 'Safe',
    'suggestive': 'Suggestive',
    'erotica': 'Erotica',
    'pornographic': 'NSFW'
}

// get content rating
let rating_suggestive = '';
if (setting('show_suggestive')) rating_suggestive = '&contentRating[]=suggestive';
let rating_explicit = '';
if (setting('show_erotica')) rating_explicit = '&contentRating[]=erotica';
let rating_nsfw = '';
if (setting('show_nsfw')) rating_nsfw = '&contentRating[]=pornographic';

/**
 * generate cover art for manga
 * @param {string} data current manga data from API
 * @param {string} manga manga ID
 * @param {string} append element ID to append card to
 * @param {boolean} minimal display as minimal/cover-only cards?
 */
function generate_card(data,manga,append,minimal = false,index = -1) {
    for (let i in data.relationships) {
        if (data.relationships[i].type == "cover_art") {
            //var cover_url = generate_image(data.relationships[i].attributes.fileName,manga);
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${data.relationships[i].attributes.fileName}`;
            try {
                if (index == 0) document.getElementById('img.background').style = `background-image: url(${cover_url})`;
            } catch(e) {}

            create_em(data,cover_url,manga,append,minimal);
        }
    }
}

/**
 * generate card for manga
 * @param {string} data current manga data from API
 * @param {string} cover_art_url direct URL to cover on MangaDex
 * @param {string} manga manga ID
 * @param {string} append element ID to append card to
 * @param {boolean} minimal display as minimal/cover-only cards?
 */
function create_em(data,cover_art_url,manga,append,minimal) {

    // create element
    let card = document.createElement('a');
    if (minimal) {
        card.classList.add('min-manga-card');
    } else {
        card.classList.add('manga-card');
    }

    // links
    card.href = `view.html?m=${manga}`;

    // content rating
    try {
        var rating = contentrating_string[data.attributes.contentRating];
    } catch(error) {
        var rating = `${data.attributes.contentRating}`;
    }

    // html
    card.innerHTML = (`
    <div class="cover">
    <span class="cover-inner">
    <img rel="preload" src="${cover_art_url}" id="${manga}_cover" alt="Cover art">
    </span>
    </div>
    `);

    // description
    var converter = new showdown.Converter();
    text = `${data.attributes.description.en}`;
    if (text == 'undefined') text = '';
    html = converter.makeHtml(text);

    // info
    let em_info = document.createElement('div');
    em_info.classList.add('info');
    if (minimal) {
        em_info.innerHTML = (`
        <h4 class="text-16 truncate-2">${parse_title(data.attributes.title)}</h4>
        <label class="badge ${data.attributes.contentRating}" style="margin-left: 0;">${rating}</label>
        `); 
    } else {
        em_info.innerHTML = (`
        <h4 class="text-18 truncate">${parse_title(data.attributes.title)}</h4>
        <div class="desc-cont text-16">${html}</div>
        <label class="tag ${data.attributes.contentRating}" style="margin-left: 0;"><i class="icon w-16" icon-name="${tags_icon[`${data.attributes.contentRating}`]}" stroke-width="2.5" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}</label>
        `);
    }

    // tags
    let tags = data.attributes.tags;
    for (let i in tags) {
        if (i < MAX_TAGS && !minimal) {
            // create element
            let tag = document.createElement('label');
            tag.classList.add('tag',`${(tags[i].attributes.name.en).replaceAll(' ','_')}`);

            // text
            tag.textContent = `${tags[i].attributes.name.en}`;

            // append
            em_info.appendChild(tag);
        }
    }

    // append
    card.appendChild(em_info);
    if (
        (data.attributes.contentRating == 'suggestive' && setting('show_suggestive'))
        || (data.attributes.contentRating == 'erotica' && setting('show_erotica'))
        || (data.attributes.contentRating == 'pornographic' && setting('show_nsfw'))
        || (data.attributes.contentRating == 'safe')) {
        document.getElementById(`${append}`).appendChild(card);
    }

    lucide.createIcons();
}