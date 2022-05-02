// create login prompt
// requires auth.js to be running


// open window
function prompt_login() {
    let em_window = document.createElement('span');
    em_window.classList.add('window');
    em_window.setAttribute('id','login_window');

    em_window.innerHTML = (`
        <div class="cover"><img src="/img/hmm.png"></div>
        <div class="header" style="text-align: center;"><h4>Login to your account</h4></div>
        <div class="info" style="text-align: center;">
            <p>To fully utilise the app, please login to your account.</p>
            <br>
            <form onsubmit="parse_form()">
                <label class="over" for="email">Email</label>
                <br>
                <input class="generic" type="email" id="email" name="email">
    
                <br>
                <br>
                <label class="over" for="password">Password</label>
                <br>
                <input class="generic" type="password" id="password" name="password">
    
                <br>
                <br>
                <input role="button" class="button focus left icon con" type="submit" id="submit_login" style="display: none;">
            </form>
        </div>
        <div class="actions">
            <a role="button" class="button focus" onclick="document.getElementById('submit_login').click()">Login</a>
        </div>
    `);

    // append
    document.getElementById('window_parent').appendChild(em_window);
    feather.replace();
}