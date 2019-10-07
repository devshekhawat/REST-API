var express = require("express");
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
var download = require('image-downloader');
var path = require('path');
var Jimp = require("jimp");

var SECRET = "1khhm8e9i2";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
// Initialize the app.
var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

// JWT  code checker function
function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    req.token = bearerHeader;
    next();
  } else {
    res.status(200).json({ error: "Unauthorized access" });
  }
}

function handleError(res, reason, message, code) {
  res.status(code).json({ "error": message });
}

app.post("/login", function (req, res) {

  if (!req.body.username && !req.body.password) {
    handleError(res, "Invalid user input", "Must provide a username and password.", 200);
  }
  else {
    let user = {
      username: "test",
      password: "test"
    }
    const token = jwt.sign({ user }, SECRET);
    res.status(200).json({ message: "User successfully logged in!", user, token: token });
  }
});

app.get("/thumbnail", ensureToken, function (req, res) {
  if (!(req.query.q)) {
    handleError(res, "Invalid user input", "Must provide a url address for the image.", 200);
  }
  else {
    jwt.verify(req.token, SECRET, function (err, data) {
      if (err) {
        res.status(200).json({ error: "Unauthorized: Invalid token." });
      } else {

        const options = {
          url: req.query.q,
          dest: __dirname + '/img'
        }
        download.image(options)
          .then(({ filename, image }) => {

            Jimp.read(filename).then(function (lenna) {
              lenna.resize(50, 50)            // resize
                .quality(75)                 // set JPEG quality
                .write("img/thumbnail/" + path.basename(parsed.pathname));

              res.status(200).json({
                message: "Thumbnail successfully generated",
                thumb: __dirname + '/img/thumbnail/' + path.basename(parsed.pathname)
              });
            })
          }).catch((err) => {
            res.status(200).json({ error: 'Image loading error - 404.', errorObj: err });
          })
      }
    });
  }
});
module.exports = server
