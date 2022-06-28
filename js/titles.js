// ordering title translations


const title_priority = ['en','ja-ro','ja','ko','other'];

function parse_title(data) {
    let text = '';

    for (let priority in title_priority) {
        for (let i in data) {
            if (i == title_priority[priority]) text = data[i];
        }
    }

    return text;
}

function parse_alt_title(data) {
    let text = '';

    for (let priority in title_priority) {
        for (let n in data) {
            for (let i in data[n]) {
                if (i == title_priority[priority]) text = data[n][i];
            }
        }
    }

    return text;
}