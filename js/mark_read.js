// mark chapter as read


// mark manga chapter as read
function mark_read(chapter_id_pass,force) {

    var chapter_id = chapter_id_pass;

    if (localStorage.getItem(`${chapter_id}_read`) == 0 || localStorage.getItem(`${chapter_id}_read`) == null || force == true) {
        // mark as read
        if (force == true) {
            // onload, not user requested
            document.getElementById(`mark_${chapter_id}`).classList.add('read');
        } else {
            // user requested (by clicking)
            send_read(chapter_id);
        }
    } else {
        // mark as unread
        remove_read(chapter_id);
    }
}


// mark as read
function send_read(chapter_id) {
    // define xhr POST
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/chapter/${chapter_id}/read`;
    xhr.open('POST',url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    xhr.onload = function() {
        // log to user
        document.getElementById(`mark_${chapter_id}`).classList.add('read');
        log('enabled',`Marked ${chapter_id} as read.`,false);
    }

    xhr.send();
}

// mark as unread
function remove_read(chapter_id) {
    // define xhr DELETE
    const xhr = new XMLHttpRequest();
    const url = `https://api.mangadex.org/chapter/${chapter_id}/read`;
    xhr.open('DELETE',url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    xhr.onload = function() {
        // log to user
        document.getElementById(`mark_${chapter_id}`).classList.remove('read');
        log('disabled',`Marked ${chapter_id} as unread.`,false);
    }

    xhr.send();
}