// home feed
// requires auth via auth.js


// define xhr GET
const xhr = new XMLHttpRequest();
const url = `https://api.mangadex.org/user/follows/manga/feed`;
xhr.open('GET', url, true);

// on request
xhr.onload = function() {
    const data = JSON.parse(this.response);
    console.log(data);

    for (let i in data) {

    }
}

// send
xhr.send();