// pages


// advance pages
function advance_page(direction) {
    if (direction == 1) {
        offset += limit;
        if (offset <= top_limit) {
            log('general',`Advancing forward 1 page (${offset})`,true);
            load_page();
        } else {
            offset -= limit;
        }
    } else {
        offset -= limit;
        if (offset >= 0) {
            log('general',`Advancing backward 1 page (${offset})`,true);
            load_page();
        } else {
            offset += limit;
        }
    }
}

// set page directly
function set_page(page) {
    offset_temp = offset;
    offset = page;
    if (offset >= 0 && offset <= top_limit) {
        log('general',`Set page to ${offset}`,true);
        load_page();
    } else {
        offset = offset_temp;
    }
}