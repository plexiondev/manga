// search for manga


function search_manga() {
    input = document.getElementById("search");
    request = input.value;

    console.log("[...] searching")
    window.location.href = `search.html?q=${request}`;
}

$("#search").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#search-con").click();
    }
});