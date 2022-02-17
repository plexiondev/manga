// settings


const options = {
    0: "lowq_downloads",
    1: "show_suggestive",
    2: "show_erotica",
    3: "show_nsfw",
    4: "prefer_lang"
};

// configure option
function option(value) {
    if (localStorage.getItem(`op_${value}`) == null || localStorage.getItem(`op_${value}`) == 0) {
        localStorage.setItem(`op_${value}`,1);
        console.log(`[ S ] enabled ${value}`);
        document.getElementById(`${value}`).classList.add("enabled");
    } else {
        localStorage.setItem(`op_${value}`,0);
        console.log(`[ S ] disabled ${value}`);
        document.getElementById(`${value}`).classList.remove("enabled");
    }
}
function option_lang() {
    let lang_text = document.getElementById("transl").value;

    localStorage.setItem("op_preferlang",`${lang_text}`);
    console.log(`[ S ] enabling lang ${lang_text}`);
}

// detect upon load
function onload() {
    for (let i in options) {
        if (localStorage.getItem(`op_${options[i]}`) == 1) {
            document.getElementById(`${options[i]}`).classList.add("enabled");
            console.log(`[ S ] detected that ${options[i]} is enabled`);
        } else if (options[i] == "prefer_lang" && localStorage.getItem("op_preferlang") != null && localStorage.getItem("op_preferlang") != 0 && localStorage.getItem("op_preferlang") != "en") {
            document.getElementById(`${options[i]}`).classList.add("enabled");
            console.log(`[ S ] detected that ${options[i]} is enabled`);
        }
    }
}
// run on load
window.onload = onload()