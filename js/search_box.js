// search for manga


function search_manga() {
    input = document.getElementById("search");
    request = input.value;

    console.log("[...] searching")
    window.location.href = `search.html?q=${request}`;
}

// clear search
function clear_search() {
    console.log('a')
    document.getElementById('search').value = "";
    search();
}

// enter
$("#search").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#search-con").click();
    }
});

// escape
$("#search").keyup(function(event) {
    if (event.keyCode === 27) {
        clear_search();
    }
});