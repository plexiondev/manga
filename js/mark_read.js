// mark chapter as read


var read = [];
var unread = [];

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
        document.getElementById(`mark_${chapter_id}`).classList.add("read");
        document.getElementById(`mark_${chapter_id}`).setAttribute('read','true');
        if (force != true) {
            log('enabled',`Marked ${chapter_id} as read.`,false);
            // append to list
            if (unread.includes(`${chapter_id}`)) {
                console.log(`unread includes ${chapter_id} at ${read.indexOf(`${chapter_id}`)}`);
                console.log(`unread at index: ${unread[`${unread.indexOf(`${chapter_id}`)}`]}`);
                console.log(`this is unread: ${unread}`);
                unread.slice(unread.indexOf(`${chapter_id}`),1);
                console.log(`this is unread now: ${unread}`);
            }
            read.push(...[`${chapter_id}`]);
            console.log(`this is read pushed now: ${read}`);
        }
    } else {
        // mark as unread
        localStorage.removeItem(`${chapter_id}_read`);
        document.getElementById(`mark_${chapter_id}`).classList.remove("read");
        document.getElementById(`mark_${chapter_id}`).setAttribute('read','false');
        log('enabled',`Marked ${chapter_id} as unread.`,false);
        // append to list
        if (read.includes(`${chapter_id}`)) {
            let index = unread.indexOf(`${chapter_id}`);

            console.log(`read includes ${chapter_id} at ${index}`);
            console.log(`read at index: ${read[`${index}`]}`);
            console.log(`this is read: ${read}`);

            read.slice(index,1);
            console.log(`this is read now: ${read}`);
        }
        unread.push(...[`${chapter_id}`]);
        console.log(`this is unread pushed now: ${unread}`);
    }

    // create 4 second timer (that is reset on every run of this function)
    // once the timer completes it then sends read/un-read chapters to mangadex
    // which then saves to account - and the cycle continues
    if (force != true) {
        // reset timer
        window.clearTimeout(send_read);
        // start new 4s timer
        window.setTimeout(send_read,4000);
    }
}

// send off read/un-read chapters
function send_read() {
    // define xhr GET
    const sr_xhr = new XMLHttpRequest();
    const sr_url = `https://api.mangadex.org/manga/${manga}/read`;
    sr_xhr.open('POST', sr_url, true);
    sr_xhr.setRequestHeader('Content-Type', 'application/json');
    sr_xhr.setRequestHeader('Authorization', `${localStorage.getItem('token')}`);

    console.log(`Read: ${read}\n\nUnread: ${unread}`);

    // send
    if (read.length != 0 && unread.length != 0) {
        // updates for read & unread
        sr_xhr.send(JSON.stringify({
            "chapterIdsRead": [
                `${read}`
            ],
            "chapterIdsUnread": [
                `${unread}`
            ]
        }));
    } else if (read.length != 0 && unread.length == 0) {
        // updates for read only
        sr_xhr.send(JSON.stringify({
            "chapterIdsRead": [
                `${read}`
            ]
        }));        
    } else if (read.length == 0 && unread.length != 0) {
        // updates for unread only
        sr_xhr.send(JSON.stringify({
            "chapterIdsUnread": [
                `${unread}`
            ]
        }));
    } else {
        log('general',`No items in arrays for marking read/unread.`,true);
    }

    // clear arrays
    read = [];
    unread = [];
}