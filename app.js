// demo deployment - just for one repo

const express = require("express");
const bodyParser = require("body-parser");

let port = process.env.PORT || 8888;

const GitHubClient = require('./octocat.js').GitHubClient;

let githubCli = new GitHubClient({
  baseUri:  process.env.GITHUB_API_URL,
  token:    process.env.TOKEN_GITHUB
});

let owner = process.env.OWNER;
let repository = process.env.REPOSITORY;
let ci_context = process.env.CI_CONTEXT;
let target_url = process.env.TARGET_URL;



let app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('public'));

/*
  https://developer.github.com/v3/repos/deployments/#list-deployments
*/
app.get('/deployments', (req, res) => {
  githubCli.getData({path: `/repos/${owner}/${repository}/deployments`})
  .then(deployments => {
    res.send(deployments);
  })
  .catch(error => {
    res.status(500).send(error);
  });
});

/*
  https://developer.github.com/v3/repos/deployments/#create-a-deployment
  ⚠️ this is only for tests ☢️
*/
app.get('/create/:reference', (req, res) => {
  //req.params.reference -> last commit
  githubCli.postData({path: `/repos/${owner}/${repository}/deployments`, data:{
      ref: req.params.reference
    , auto_merge: false
    , description: "Deploying my branch"
    , required_contexts: [
        ci_context
      ]
  }})
  .then(results => {
    res.send(results);
  })
  .catch(error => {
    res.status(500).send(error);
  });
});

/*
  https://developer.github.com/v3/repos/deployments/#update-a-deployment
  ⚠️ this is only for tests ☢️
*/
app.get('/status/:deployment_id/:state', (req, res) => {
  githubCli.postData({
      path: `/repos/${owner}/${repository}/deployments/${req.params.deployment_id}/statuses`
    , data:{
          state: req.params.state // pending, success, error, inactive, or failure
        , target_url: `${target_url}/hello` // TBD
      }
  })
  .then(results => {
    res.send(results);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});


app.post('/yo', (req, res) => {
  console.log(req.body);
  res.status(201);
})

app.get('/hello', (req, res) => {
  res.send({message:"💙", remark:"hello 🌍"});
})

app.listen(port)
console.log(`🌍 Deployment watcher is started - listening on ${port}`)
