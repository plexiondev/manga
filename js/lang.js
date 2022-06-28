// global language file


const en = {
    'GLOBAL_ACTION_BACK': 'Back',
    'GLOBAL_ACTION_RELOAD': 'Reload',
    'GLOBAL_ACTION_FINISH': 'Finish',

    'RELATIONSHIP_MONOCHROME': 'Monochrome',
    'RELATIONSHIP_COLORED': 'Coloured',
    'RELATIONSHIP_PRESERIALIZATION': 'Pre-serialization',
    'RELATIONSHIP_SERIALIZATION': 'Serialization',
    'RELATIONSHIP_PREQUEL': 'Prequel',
    'RELATIONSHIP_MAIN_STORY': 'Main Story',
    'RELATIONSHIP_SIDE_STORY': 'Side Story',
    'RELATIONSHIP_ADAPTED_FROM': 'Original',
    'RELATIONSHIP_SPIN_OFF': 'Spin-off',
    'RELATIONSHIP_BASED_ON': 'Original',
    'RELATIONSHIP_DOUJINSHI': 'Doujinshi',
    'RELATIONSHIP_SAME_FRANCHISE': 'Same franchise',
    'RELATIONSHIP_SHARED_UNIVERSE': 'Shared universe',
    'RELATIONSHIP_ALTERNATE_STORY': 'Alternate Story',
    'RELATIONSHIP_ALTERNATE_VERSION': 'Alternate Version',

    'RATING_SAFE': 'Safe',
    'RATING_SUGGESTIVE': 'Suggestive',
    'RATING_EROTICA': 'Erotica',
    'RATING_PORNOGRAPHIC': 'NSFW',

    'READ_READING': 'Reading',
    'READ_ON_HOLD': 'On Hold',
    'READ_PLAN_TO_READ': 'Plan To Read',
    'READ_DROPPED': 'Dropped',
    'READ_RE_READING': 'Re-reading',
    'READ_COMPLETED': 'Completed',
    'READ_ADD': 'Add to Library',

    'ACCEPT_AUTH_200_HEAD': 'All done!',
    'ACCEPT_AUTH_200_MSG': "You're all logged in, now you can get to reading.",
    'ACCEPT_AUTH_429_HEAD': 'Uh oh.',
    'ACCEPT_AUTH_429_MSG': 'We were unable to log in, it appears you have reached<br>your hourly rate limit. Please try again later.',
    'ACCEPT_AUTH_000_HEAD': 'Uh oh.',
    'ACCEPT_AUTH_000_MSG': "We've encountered an unknown error. Please try again later.",

    'AUTH_HEAD': 'Login to your account',
    'AUTH_MSG': 'To fully utilise the app, please login to your account.',
    'AUTH_INPUT_EMAIL': 'Email',
    'AUTH_INPUT_USER': 'Username',
    'AUTH_INPUT_PASS': 'Password',
    'AUTH_ACTION_LOGIN': 'Login',

    'HEADER_ACTION_HOME': 'Home',
    'HEADER_ACTION_SEARCH': 'Search',

    'ROLE_MEMBER': 'Member',
    'ROLE_USER': 'User',
    'ROLE_UNVERIFIED': 'Unverified User',
    'ROLE_GROUP_MEMBER': 'Group Member',
    'ROLE_GROUP_LEADER': 'Group Leader',
    'ROLE_ADMIN': 'Admin',
    'ROLE_POWER_UPLOADER': 'Power Uploader',
    'ROLE_DEVELOPER': 'Developer',
    'ROLE_STAFF': 'Staff',
    'ROLE_MD_AT_HOME': 'MD@H'
}

function TranslateString(param = '') {
    return en[param];
}