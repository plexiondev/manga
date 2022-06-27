// create generic manga cards


// get content rating
let rating_suggestive = "";
if (localStorage.getItem('op_show_suggestive') == 1) rating_suggestive = '&contentRating[]=suggestive';
let rating_explicit = "";
if (localStorage.getItem('op_show_explicit') == 1) rating_explicit = '&contentRating[]=explicit';
let rating_nsfw = "";
if (localStorage.getItem('op_show_nsfw') == 1) rating_nsfw = '&contentRating[]=pornographic';

/**
 * generate cover art for manga
 * @param {string} data current manga data from API
 * @param {string} manga_pass manga ID
 * @param {string} append element ID to append card to
 * @param {boolean} minimal display as minimal/cover-only cards?
 */
function get_relationships(data,manga_pass,append,minimal = false) {

    log('search',`Retrieving relationships..`,true);

    // parse
    var manga = manga_pass;

    // relationships
    let relationships = data.relationships;
    for (let n in relationships) {
        if (relationships[n].type == "cover_art") {
            // cover art

            // create url
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${relationships[n].attributes.fileName}`;

            create_em(data,cover_url,manga,append,minimal);
        }
    }
}

/**
 * generate card for manga
 * @param {string} data current manga data from API
 * @param {string} cover_url_pass direct URL to cover on MangaDex
 * @param {string} manga_pass manga ID
 * @param {string} append element ID to append card to
 * @param {boolean} minimal display as minimal/cover-only cards?
 */
function create_em(data,cover_url_pass,manga_pass,append,minimal) {

    var cover_art_url = cover_url_pass;
    var manga = manga_pass;

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
    <img src="${cover_art_url}" id="${manga}_cover" alt="Cover art">
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
        <h4 class="text-16">${data.attributes.title.en}</h4>
        <label class="badge ${data.attributes.contentRating}" style="margin-left: 0;">${rating}</label>
        `); 
    } else {
        em_info.innerHTML = (`
        <h4 class="text-18 truncate">${data.attributes.title.en}</h4>
        <div class="desc-cont text-16">${html}</div>
        <label class="tag ${data.attributes.contentRating}" style="margin-left: 0;"><i class="icon w-16" icon-name="${tags_icon[`${data.attributes.contentRating}`]}" stroke-width="2.5" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}</label>
        `);
    }

    // tags
    let tags = data.attributes.tags;
    for (let i in tags) {
        if (i < 2 && !minimal) {
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
        (data.attributes.contentRating == 'suggestive' && localStorage.getItem('op_show_suggestive') == 1)
        || (data.attributes.contentRating == 'erotica' && localStorage.getItem('op_show_erotica') == 1)
        || (data.attributes.contentRating == 'pornographic' && localStorage.getItem('op_show_nsfw') == 1)
        || (data.attributes.contentRating == 'safe')) {
        document.getElementById(`${append}`).appendChild(card);
    }

    lucide.createIcons();
}