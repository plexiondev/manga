// load settings page


$.get( 'settings.json', function( response ) {
    let data = response;

    // categories
    for (let i in data.categories) {
        let em_category = document.createElement('section');
        em_category.classList.add('left','settings');
        em_category.setAttribute('id',data.categories[i].type);
        em_category.innerHTML = (`
        <div class="head"><label class="overl">${data.categories[i].name}</label></div>
        <ul class="inner" id="${data.categories[i].type}_inner"></ul>
        `);

        // append
        document.getElementById('settings').appendChild(em_category);
    }

    // settings
    for (let i in data.settings) {
        let em_setting = document.createElement('li');

        if (data.settings[i].type == "switcher") {
            em_setting.classList.add('setting','switcher');
            em_setting.innerHTML = (`
            <span class="text">
                <span class="icon">
                    <div class="headline-icon min-icon">
                        <i class="icon w-24" data-feather="${data.settings[i].icon}"></i>
                    </div>
                </span>
            </span>
            `);

            // info
            let em_info = document.createElement('span');
            em_info.classList.add('info');
            em_info.innerHTML = (`
            <h5 class="text-16">${data.settings[i].name}</h5>
            `);

            // switcher
            let em_switcher = document.createElement('div');
            em_switcher.classList.add('switcher-cont');
            em_switcher.setAttribute('id',`${data.settings[i].option}_options`);
            
            for (let n in data.settings[i].options) {
                let em_switch = document.createElement('button');
                em_switch.classList.add('setting-switch');
                em_switch.setAttribute('id',`${data.settings[i].option}_${data.settings[i].options[n].option}`);
                em_switch.setAttribute('onclick',`option_multi('${data.settings[i].option}','${data.settings[i].options[n].option}')`);
                if (data.settings[i].switcher_icons == "flag") {
                    if (data.settings[i].options[n].option != "") {
                        // use flag from twemoji
                        em_switch.innerHTML = (`
                        <span class="cover flag"><i class="flag twf twf-${data.settings[i].options[n].option}"></i></span>
                        <span class="info"><h5 class="text-14">${data.settings[i].options[n].name}</h5></span>
                        `);
                    } else {
                        // use fallback flag
                        em_switch.innerHTML = (`
                        <span class="cover flag"><img class="flag-img" src="/img/flag-fallback.png"></span>
                        <span class="info"><h5 class="text-14">${data.settings[i].options[n].name}</h5></span>
                        `);
                    }
                } else {
                    em_switch.innerHTML = (`
                    <span class="cover"><img src="/img/${data.settings[i].option}_${data.settings[i].options[n].option}.png"></span>
                    <span class="info"><h5 class="text-14">${data.settings[i].options[n].name}</h5></span>
                    `);
                }

                // append
                em_switcher.appendChild(em_switch);
            }

            // append
            em_info.appendChild(em_switcher);
            em_setting.appendChild(em_info);
        } else if (data.settings[i].type == "show_login") {
            // show current user login
            em_setting.classList.add('setting','switcher');
            // add temporary innerHTML until auth scripts are run
            em_setting.innerHTML = (`
            <span class="text">
                <span class="icon">
                    <div class="headline-icon min-icon">
                        <i class="icon w-24" data-feather="${data.settings[i].icon}"></i>
                    </div>
                </span>
                <span class="info" id="login_info">
                    <h5 class="text-16">${data.settings[i].name}</h5>
                    <p>Logged in as <strong>${localStorage.getItem('token_username')}</strong></p>
                </span>
            </span>
            <span class="option">
                <a role="button" class="button focus" href="/auth.html">Re-authorise</a>
                <a role="button" class="button focus right" href="javascript:void(0)" onclick="refresh_auth(false)">Refresh token</a>
            </span>
            `);
        } else {
            em_setting.classList.add('setting');
            em_setting.setAttribute('onclick',`option('${data.settings[i].option}')`);
            em_setting.innerHTML = (`
            <span class="text">
                <span class="icon">
                    <div class="headline-icon min-icon">
                        <i class="icon w-24" data-feather="${data.settings[i].icon}"></i>
                    </div>
                </span>
                <span class="info">
                    <h5 class="text-16">${data.settings[i].name}</h5>
                    <p>${data.settings[i].description}</p>
                </span>
            </span>
            <span class="option">
                <a role="toggle" class="toggle" id="${data.settings[i].option}" href="javascript:void(0);" tabindex="-1"></a>
            </span>
            `);
        }

        // append
        try {
            document.getElementById(`${data.settings[i].category}_inner`).appendChild(em_setting);
        } catch(error) {
            no_category(em_setting);
        }

        feather.replace();
    }

    // detect upon load (& mark options as enabled)
    for (let i in data.settings) {
        if (data.settings[i].type != "switcher") {
            if (localStorage.getItem(`op_${data.settings[i].option}`) == 1) {
                document.getElementById(`${data.settings[i].option}`).classList.add('enabled');
            }
        } else if (data.settings[i].type == "switcher") {
            if (localStorage.getItem(`op_${data.settings[i].option}`) != undefined) {
                document.getElementById(`${data.settings[i].option}_${localStorage.getItem(`op_${data.settings[i].option}`)}`).classList.add('enabled');
            }
        }
    }
});

function no_category(em) {
    if (document.getElementById('none')) {
        document.getElementById('none_inner').appendChild(em);
    } else {
        let em_category = document.createElement('section');
        em_category.classList.add('left','settings');
        em_category.setAttribute('id','none');
        em_category.innerHTML = (`
        <div class="head"><label class="overl">No category</label></div>
        <ul class="inner" id="none_inner"></ul>
        `);
        document.getElementById('settings').appendChild(em_category);
        document.getElementById('none_inner').appendChild(em);
    }
}