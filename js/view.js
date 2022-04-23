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

// pass manga id from url
const search = window.location.search;
const query = new URLSearchParams(search);
let manga = query.get('m')
// has user read before?
let chapter = localStorage.getItem("chapter") || null;

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


// checks
if (Date.parse(now) >= Date.parse(cached_out) || cached_out == "") {
    
    // if exceeded cache
    console.log("[ C ] sending request - no cache present or reached timeout");
    
    // do everything
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}?includes[]=author&includes[]=artist&includes[]=cover_art&includes[]=manga`;
    console.log(`[...] searching mangadex for ${manga}`);
    xhr.open('GET', url, true);


    // request is received
    xhr.onload = function() {
        console.log(`[ Y ] found ${manga} via ${url}`);

        // parse
        localStorage.setItem(`${manga}_view`, this.response);

        data_parse = JSON.parse(this.response)

        get_general(this.response);
        get_relationships(this.response);
    }


    // send
    xhr.send();


    // then cache
    now = new Date(now);
    now.setMinutes ( now.getMinutes() + 120 );
    console.log(`[ C ] cached until ${now} (2h)`);
    localStorage.setItem(`${manga}_view_timeout`, now);
} else {
    console.log(`[ C ] using cached info until ${cached_out}`);
    const data = JSON.parse(localStorage.getItem(`${manga}_view`));

    get_general(localStorage.getItem(`${manga}_view`));
    get_relationships(localStorage.getItem(`${manga}_view`));

}

function get_general(data_pass) {

    console.log(`[ Y ] G: retrieving...`);

    // parse
    const data = JSON.parse(data_pass);

    // titles
    em_mangatitle.textContent = data.data.attributes.title.en;
    console.log(`[ Y ] G: title (${data.data.attributes.title.en})`);
    // page title
    let page_title = document.getElementById("page-title");
    page_title.textContent = `Viewing ${data.data.attributes.title.en}`;
    // edge-case when multiple alt titles
    for (let i in data.data.attributes.altTitles) {
        if (data.data.attributes.altTitles[i].ja != undefined) {
            em_mangajptitle.textContent = `${data.data.attributes.altTitles[i].ja}`;
            console.log(`[ Y ] G: jp title (${data.data.attributes.altTitles[i].ja})`);
            // page title
            page_title.textContent = `Viewing ${data.data.attributes.title.en} (${data.data.attributes.altTitles[i].ja})`;
        }
    }
    // desc
    var converter = new showdown.Converter();
    text = `${data.data.attributes.description.en}`;
    html = converter.makeHtml(text);
    em_mangadesc.innerHTML = `${html}`;
    console.log(`[ Y ] G: description`);

    // content rating
    try {
        var rating = contentrating_string[data.data.attributes.contentRating];
    } catch(error) {
        var rating = `${data.data.attributes.contentRating}`;
    }
    // create element
    let em_rating = document.createElement('label');
    em_rating.classList.add('tag',`${data.data.attributes.contentRating}`);
    em_rating.innerHTML = (`${rating}`);
    em_tags.appendChild(em_rating);


    // buttons
    em_mangadex.href = `https://mangadex.org/title/${manga}`;
}

function get_relationships(data_pass) {

    console.log(`[ Y ] R: retrieving...`);

    // parse
    const data = JSON.parse(data_pass);

    // relationships
    let relationships = data.data.relationships;
    for (let i in relationships) {
        console.log(`[ Y ] R: found ${relationships[i].type}`);
        if (relationships[i].type == "cover_art") {
            // cover art

            // create url
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${relationships[i].attributes.fileName}`;

            // expose on page
            em_mangabg.style = `background-image: url(${cover_url});`;
            em_mangaimg.src = `${cover_url}`;
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
        } else if (relationships[i].type == "manga") {
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
            html = converter.makeHtml(text);

            // text
            related_card.innerHTML = (`
            <div class="info">
            <h4 class="text-20">${relationships[i].attributes.title.en}</h4>
            <div class="desc-cont">${html}</div>
            <br>
            <label class="tag">${relationship}</label>
            <label class="tag ${relationships[i].attributes.contentRating}">${rating}</label>
            </div>
            `);

            // append
            document.getElementById("manga-related").appendChild(related_card);
        }
    }

    // tags
    let tags = data.data.attributes.tags;
    for (let i in tags) {
        // create element
        let tag = document.createElement('label');
        tag.classList.add('tag',`${(tags[i].attributes.name.en).replaceAll(' ','_')}`);

        // text
        tag.textContent = `${tags[i].attributes.name.en}`;

        // append
        em_tags.appendChild(tag);
    }
}