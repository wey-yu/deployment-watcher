// demo

const express = require("express");
const bodyParser = require("body-parser");

let port = process.env.PORT || 8080;

let app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.post('/yo', (req, res) => {
  console.log(req.body);
  res.status(201);
})

app.listen(port)
console.log(`🌍 Deployment watcher is started - listening on ${port}`)
