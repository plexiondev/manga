// mark chapter as read


// mark manga chapter as read
function mark_read(chapter_id_pass,force) {

    var chapter_id = chapter_id_pass;

    if (localStorage.getItem(`${chapter_id}_read`) == 0 || localStorage.getItem(`${chapter_id}_read`) == null || force == true) {
        if (force == true) {
            document.getElementById(`mark_${chapter_id}`).classList.add('read');
        } else {
            send_read(chapter_id);
        }
    } else {
        // mark as unread
        localStorage.removeItem(`${chapter_id}_read`);
        document.getElementById(`mark_${chapter_id}`).classList.remove('read');

        remove_read(chapter_id);

        // log to user
        log('enabled',`Marked ${chapter_id} as unread.`,false);
    }
}


// mark as read
function send_read(chapter_id) {
    // define xhr GET
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/manga/${manga}/read`;
    xhr.open('POST',url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    xhr.onload = function() {
        // log to user
        document.getElementById(`mark_${chapter_id}`).classList.add('read');
        log('enabled',`Marked ${chapter_id} as read.`,false);
    }

    xhr.send(JSON.stringify(unread));
}