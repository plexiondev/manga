## view manga page

`https://api.mangadex.org/manga/{ manga.id }`

eg. `https://api.mangadex.org/manga/d7a0991d-2913-4b3c-8fb6-2b752f9e5f3a`

---

## get cover

`https://uploads.mangadex.org/covers/{ manga.id }/{ cover.filename }`

eg. `https://uploads.mangadex.org/covers/d7a0991d-2913-4b3c-8fb6-2b752f9e5f3a/80d2f114-5ff5-42ff-b507-4e51eab68de0.png`

1. send `get manga` request
2. look in `relationships[2]` (eg.) for the `cover_art` tag
3. look up the `cover_art` id using a `get cover` request
4. structure URL

REQUIRES: `GET MANGA`, `GET COVER`

---

## chapter list

`https://api.mangadex.org/manga/{ manga.id }/aggregate`

eg. `https://api.mangadex.org/manga/d7a0991d-2913-4b3c-8fb6-2b752f9e5f3a/aggregate`

---

## advancing to next chapter

1. make use of `/chapter` api calls via passing in the current chapter id?
2. ^ this should allow you to view the current chapter number the user is currently on
3. can then run the same `chapter.js` and reload this page with a new `?c=`