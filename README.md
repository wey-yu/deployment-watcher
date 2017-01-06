# deployment-watcher
POC of webapp to change deployment status on GitHub


- always check that `cause` == `github`

{
  date: '2017-01-05T21:09:50.076',
  authorId: 'user_5c972daa-f4f3-47c6-9fa1-018b86ee3c92',
  data:
  {
    appId: 'app_74a5e4ed-76c8-4b92-adf2-a2f3e73f7e61',
    id: 24,
    uuid: 'deployment_36ea9a2b-1101-4cfe-ab53-219e6bc6f4a6', // and when ? DEPLOYMENT_SUCCESS
    commit: '46c1075d72252d647c718784c3c94d6b1b8417b2',
    cause: 'github',
    state: 'WIP',
    action: 'DEPLOY',
    instances: 1
  },
  event: 'DEPLOYMENT_ACTION_BEGIN'
}


{
  date: '2017-01-05T21:13:13.945',
  authorId: 'user_5c972daa-f4f3-47c6-9fa1-018b86ee3c92',
  data:
  {
    id: 'app_74a5e4ed-76c8-4b92-adf2-a2f3e73f7e61',
    ownerId: 'user_5c972daa-f4f3-47c6-9fa1-018b86ee3c92',
    name: 'demo',
    instanceType: 'node',
    flavor: 'pico',
    instanceId: '4ac9cff7-63b3-4be2-a6c6-103e9a4950ae',
    commitId: '46c1075d72252d647c718784c3c94d6b1b8417b2',
    zone: 'par',
    deploymentTime: 51,
    cause: 'github',
    isAnApp: true,
    fqdns:
      [
        'app-74a5e4ed-76c8-4b92-adf2-a2f3e73f7e61.cleverapps.io',
        'weyyudemo.cleverapps.io'
      ],
    emails: [ 'ph.charriere@gmail.com' ],
    authorName: 'k33g_org'
  },
  event: 'DEPLOYMENT_SUCCESS'
}
