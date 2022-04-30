// search for manga


function search_manga() {
    input = document.getElementById('search');
    request = input.value;

    log('search',`Searching for ${request}..`,false);
    window.location.href = `/search.html?q=${request}`;
}

// clear search
function clear_search() {
    log('general',`Cleared search`,true);
    document.getElementById('search').value = "";
    search();
}

// detect key input
$("#search").keyup(function(event) {
    // enter
    if (event.keyCode === 13) {
        $("#search-con").click();
    }
    // escape
    if (event.keyCode === 27) {
        clear_search();
    }
});