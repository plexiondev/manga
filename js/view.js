// view manga page


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
            // create url
            var cover_url = `https://uploads.mangadex.org/covers/${manga}/${relationships[i].attributes.fileName}`;

            // expose on page
            em_mangabg.style = `background-image: url(${cover_url});`;
            em_mangaimg.src = `${cover_url}`;
        } else if (relationships[i].type == "author") {
            let em_author = document.getElementById("manga-author");
            em_author.href = `https://mangadex.org/author/${relationships[i].id}`;
            em_author.innerHTML = `<h5 class="text-16">${relationships[i].attributes.name}</h5>`;
        } else if (relationships[i].type == "artist") {
            let em_artist = document.getElementById("manga-artist");
            em_artist.href = `https://mangadex.org/author/${relationships[i].id}`;
            em_artist.innerHTML = `<h5 class="text-16">${relationships[i].attributes.name}</h5>`;
        } else if (relationships[i].type == "manga") {
            // create element
            let related_card = document.createElement('a');
            related_card.classList.add('manga-card');
            related_card.style.margin = '0';

            // link
            related_card.href = `view.html?m=${relationships[i].id}`;

            // how related
            if (relationships[i].related == "based_on") {
                var relationship = 'Original';
            } else if (relationships[i].related == "doujinshi") {
                var relationship = 'Doujinshi';
            } else if (relationships[i].related == "sequel") {
                var relationship = 'Sequel';
            } else if (relationships[i].related == "adapted_from") {
                var relationship = 'Original';
            } else if (relationships[i].related == "side_story") {
                var relationship = 'Side Story';
            } else if (relationships[i].related == "prequel") {
                var relationship = 'Prequel';
            } else if (relationships[i].related == "spin_off") {
                var relationship = 'Spin-off';
            } else if (relationships[i].related == "shared_universe") {
                var relationship = 'Shared universe';
            } else {
                var relationship = `${relationships[i].related}`;
            }

            // content rating
            if (relationships[i].attributes.contentRating == "safe") {
                var rating = 'Safe';
            } else if (relationships[i].attributes.contentRating == "suggestive") {
                var rating = 'Suggestive';
            } else if (relationships[i].attributes.contentRating == "erotica") {
                var rating = 'Erotica';
            } else if (relationships[i].attributes.contentRating == "pornographic") {
                var rating = 'NSFW';
            } else {
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
            <label class="tag">${rating}</label>
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
        tag.classList.add('tag');

        // text
        tag.textContent = `${tags[i].attributes.name.en}`;

        em_tags.appendChild(tag);
    }
}