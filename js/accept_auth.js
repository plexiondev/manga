// accept auth


// get params
const acceptauth_query = window.location.search;
const acceptauth_url = new URLSearchParams(acceptauth_query);

// check if just logged in
const logged_in = acceptauth_url.get('logged_in') || undefined;
if (logged_in == 1) {
    log('general',`You're logged in!`);
}