const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };
  var jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/1650e4080d";

  const options = {
    method: "POST",
    auth: "icsatest:297ee47e0dd698f2a48f6d7edcdadddb-us6",
  }

  const request = https.request(url, options, function(response){
    if(response.statusCode === 200)
    {
      res.sendFile(__dirname+"/success.html");
    }
    else
    {
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.sendFile(__dirname+"/signup.html");
})

//297ee47e0dd698f2a48f6d7edcdadddb-us6

//1650e4080d

app.listen(process.env.PORT || 3000, function(req, res){
  console.log("Server is running on port 3000.");
});
