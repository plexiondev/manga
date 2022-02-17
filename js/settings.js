// settings


const options = {
    0: "lowq_downloads"
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

// detect upon load
function onload() {
    for (let i in options) {
        if (localStorage.getItem(`op_${options[i]}`) == 1) {
            document.getElementById(`${options[i]}`).classList.add("enabled");
            console.log(`[ S ] detected that ${options[i]} is enabled`)
        }
    }
}
// run on load
window.onload = onload()