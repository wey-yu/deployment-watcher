const fetch = require('node-fetch');

class GitHubClient {
  constructor({baseUri, token}) {
    this.baseUri = baseUri;
    /*
      GitHub .com         https://api.github.com
      GitHub Enterprise   http://github.at.home/api/v3
    */
    this.credentials = token !== null && token.length > 0 ?
      "token" + ' ' + token :
      null;
    this.headers = {
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3.full+json",
      "Authorization": this.credentials
    }
  }
  getData({path}) {
    return fetch(this.baseUri + path, {
      method: 'GET',
      headers: this.headers
    })
    .then(response => {
      return response.json()
    })
    .then(jsonData => {
      return jsonData;
    })
  }
  postData({path, data}) {
    return fetch(this.baseUri + path, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    })
    .then(response => {
      return response.json()
    })
    .then(jsonData => {
      return jsonData;
    })
  }
}

module.exports = {
  GitHubClient: GitHubClient
}
