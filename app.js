const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  // res.send('Hello World');

  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  // console.log("post request received");
  // console.log(req.body);
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  // --url 'https://<dc>.api.mailchimp.com/3.0/' \
  // --header "Authorization: Bearer <TOKEN>"

  const url = "https://us1.api.mailchimp.com/3.0/lists/8b90d9f565";

  const options = {
    method: "POST",
    auth: "spider1:5d52ce1482724402154934309b3b7c23-us1",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server started. Listening on ${PORT}`);
});

// api key
// 5d52ce1482724402154934309b3b7c23-us1

// audience key
// 8b90d9f565
