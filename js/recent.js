// recent updates


get_updates();

function get_updates() {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/?includes[]=cover_art&order[createdAt]=desc&limit=8&contentRating[]=safe${rating_suggestive}${rating_explicit}${rating_nsfw}`;
    xhr.open('GET',url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    // on request
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        
        for (let i in data.data) {
            generate_card(data.data[i],data.data[i].id,'recent',true,i);
        }
    }

    // send
    xhr.send();
}