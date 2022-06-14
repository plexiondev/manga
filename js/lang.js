// global language file


const en = {
    'GLOBAL_ACTION_FINISH': "Finish",
    'ACCEPT_AUTH_200_HEAD': "All done!",
    'ACCEPT_AUTH_200_MSG': "You're all logged in, now you can get to reading.",
    'ACCEPT_AUTH_429_HEAD': "Uh oh.",
    'ACCEPT_AUTH_429_MSG': "We were unable to log in, it appears you have reached<br>your hourly rate limit. Please try again later."
}

function TranslateString(param = '') {
    return en[param];
}