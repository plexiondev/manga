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
function mark_read(chapter_id_pass) {

    var chapter_id = chapter_id_pass;

    if (localStorage.getItem(`${chapter_id}_read`) == 0 || localStorage.getItem(`${chapter_id}_read`) == null) {
        // mark as read
        localStorage.setItem(`${chapter_id}_read`,1);
        document.getElementById(`mark_${chapter_id}`).classList.add("read");
        console.log(`[ Y ] marked ${chapter_id} as read`);
    } else {
        // mark as unread
        localStorage.removeItem(`${chapter_id}_read`);
        document.getElementById(`mark_${chapter_id}`).classList.remove("read");
        console.log(`[ Y ] marked ${chapter_id} as unread`);
    }
}