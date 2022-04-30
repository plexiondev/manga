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

// periodically check for upload
// will check if any items have `pending_upload` as a class
// this means the current reading state has not been sent to mangadex
window.setInterval(check_pending,5000);

// mark manga chapter as read
function mark_read(chapter_id_pass,force) {

    var chapter_id = chapter_id_pass;

    if (localStorage.getItem(`${chapter_id}_read`) == 0 || localStorage.getItem(`${chapter_id}_read`) == null || force == true) {
        // mark as read
        localStorage.setItem(`${chapter_id}_read`,1);
        document.getElementById(`mark_${chapter_id}`).classList.add('read');
        document.getElementById(`mark_${chapter_id}`).setAttribute('read','true');

        if (force != true) {
        // mark as pending upload
        document.getElementById(`mark_${chapter_id}`).classList.add('pending_upload');

        // log to user
        log('enabled',`Marked ${chapter_id} as read.`,false);
        }
    } else {
        // mark as unread
        localStorage.removeItem(`${chapter_id}_read`);
        document.getElementById(`mark_${chapter_id}`).classList.remove('read');
        document.getElementById(`mark_${chapter_id}`).setAttribute('read','false');
        
        // mark as pending upload
        document.getElementById(`mark_${chapter_id}`).classList.add('pending_upload');

        // log to user
        log('enabled',`Marked ${chapter_id} as unread.`,false);
    }
}

// check if any mark_read pending upload
function check_pending() {
    let pending_items = document.getElementsByClassName('pending_upload');
    
    if (pending_items.length > 0) {
        send_read(pending_items);
    }
}

// send off read/un-read chapters
function send_read(pending_items) {
    // define xhr GET
    const sr_xhr = new XMLHttpRequest();
    const sr_url = `https://api.mangadex.org/manga/${manga}/read`;
    sr_xhr.open('POST', sr_url, true);
    sr_xhr.setRequestHeader('Content-Type', 'application/json');
    sr_xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);

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

    
}