// control cover art caching


function generate_image(img,manga) {
    let exceeded = localStorage.getItem(`image_${img}_timeout`) || false;
    let now = new Date();

    if (Date.parse(now) >= Date.parse(exceeded) || !exceeded) {
        // create image element
        /*let image_em = document.createElement('img');
        image_em.setAttribute('id',`image_${img}`);
        image_em.width = 140;
        image_em.height = 200;
        image_em.src = `https://uploads.mangadex.org/covers/${manga}/${img}`;
        document.getElementById('images.temp').appendChild(image_em);*/

        // generate base64
        /*var image = base64(document.getElementById(`image_${img}`));*/
        var image = base64(`https://uploads.mangadex.org/covers/${manga}/${img}`);

        // cache
        localStorage.setItem(`image_${img}`,image);
        now = new Date(now);
        now.setSeconds(now.getMinutes() + 2);
        localStorage.setItem(`image_${img}_timeout`,now);

        return `data:image/jpeg;base64,${image}`;
    } else {
        return `data:image/jpeg;base64,${localStorage.getItem(`image_${img}`)}`;
    }
}


// convert to base64
function base64(img) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    var data_url = canvas.toDataURL('image/jpeg');
    return data_url.replace(/^data:image\/(png|jpeg);base64,/, '');
}