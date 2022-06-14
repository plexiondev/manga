// global language file


const en = {
    'ACCEPT_AUTH_SUCCESS_HEAD': "All done!",
    'ACCEPT_AUTH_SUCCESS_MSG': "You're all logged in, now you can get to reading.",
    
}

function TranslateString(param = '') {
    return en[param];
}