// tag listing


function random(min,max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

var set_title = false;

const tags = {
    0: 'b29d6a3d-1569-4e7a-8caf-7557bc92cd5d',
    1: '97893a4c-12af-4dac-b6be-0dffb353568e',
    2: '391b0423-d847-456f-aff0-8b0cfc03066b',
    3: '87cc87cd-a395-47af-b27a-93258283bbc6',
    4: '5920b825-4181-4a17-beeb-9918b0ff7a30',
    5: '4d32cc48-9f00-4cca-9b5a-a839f0764984',
    6: '5ca48985-9a9d-4bd8-be29-80dc0303db72',
    7: 'b9af3a63-f058-46de-a9a0-e0c13906197a',
    8: 'cdc58593-87dd-415e-bbc0-2ec27bf404cc',
    9: 'a3c67850-4684-404e-9b7f-c69850ee5da6',
    10: '33771934-028e-4cb3-8744-691e866a923e',
    11: 'cdad7e68-1419-41dd-bdce-27753074a640',
    12: 'ace04997-f6bd-436e-b261-779182193d3d',
    13: '81c836c9-914a-4eca-981a-560dad663e73',
    14: '50880a9d-5440-4732-9afb-8f457127e836',
    15: 'c8cbe35b-1b2b-4a3f-9c37-db84c4514856',
    16: 'ee968100-4191-4968-93d3-f82d72be7e46',
    17: 'b1e97889-25b4-4258-b28b-cd7f4d28ea9b',
    18: '3b60b75c-a2d7-4860-ab56-05f391bb889c',
    19: '423e2eae-a7a2-4a8b-ac03-a8351462d71d',
    20: '256c8bd9-4904-4360-bf4f-508a76d67183',
    21: 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9',
    22: '69964a64-2f90-4d33-beeb-f3ed2875eb4c',
    23: '7064a261-a137-4d3a-8848-2d385de3a99c',
    24: '07251805-a27e-4d59-b488-f0bfbec15168',
    25: 'f8f62932-27da-4fe4-8ee1-6779a8c5edba',
    26: 'acc803a4-c95a-4c22-86fc-eb6b582d82a2',
    27: 'e64f6742-c834-471d-8d72-dd51fc02b835',
    28: '3de8c75d-8ee3-48ff-98ee-e20a65c86451',
    29: 'ea2bc92d-1c26-4930-9b7c-d5c0dc1b6869',
    30: '9ab53f92-3eed-4e9b-903a-917c86035ee3',
    31: 'da2d50ca-3018-4cc0-ac7a-6b7d472a29ea',
    32: '39730448-9a5f-48a2-85b0-a70db87b1233',
    33: '2bd2e8d0-f146-434a-9b51-fc9ff2c5fe6a',
    34: '3bb26d85-09d5-4d2e-880c-c34b974339e9',
    35: 'fad12b5e-68ba-460e-b933-9ae8318f5b65',
    36: 'aafb99c1-7f60-43fa-b75f-fc9502ce29c7',
    37: '5bd0e105-4481-44ca-b6e7-7544da56b1a3',
    38: '2d1f5d56-a1e5-4d0d-a961-2193588b08ec',
    39: '85daba54-a71c-4554-8a28-9901a8b0afad',
    40: 'a1f53773-c69a-4ce5-8cab-fffcd90b1565',
    41: '799c202e-7daa-44eb-9cf7-8a3c0441531e',
    42: 'ac72833b-c4e9-4878-b9db-6c8a4a99444a',
    43: 'dd1f77c5-dea9-4e2b-97ae-224af09caf99',
    44: '36fd93ea-e8b8-445e-b836-358f02b3d33d',
    45: 'f42fbf9e-188a-447b-9fdc-f19dc1e4d685',
    46: '489dd859-9b61-4c37-af75-5b18e88daafc',
    47: '92d6d951-ca5e-429c-ac78-451071cbf064',
    48: 'df33b754-73a3-4c54-80e6-1a74a8058539',
    49: '9467335a-1b83-4497-9231-765337a00b96',
    50: '0bc90acb-ccc1-44ca-a34a-b9f3a73259d0',
    51: '65761a2a-415e-47f3-bef2-a9dababba7a6',
    52: '81183756-1453-4c81-aa9e-f6e1b63be016',
    53: 'caaa44eb-cd40-4177-b930-79d3ef2afe87',
    54: 'ddefd648-5140-4e5f-ba18-4eca4071d19b',
    55: 'eabc5b4c-6aff-42f3-b657-3e90cbd00b75',
    56: '5fff9cde-849c-4d78-aab0-0d52b2ee1d25',
    57: '292e862b-2d17-4062-90a2-0356caa4ae27',
    58: '31932a7e-5b8e-49a6-9f12-2afa39dc544c',
    59: 'd7d1730f-6eb0-4ba6-9437-602cac38664c',
    60: '9438db5a-7e2a-4ac0-b39e-e0d95a34b8a8',
    61: 'd14322ac-4d6f-4e9b-afd9-629d5f4d8a41',
    62: '8c86611e-fab7-4986-9dec-d1a2f44acdd5',
    63: '631ef465-9aba-4afb-b0fc-ea10efe274a8'
};

const tags_string = {
    'b29d6a3d-1569-4e7a-8caf-7557bc92cd5d': 'Gore',
    '97893a4c-12af-4dac-b6be-0dffb353568e': 'Sexual Violence',
    '391b0423-d847-456f-aff0-8b0cfc03066b': 'Action',
    '87cc87cd-a395-47af-b27a-93258283bbc6': 'Adventure',
    '5920b825-4181-4a17-beeb-9918b0ff7a30': 'Boys\' Love',
    '4d32cc48-9f00-4cca-9b5a-a839f0764984': 'Comedy',
    '5ca48985-9a9d-4bd8-be29-80dc0303db72': 'Crime',
    'b9af3a63-f058-46de-a9a0-e0c13906197a': 'Drama',
    'cdc58593-87dd-415e-bbc0-2ec27bf404cc': 'Fantasy',
    'a3c67850-4684-404e-9b7f-c69850ee5da6': 'Girls\' Love',
    '33771934-028e-4cb3-8744-691e866a923e': 'Historical',
    'cdad7e68-1419-41dd-bdce-27753074a640': 'Horror',
    'ace04997-f6bd-436e-b261-779182193d3d': 'Isekai',
    '81c836c9-914a-4eca-981a-560dad663e73': 'Magical Girls',
    '50880a9d-5440-4732-9afb-8f457127e836': 'Mecha',
    'c8cbe35b-1b2b-4a3f-9c37-db84c4514856': 'Medical',
    'ee968100-4191-4968-93d3-f82d72be7e46': 'Mystery',
    'b1e97889-25b4-4258-b28b-cd7f4d28ea9b': 'Philosophical',
    '3b60b75c-a2d7-4860-ab56-05f391bb889c': 'Psychological',
    '423e2eae-a7a2-4a8b-ac03-a8351462d71d': 'Romance',
    '256c8bd9-4904-4360-bf4f-508a76d67183': 'Sci-Fi',
    'e5301a23-ebd9-49dd-a0cb-2add944c7fe9': 'Slice of Life',
    '69964a64-2f90-4d33-beeb-f3ed2875eb4c': 'Sports',
    '7064a261-a137-4d3a-8848-2d385de3a99c': 'Superhero',
    '07251805-a27e-4d59-b488-f0bfbec15168': 'Thriller',
    'f8f62932-27da-4fe4-8ee1-6779a8c5edba': 'Tragedy',
    'acc803a4-c95a-4c22-86fc-eb6b582d82a2': 'Wuxia',
    'e64f6742-c834-471d-8d72-dd51fc02b835': 'Aliens',
    '3de8c75d-8ee3-48ff-98ee-e20a65c86451': 'Animals',
    'ea2bc92d-1c26-4930-9b7c-d5c0dc1b6869': 'Cooking',
    '9ab53f92-3eed-4e9b-903a-917c86035ee3': 'Crossdressing',
    'da2d50ca-3018-4cc0-ac7a-6b7d472a29ea': 'Delinquents',
    '39730448-9a5f-48a2-85b0-a70db87b1233': 'Demons',
    '2bd2e8d0-f146-434a-9b51-fc9ff2c5fe6a': 'Genderswap',
    '3bb26d85-09d5-4d2e-880c-c34b974339e9': 'Ghosts',
    'fad12b5e-68ba-460e-b933-9ae8318f5b65': 'Gyaru',
    'aafb99c1-7f60-43fa-b75f-fc9502ce29c7': 'Harem',
    '5bd0e105-4481-44ca-b6e7-7544da56b1a3': 'Incest',
    '2d1f5d56-a1e5-4d0d-a961-2193588b08ec': 'Loli',
    '85daba54-a71c-4554-8a28-9901a8b0afad': 'Mafia',
    'a1f53773-c69a-4ce5-8cab-fffcd90b1565': 'Magic',
    '799c202e-7daa-44eb-9cf7-8a3c0441531e': 'Martial Arts',
    'ac72833b-c4e9-4878-b9db-6c8a4a99444a': 'Military',
    'dd1f77c5-dea9-4e2b-97ae-224af09caf99': 'Monster Girls',
    '36fd93ea-e8b8-445e-b836-358f02b3d33d': 'Monsters',
    'f42fbf9e-188a-447b-9fdc-f19dc1e4d685': 'Music',
    '489dd859-9b61-4c37-af75-5b18e88daafc': 'Ninja',
    '92d6d951-ca5e-429c-ac78-451071cbf064': 'Office Workers',
    'df33b754-73a3-4c54-80e6-1a74a8058539': 'Police',
    '9467335a-1b83-4497-9231-765337a00b96': 'Post-Apocalyptic',
    '0bc90acb-ccc1-44ca-a34a-b9f3a73259d0': 'Reincarnation',
    '65761a2a-415e-47f3-bef2-a9dababba7a6': 'Reverse Harem',
    '81183756-1453-4c81-aa9e-f6e1b63be016': 'Samurai',
    'caaa44eb-cd40-4177-b930-79d3ef2afe87': 'School Life',
    'ddefd648-5140-4e5f-ba18-4eca4071d19b': 'Shota',
    'eabc5b4c-6aff-42f3-b657-3e90cbd00b75': 'Supernatural',
    '5fff9cde-849c-4d78-aab0-0d52b2ee1d25': 'Survival',
    '292e862b-2d17-4062-90a2-0356caa4ae27': 'Time Travel',
    '31932a7e-5b8e-49a6-9f12-2afa39dc544c': 'Traditional Games',
    'd7d1730f-6eb0-4ba6-9437-602cac38664c': 'Vampires',
    '9438db5a-7e2a-4ac0-b39e-e0d95a34b8a8': 'Video Games',
    'd14322ac-4d6f-4e9b-afd9-629d5f4d8a41': 'Villainess',
    '8c86611e-fab7-4986-9dec-d1a2f44acdd5': 'Virtual Reality',
    '631ef465-9aba-4afb-b0fc-ea10efe274a8': 'Zombies'
};

// pass tag request
const search = window.location.search;
const query = new URLSearchParams(search);
let tag_req = query.get('t') || "";
if (tag_req == "") {
    tag_req = tags[random(0,63)];
    console.log(tag_req)
}

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

// get content rating
let rating_suggestive = "";
if (localStorage.getItem('op_show_suggestive') == 1) {
    rating_suggestive = '&contentRating[]=suggestive';
}
let rating_explicit = "";
if (localStorage.getItem('op_show_explicit') == 1) {
    rating_explicit = '&contentRating[]=explicit';
}
let rating_nsfw = "";
if (localStorage.getItem('op_show_nsfw') == 1) {
    rating_nsfw = '&contentRating[]=pornographic';
}

var limit = 18;
var offset = 0;
var top_limit = 3600;

load_page();

function load_page() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga?includedTags[]=${tag_req}&includes[]=cover_art&contentRating[]=safe${rating_suggestive}${rating_explicit}${rating_nsfw}&limit=${limit}&offset=${offset}`;
    xhr.open('GET', url, true);

    // on request
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        document.getElementById('feed').innerHTML = ``;

        document.getElementById('tag_msg').innerHTML = `Viewing manga tagged with <label class="tag">${tags_string[tag_req]}</label>`;

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
            // get manga id
            var manga = data.data[i].id;

            get_relationships(this.response,manga,i);
        }
    }

    // send
    xhr.send();
}

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
    <img src="${cover_art_url}" id="${manga}_cover" alt="Cover art">
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
    <h4 class="text-20">${data.data[i].attributes.title.en}</h4>
    <div class="desc-cont text-16">${html}</div>
    <label class="tag ${data.data[i].attributes.contentRating}" style="margin-left: 0;"><i class="icon w-16" data-feather="${tags_icon[`${data.data[i].attributes.contentRating}`]}" style="margin-right: 3px; top: -1.3px !important;"></i>${rating}</label>
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