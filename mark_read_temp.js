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