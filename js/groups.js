// groups listing


// define xhr GET
const xhr = new XMLHttpRequest();
const url = `https://api.mangadex.org/group?limit=18`;
xhr.open('GET', url, true);

// on request
xhr.onload = function() {
    const data = JSON.parse(this.response);
    
    for (let i in data.data) {
        create_em(this.response,i);
    }
}

// send
xhr.send();

function create_em(data_pass,i) {

    const data = JSON.parse(data_pass);

    // create element
    let card = document.createElement('a');
    card.classList.add('manga-card');

    // links
    card.href = `https://mangadex.org/group/${data.data[i].id}`;

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
    <h5>${data.data[i].attributes.name}</h5>
    </div>
    `);

    // append
    document.getElementById('feed').appendChild(card);

    feather.replace();
}