## main

- [x] implement basic view of manga page
- [x] implement Start Reading button
- [x] swap ^ button depending on if previously read
- [ ] continue off where left off if previously read
- [x] add (temp?) link to mangadex page

## viewing

- [x] display cover art on view
- [ ] tidy up chapter/volume display
- [x] allow chapter/volume display to link directly to start of volume's first chapter
- [x] show tags on view page
- [ ] add links (from api) to additional pages for manga
- [ ] add status, content rating, state
- [ ] add year, created at, updated at, (version?)
- [ ] convert markdown for manga descriptions

## indexing

- [ ] integrate search with mangadex api
- [ ] use global header on all pages (minimal on manga reading)

## reading

- [x] implement basic api calls to read manga
- [x] implement back/forth buttons
- [ ] implement chapter picker?
- [x] allow choosing of volume

## styling

- [ ] fix up styling of back/forth buttons when reading
- [ ] fix up styling of chapter/volume display

## LTM

- [ ] disable perma-caching
- [ ] have proper cache limits depending on type of request (eg. view/chapters/reading)
- [x] ^ reading does not cache

## unsure

- [ ] implement auth/login systems, which will allow:
- - [ ] getting last chapter/vol. read from mangadex
- - [ ] retrieving user's manga follows
- - [ ] displaying user's home feed in-app
- - and many more cool things