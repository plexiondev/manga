// settings


// configure option
function option(value) {
    if (localStorage.getItem(`op_${value}`) == null || localStorage.getItem(`op_${value}`) == 0) {
        localStorage.setItem(`op_${value}`,1);
        log('enabled',`Enabled ${value}`,false);
        document.getElementById(`${value}`).classList.add('enabled');
        document.body.classList.add(`op_${value}`);
    } else {
        localStorage.setItem(`op_${value}`,0);
        log('disabled',`Disabled ${value}`,false);
        document.getElementById(`${value}`).classList.remove('enabled');
        document.body.classList.remove(`op_${value}`);
    }
}

// configure multi-option
// (for options eg. theme that accept multiple states - rather than 0/1)
function option_multi(option,value) {
    // get all options
    var options = document.getElementById(`${option}_options`).getElementsByClassName('setting-switch');

    // set classes
    for (i = 0; i < options.length; i++) {
        options[i].classList.remove('enabled');
        document.body.classList.remove(`op_${options[i].getAttribute('id')}`);
    }
    document.getElementById(`${option}_${value}`).classList.add('enabled');
    document.body.classList.add(`op_${option}_${value}`);

    localStorage.setItem(`op_${option}`,`${value}`);
    log('enabled',`Set ${option} to ${value}`,false);
}

// detect upon load
function onload() {
    $.get( '/settings/settings.json', function( response ) {
        let data = response;
        
        for (let i in data.settings) {
            if (data.settings[i].type != "switcher") {
                if (localStorage.getItem(`op_${data.settings[i].option}`) == 1) {
                    document.body.classList.add(`op_${data.settings[i].option}`);
                    log('enabled',`Auto-enabled ${data.settings[i].option}`,true);
                }
            } else if (data.settings[i].type == "switcher") {
                if (localStorage.getItem(`op_${data.settings[i].option}`) != undefined) {
                    document.body.classList.add(`op_${data.settings[i].option}_${localStorage.getItem(`op_${data.settings[i].option}`)}`);
                    log('enabled',`Auto-set ${data.settings[i].option} to ${localStorage.getItem(`op_${data.settings[i].option}`)}`,true);
                }
            }
        }
    });
}
// run on load
window.onload = onload()