const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");

var MongoClient = require("mongodb").MongoClient;

const insertInMongo = (obj) => {
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    const dbo = db.db("mydb");
    dbo.collection("customers").insertOne(obj, function (errx, resx) {
      if (errx) throw errx;
      db.close();
    });
  });
};

app.get("/", (req, res) => {
  const html = fs.readFileSync("public/index.html", "utf8");
  res.send(html);
});
app.get("/api", async (req, res) => {
  const newPremise = new Promise((ok, ko) => {
    const urls = [];
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      const dbo = db.db("mydb");
      const query = {};
      dbo
        .collection("customers")
        .find(query, { fields: { location: 1 } })
        .forEach(function (result) {
          urls.push({ url: result.location.url, title: result.location.title });
        })
        .then(() => {
          db.close();
          ok(urls);
        });
    });
  });

  newPremise.then((urls) => {
    res.json(urls);
  });
});
app.post("/bookmark", (req, res) => {
  const request = req;
  if (request.method == "POST") {
    var body = "";

    request.on("data", function (data) {
      body += data;

      if (body.length > 25e6) request.connection.destroy();
    });

    request.on("end", function () {
      const obj0 = JSON.parse(body);
      const obj = JSON.parse(obj0);
      insertInMongo(obj);
      res.json({
        ip: `Hello World ${JSON.stringify(obj.location.url)} ${JSON.stringify(
          obj.location.title
        )} !`,
      });
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
