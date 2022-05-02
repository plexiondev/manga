// mark chapter as read


// detect upon load
function check_read(chapter_id_pass) {

    var chapter_id = chapter_id_pass;

    // return 1 or 0
    if (localStorage.getItem(`${chapter_id}_read`) == 1) {
        return 1;
    } else {
        return 0;
    }
}

// mark manga chapter as read
function mark_read(chapter_id_pass,force) {

    var chapter_id = chapter_id_pass;

    if (localStorage.getItem(`${chapter_id}_read`) == 0 || localStorage.getItem(`${chapter_id}_read`) == null || force == true) {
        // mark as read
        localStorage.setItem(`${chapter_id}_read`,1);
        document.getElementById(`mark_${chapter_id}`).classList.add('read');

        if (force != true) {
            send_read(chapter_id);

            // log to user
            log('enabled',`Marked ${chapter_id} as read.`,false);
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


// send off read/un-read chapters
function send_read(pending_items) {
    // define xhr GET
    const sr_xhr = new XMLHttpRequest();
    const sr_url = `https://api.mangadex.org/manga/${manga}/read`;
    sr_xhr.open('POST',sr_url,true);
    sr_xhr.setRequestHeader('Content-Type','application/json');
    sr_xhr.setRequestHeader('Authorization',`${localStorage.getItem('token')}`);

    // create arrays
    let read = [];
    let unread = [];

    // run over each pending item
    for (i = 0; i < pending_items.length; i++) {
        let is_read = pending_items[i].getAttribute('read');

        if (is_read == 'true') {
            read.push(`${pending_items[i].getAttribute('chapter_id')}`);
        } else if (is_read == 'false') {
            unread.push(`${pending_items[i].getAttribute('chapter_id')}`);
        }

        pending_items[i].classList.remove('pending_upload');
    }

    let chapterIdsRead = read;
    let chapterIdsUnread = unread;

    // send
    if (read.length != 0 && unread.length != 0) {
        // updates for read & unread
        sr_xhr.send(JSON.stringify(read,unread));
    } else if (read.length != 0 && unread.length == 0) {
        // updates for read only
        sr_xhr.send(JSON.stringify(read));
    } else if (read.length == 0 && unread.length != 0) {
        // updates for unread only
        sr_xhr.send(JSON.stringify(unread));
    } else {
        log('general',`No items in arrays for marking read/unread.`,true);
    }
}