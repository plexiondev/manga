
// show pop-up windows


let em_window_parent = document.getElementById('window_parent');

// check if parent has children
setInterval(function() {
    if (em_window_parent.hasChildNodes()) {
        em_window_parent.classList.add('shown');
    } else {
        em_window_parent.classList.remove('shown');
    }
}, 1);