// accept auth


// get params
const acceptauth_query = window.location.search;
const acceptauth_url = new URLSearchParams(acceptauth_query);

// check auth end code
const code = acceptauth_url.get('code') || undefined;

if (code == '200') {
    // success

    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','login_window');

    em_window.innerHTML = (`
        <div class="cover"><img src="/img/done.png"></div>
        <div class="header" style="text-align: center;"><h4>${TranslateString('ACCEPT_AUTH_200_HEAD')}</h4></div>
        <div class="info" style="text-align: center;">
            <p>${TranslateString('ACCEPT_AUTH_200_MSG')}</p>
        </div>
        <div class="actions">
            <a role="button" class="button focus" href="/">${TranslateString('GLOBAL_ACTION_FINISH')}</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    lucide.createIcons();
} else if (code == '429') {
    // rate-limit

    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','login_window');

    em_window.innerHTML = (`
        <div class="cover"><img src="/img/fufufu.png"></div>
        <div class="header" style="text-align: center;"><h4>${TranslateString('ACCEPT_AUTH_429_HEAD')}</h4></div>
        <div class="info" style="text-align: center;">
            <p>${TranslateString('ACCEPT_AUTH_429_MSG')}</p>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    lucide.createIcons();
} else {
    // unknown error (api)

    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','login_window');

    em_window.innerHTML = (`
        <div class="cover"><img src="/img/fufufu.png"></div>
        <div class="header" style="text-align: center;"><h4>${TranslateString('ACCEPT_AUTH_000_HEAD')}</h4></div>
        <div class="info" style="text-align: center;">
            <p>${TranslateString('ACCEPT_AUTH_000_MSG')}</p>
            <br>
            <label class="over">404</label>
        </div>
        <div class="actions">
            <a role="button" class="button focus" href="https://mangadex.org">Visit MangaDex</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    lucide.createIcons();
}