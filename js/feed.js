// home feed
// requires auth via auth.js


// define xhr GET
const xhr = new XMLHttpRequest();
const url = `https://api.mangadex.org/user/follows/manga/feed?limit=16`;
xhr.open('GET', url, true);
xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);

// on request
xhr.onload = function() {
    const data = JSON.parse(this.response);
    console.log(data);

    for (let i in data.data) {
        // create element
        let card = document.createElement('a');
        card.classList.add('manga-card');
        card.style.margin = '0';

        // link
        card.href = `view.html?m=${data.data[i].id}`;

        // text
        card.innerHTML = (`
        <div class="info">
        <h4 class="text-20">${data.data[i].attributes.title}</h4>
        </div>
        `);

        // append
        document.getElementById('feed').appendChild(card);
    }
}

// send
xhr.send();