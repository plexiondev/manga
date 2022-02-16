// search for manga


function search() {
    input = document.getElementById("search");
    request = input.value;

    console.log("[...] searching")
    window.location.href = `search.html?q=${request}`;
}