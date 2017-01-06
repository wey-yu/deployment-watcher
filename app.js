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

let deployments = [];

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


app.post('/deploy', (req, res) => {
  // I have to check the application: who call me?
  // with the application id

  switch (req.body.event) {
    case "DEPLOYMENT_ACTION_BEGIN":
      // on a le data.commit
      // on fait la creation
      // on recupère l'id de deploiement
      // on check     data.cause: 'github',
      // que se passe-t-il si plusieurs déploiements?
      if(req.body.data.cause=="github") {

        console.log("🐼 DEPLOYMENT_ACTION_BEGIN")
        let commit_id = req.body.data.commit;
        console.log("commit_id:", commit_id);
        console.log("req.body:", req.body);



        githubCli.postData({path: `/repos/${owner}/${repository}/deployments`, data:{
            ref: commit_id
          , auto_merge: false
          , description: "Deploying my branch"
          , required_contexts: [
              ci_context
            ]
        }})
        .then(results => {
          //let deployment_id = results.id;
          console.log("🐼 Result of deployment creation:")
          console.log("results:", results);
          console.log("🐼 End of Result of deployment creation")


          let deployment_info = {
            application_id: req.body.data.appId,
            github_deployment_id: results.id,
            clever_deployment_id: req.body.data.uuid,
            ref: req.body.data.commit,
            status: "pending"
          };

          console.log("🐼 deployment_info:")
          console.log(deployment_info);
          console.log("🐼 End of deployment_info")

          deployments.push(deployment_info)

          res.status(201);
          res.send(results);
        })
        .catch(error => {
          console.log("🐼 ... 😡")
          console.log(error)
          res.status(500).send(error);
        });
      }


    break;

    case "DEPLOYMENT_SUCCESS":
      if(req.body.data.cause=="github") {
        let application_id = req.body.data.id;
        let ref = req.body.data.commitId;

        console.log("😀 DEPLOYMENT_SUCCESS", req.body)


        let github_deployment_id = deployments.find(item => item.ref == ref);
        // TODO check if OK
        console.log("😀 github_deployment_id", github_deployment_id)

        githubCli.postData({
            path: `/repos/${owner}/${repository}/deployments/${github_deployment_id}/statuses`
          , data:{
                state: "success" // pending, success, error, inactive, or failure
              , target_url: `${target_url}/hello` // TBD
            }
        })
        .then(results => {
          res.status(201);
          res.send(results);
        })
        .catch(error => {
          res.status(500).send(error);
        })

      }

    break;

    case "DEPLOYMENT_ERROR":
      //TODO
    break;

    default:
      res.status(201);
    break;


  }

  //console.log(req.body);
  //res.status(201);
})

app.get('/hello', (req, res) => {
  res.send({message:"💙", remark:"hello 🌍"});
})

app.listen(port)
console.log(`🌍 Deployment watcher is started - listening on ${port}`)
