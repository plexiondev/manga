## General Specs for Manga Viewer

Insight into how each component works together to allow for seamless manga reading. May be helpful if anyone else is looking into the MangaDex API and doesn't know where to begin (or is lost on something).

### <i class="icon w-24" data-feather="link-2"></i> Useful links

- [MangaDex](https://mangadex.org/)
- [MangaDex API](https://api.mangadex.org/swagger)
- [MangaDex Discord](https://discord.gg/mangadex)

### <i class="icon w-24" data-feather="lock"></i> Authentication

> Related: [auth.js](/js/auth.js), [check_auth.js](/js/check_auth.js)

Most of the more advanced features (and general usability features) are locked behind Authentication, which is done via MangaDex. Therefore, a MangaDex account is required.

To authenticate, head over to [the authentication page](/auth.html) and enter in your MangaDex credentials (email & password). Once you submit your credentials, they are sent via the API to https://api.mangadex.org/auth/login. The API will then send back a session token and a refresh token.

This refresh token can then be periodically used every **14 min** to refresh your current session via https://api.mangadex.org/auth/refresh.

Your current session can be viewed in the [settings page](/settings), using https://api.mangadex.org/user/me to get your current user information.

### <i class="icon w-24" data-feather="book"></i> Reading

> Related: [read.js](/js/read.js)

