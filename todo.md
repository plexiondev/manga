## main

- [x] implement basic view of manga page
- [x] implement Start Reading button
- [x] swap ^ button depending on if previously read
- [ ] continue off where left off if previously read
- [x] add (temp?) link to mangadex page
- [x] dynamically update page titles via `page-title`

## auth
- [ ] fix up auth
- - [ ] do not attempt to auth with invalid (null?) credentials (with no query parameters on /auth)
- - [ ] do not require re-authing after 15 minutes (refresh isn't working)
- - [ ] make a global script (check_auth.js) to check if authorised

(have a global function that can be called to check auth and grab token)

eg. `function grab_token()`

this function can then refresh auth automatically if required (and also display auth in header n stuff)



## home

- [x] include page headers
- [x] include top header (with title, description)
- [x] also include bigger search box to find content
- [ ] possibly include `last_read` (that will update as the last content read - based on id and saved name (to prevent additional api call just to get name)) to jump right back in

## viewing

- [x] display cover art on view
- [x] tidy up chapter/volume display
- [x] allow chapter/volume display to link directly to start of volume's first chapter
- [x] show tags on view page
- [ ] add links (from api) to additional pages for manga
- [ ] add status, content rating, state
- [ ] add year, created at, updated at, (version?)
- [x] convert markdown for manga descriptions
- [x] make api calls for author + artist (/author/${id})
- [x] allow marking as read manga chapters
- [ ] if all chapters marked as read, auto-mark volume as read
- [ ] auto mark chapter as read if finished reading (possibly make option incase prefer manual)
- [ ] figure out how to work mark read/unread chapters in mark_read.js

## indexing

- [x] integrate search with mangadex api
- [x] use global header on all pages (minimal on manga reading)

## reading

- [x] implement basic api calls to read manga
- [x] implement back/forth buttons
- [ ] implement chapter picker?
- [x] allow choosing of volume
- [ ] automatically move to the next volume/chapter when finished

## styling

- [x] fix up styling of back/forth buttons when reading
- [x] fix up styling of chapter/volume display

## LTM

- [x] disable perma-caching
- [x] have proper cache limits depending on type of request (eg. view/chapters/reading)
- [x] ^ reading does not cache

## settings

- [x] include options for age ratings (eg. NSFW, suggestive) - not sure if possible via api
- [ ] make age rating settings take effect (eg. related manga, and search?)

## unsure

- [x] implement auth/login systems, which will allow:
- - [ ] getting last chapter/vol. read from mangadex
- - [ ] retrieving user's manga follows
- - [ ] displaying user's home feed in-app
- - and many more cool things
- [ ] include a non-authed basic homepage - look into api, can pass in calls where you can create a home page based on a set of preferences you choose (which can be passed in via settings possibly - would be very very cool)
