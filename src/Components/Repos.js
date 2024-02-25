
import { Octokit } from "octokit";
import { Component } from 'react';

class Repos extends Component {
  state = {
    repos: [],
    error: ""
  }

  constructor() {
    super()
  }

  componentDidMount() {
    this.GetRepos().then(res => {
        switch (res.status) {
            case 200:
                this.setState({error: ""})
                this.setState({
                    repos: res.data
                })

                break
            case 401:
                this.setState({error: "Requires authentication"})
                break
            case 403:
                this.setState({error: "Forbidden"})
                break
            case 422:
                this.setState({error: "Validation failed, or the endpoint has been spammed"})
                break
            case 429:
                this.setState({error: "Rate limit reached"})
                break
            default:
                this.setState({error: ""})
                break
        }
    })
  }
  componentDidUpdate() {
    console.log(this.state.repos)
  }

  GetRepos() {
    const octokit = new Octokit({
      auth: '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'
    })

    let res = octokit.request('GET /user/repos', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    return res
  }

  render() {
    if (this.state.error === "") {
        return (

<div>
    <p>Hello</p>
</div>

        );
    } else {
        return (

<p>{this.state.error}</p>

        );
    }
  }
}

export default Repos