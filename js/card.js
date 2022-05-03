// create generic manga cards


function get_relationships(data_pass,manga_pass,i) {

    log('search',`Retrieving relationships..`,true);

    // parse
    const data_raw = data_pass;
    const data = JSON.parse(data_pass);
    var manga = manga_pass;

    // relationships
    let relationships = data.data[i].relationships;
    for (let n in relationships) {
        if (relationships[n].type == "cover_art") {
            // cover art

            // create url
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${relationships[n].attributes.fileName}`;

            create_em(data_raw,cover_url,manga,i);
        }
    }
}

function create_em(data_pass,cover_url_pass,manga_pass,i) {

    const data = JSON.parse(data_pass);
    var cover_art_url = cover_url_pass;
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
    <span class="cover-inner">
    <img src="${cover_art_url}" id="${manga}_cover" alt="Cover art">
    </span>
    </div>
    `);

    // description
    var converter = new showdown.Converter();
    text = `${data.data[i].attributes.description.en}`;
    if (text == 'undefined') { text = '' }
    html = converter.makeHtml(text);

    // info
    let em_info = document.createElement('div');
    em_info.classList.add('info');
    em_info.innerHTML = (`
    <h4 class="text-18 truncate">${data.data[i].attributes.title.en}</h4>
    <div class="desc-cont text-16">${html}</div>
    <label class="tag ${data.data[i].attributes.contentRating}" style="margin-left: 0;"><i class="icon w-16" data-feather="${tags_icon[`${data.data[i].attributes.contentRating}`]}" stroke-width="2.5" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}</label>
    `);

    // tags
    let tags = data.data[i].attributes.tags;
    for (let i in tags) {
        if (i < 2) {
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
    if ((data.data[i].attributes.contentRating == 'suggestive' && localStorage.getItem('op_show_suggestive') == 1) || (data.data[i].attributes.contentRating == 'erotica' && localStorage.getItem('op_show_erotica') == 1) || (data.data[i].attributes.contentRating == 'pornographic' && localStorage.getItem('op_show_nsfw') == 1) || (data.data[i].attributes.contentRating == 'safe')) {
        document.getElementById('feed').appendChild(card);
    }

    feather.replace();
}