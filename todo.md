## main

- [x] implement basic view of manga page
- [x] implement Start Reading button
- [x] swap ^ button depending on if previously read
- [x] continue off where left off if previously read
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
- [x] possibly include `last_read` (that will update as the last content read - based on id and saved name (to prevent additional api call just to get name)) to jump right back in

## viewing

- [x] display cover art on view
- [x] tidy up chapter/volume display
- [x] allow chapter/volume display to link directly to start of volume's first chapter
- [x] show tags on view page
- [ ] add links (from api) to additional pages for manga
- [x] add user's reading status
- [x] add `Cancel` button to reading status window
- [x] auto-select user's current reading status in window
- [ ] add status, content rating, state
- - [ ] status
- - [x] content rating
- - [ ] state
- [ ] add year, created at, updated at
- - [ ] original year
- - [x] created at
- - [x] updated at
- [x] convert markdown for manga descriptions
- [x] make api calls for author + artist (/author/${id})
- [x] allow marking as read manga chapters
- [ ] if all chapters marked as read, auto-mark volume as read
- [ ] auto mark chapter as read if finished reading (possibly make option incase prefer manual)
- [x] figure out how to work mark read/unread chapters in mark_read.js
- [x] show warning if manga does not fit in user's content rating
- [ ] add more options button
- - [ ] represent as a simple `...` icon
- - [ ] contains mangadex link
- - [ ] contains report link (on mangadex)
- [ ] allow multiple authors/artists (eg. among us manga LMFAO 💀💀💀💀)

## authors/artists

- [x] make pages for authors
- - [x] viewing author's biography
- - [x] viewing author's socials
- - [x] viewing author's works

## groups

- [x] make pages for groups
- - [x] viewing group description
- - [x] viewing group's work (manga scanlations)
- - [x] viewing group's members
- [ ] allow searching for groups
- [ ] add banner when unclaimed group (no members) - similar to osu! copyright notice? / or show as window (no, too distracting)
- [ ] add icon for email link
- [ ] correct link for email

## users

- [x] make pages for users
- [ ] make user feed

## indexing

- [x] integrate search with mangadex api
- [x] use global header on all pages (minimal on manga reading)

## reading

- [x] implement basic api calls to read manga
- [x] implement back/forth buttons
- [ ] implement chapter picker?
- [x] show chapter/vol name in navbar
- [ ] show manga name in navbar
- [x] allow choosing of volume
- [x] automatically move to the next volume/chapter when finished
- [x] pre-load all page images
- - [x] make seperate image elements for each page
- - [x] swap to pages the same as plexion.dev gallery.js
- [ ] add support for cross-linked chapters (not hosted on mangadex) (eg. MangaPlus, https://mangadex.org/title/ac28f3f4-1bfd-491c-8403-0162379f953d)

## styling

- [x] fix up styling of back/forth buttons when reading
- [x] fix up styling of chapter/volume display

## LTM

- [x] disable perma-caching
- [x] have proper cache limits depending on type of request (eg. view/chapters/reading)
- [x] ^ reading does not cache

## settings

- [x] include options for age ratings (eg. NSFW, suggestive)
- [x] make age rating settings take effect
- - [x] related manga
- - [x] search
- - [x] viewing manga
- [x] implement auth/login systems
- - [x] retrieve user's manga reading status
- - [x] retrieve user's home feed
- - [x] retrieve user's manga follows
- - [ ] retrieve user's (group?) follows
- - [ ] retrieve user's manga ratings
