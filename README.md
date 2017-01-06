# deployment-watcher
POC of webapp to change deployment status on GitHub

You have to set some environment variables:

```
TOKEN_GITHUB = your_personal_web_token
GITHUB_API_URL = https://api.github.com
PORT = 8080
OWNER = organization or handle of the user
REPOSITORY = repository to deploy
CI_CONTEXT = continuous-integration/jenkins/branch (to check)
TARGET_URL = http://deployment-watcher.cleverapps.io
```
