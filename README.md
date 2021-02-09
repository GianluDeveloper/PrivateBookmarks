# Private Bookmarks

## Bookmarks Chrome Extension with Node.js Backend

Store your bookmarks in a local/remote database with data about the URL, dynamic HTML content and Screenshot (can do fullscreen) of the page.

For the database:

```
docker run -v /tmp/mongo:/data/db -p 27017:27017 --name some-mongo -d mongo
```
