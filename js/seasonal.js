// seasonal manga
// fetched from official MangaDex account's latest list


const mangadex_user = 'd2ae45e0-b5e2-4e7f-a688-17925c2d7d6b';

get_lists();
let list = [];

function get_lists() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/user/${mangadex_user}/list`;
    xhr.open('GET',url,true);

    // on request
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        document.getElementById('seasonal').innerHTML = ``;
        document.getElementById('seasonal.href').href = `list.html?l=${data.data[0].id}`;
        document.getElementById('attr.seasonal_time').textContent = data.data[0].attributes.name.replace('Seasonal: ','');

        for (let i in data.data[0].relationships) {
            if (data.data[0].relationships[i].type == 'manga') list.push(data.data[0].relationships[i].id);
        }

        // save seasonal list locally
        localStorage.setItem('seasonal',JSON.stringify(list));

        get_seasonal(list);
    }

    // send
    xhr.send();
}

/**
 * get seasonal manga IDs
 * @param {string} list the first list's manga IDs
 */
function get_seasonal(list) {
    // append each ID to query
    let append_list = '';
    for (let i in list) {
        append_list = `${append_list}&ids[]=${list[i]}`;
    }

    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga?limit=3&order[followedCount]=desc&includes[]=cover_art&includes[]=author&includes[]=artist&contentRating[]=safe${rating_suggestive}${rating_explicit}${rating_nsfw}${append_list}`;
    xhr.open('GET',url,true);

    // on request
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        
        for (let i in data.data) {
            // get manga id
            var manga = data.data[i].id;
            
            generate_card(data.data[i],manga,'seasonal',false,i);
        }
    }

    // send
    xhr.send();
}