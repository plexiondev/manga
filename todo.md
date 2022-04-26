## main

- [x] implement basic view of manga page
- [x] implement Start Reading button
- [x] swap ^ button depending on if previously read
- [ ] continue off where left off if previously read
- [x] add (temp?) link to mangadex page
- [x] dynamically update page titles via `page-title`

## auth
- [x] fix up auth
- - [x] do not attempt to auth with invalid (null?) credentials (with no query parameters on /auth)
- - [x] do not require re-authing after 15 minutes (refresh isn't working)
- - [x] make a global script (check_auth.js) to check if authorised
- [ ] display different `Logged in as x` message if un-authorised

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
- [x] add user's reading status
- [x] add `Cancel` button to reading status window
- [ ] auto-select user's current reading status in window
- [ ] add status, content rating, state
- - [ ] status
- - [x] content rating
- - [ ] state
- [ ] add year, created at, updated at
- - [ ] original year
- - [ ] created at
- - [ ] updated at
- [x] convert markdown for manga descriptions
- [x] make api calls for author + artist (/author/${id})
- [x] allow marking as read manga chapters
- [ ] if all chapters marked as read, auto-mark volume as read
- [ ] auto mark chapter as read if finished reading (possibly make option incase prefer manual)
- [ ] figure out how to work mark read/unread chapters in mark_read.js
- [ ] show warning if manga does not fit in user's content rating

## authors/artists

- [ ] make pages for authors/artists
- - [ ] authors
- - [ ] artists
- allow searching for authors/artists

## groups

- [ ] make pages for groups
- - [ ] viewing group description
- - [ ] viewing group's work (manga scanlations)
- [ ] allow searching for groups

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

- [x] include options for age ratings (eg. NSFW, suggestive)
- [ ] make age rating settings take effect
- - [ ] related manga
- - [x] search
- - [ ] viewing manga
- [x] implement auth/login systems
- - [x] retrieve user's manga reading status
- - [ ] retrieve user's home feed
- - [ ] retrieve user's manga follows
- - [ ] retrieve user's (group?) follows
- - [ ] retrieve user's manga ratings
