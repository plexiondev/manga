// global language file


const en = {
    'GLOBAL_ACTION_BACK': "Back",
    'GLOBAL_ACTION_RELOAD': "Reload",
    'GLOBAL_ACTION_FINISH': "Finish",

    'ACCEPT_AUTH_200_HEAD': "All done!",
    'ACCEPT_AUTH_200_MSG': "You're all logged in, now you can get to reading.",
    'ACCEPT_AUTH_429_HEAD': "Uh oh.",
    'ACCEPT_AUTH_429_MSG': "We were unable to log in, it appears you have reached<br>your hourly rate limit. Please try again later.",
    'ACCEPT_AUTH_000_HEAD': "Uh oh.",
    'ACCEPT_AUTH_000_MSG': "We've encountered an unknown error. Please try again later.",

    'AUTH_HEAD': "Login to your account",
    'AUTH_MSG': "To fully utilise the app, please login to your account.",
    'AUTH_INPUT_EMAIL': "Email",
    'AUTH_INPUT_USER': "Username",
    'AUTH_INPUT_PASS': "Password",
    'AUTH_ACTION_LOGIN': "Login",

    'HEADER_ACTION_HOME': "Home",
    'HEADER_ACTION_SEARCH': "Search"
}

function TranslateString(param = '') {
    return en[param];
}