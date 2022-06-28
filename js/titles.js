// ordering title translations


const title_priority = ['en','ja','ko','other'];

function parse_title(data) {
    for (let priority in title_priority) {
        for (let i in data) {
            if (i == title_priority[priority]) return data[i];
        }
    }
}

function parse_alt_title(data) {
    for (let priority in title_priority) {
        for (let n in data) {
            for (let i in data[n]) {
                if (i == title_priority[priority]) return data[n][i];
            }
        }
    }
}