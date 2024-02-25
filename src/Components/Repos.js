import { Octokit } from "octokit";
import { Component } from 'react';

class Repos extends Component {
  state = {
    repos: [],
    error: ""
  }

  constructor() {
    super()

    this.handleClick = this.handleClick.bind(this)
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
    const octokit = new Octokit()

    let res = octokit.request('GET https://api.github.com/users/WilliamMa6984/repos?sort=created&order=desc', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    return res
  }
  
  handleClick(id) {
    var element = document.querySelector(".RepoItem[data-id='" + id + "']")
    var desc = document.querySelector(".RepoItem[data-id='" + id + "'] .RepoItemBottom")
    
    if (element.style.width === "40vw") {
        element.style.width = "20vw"
        element.style.height = "22vh"
        desc.style.opacity = "0"
        desc.style.height = "0"
    } else {
        element.style.width = "40vw"
        element.style.height = "40vh"
        desc.style.opacity = "1"
        desc.style.height = "100%"
    }
  }

  render() {
    if (this.state.error === "") {
        return (

<div className="RepoList">
{this.state.repos.map(repo => {
    return (
        <div className="RepoItem"
            data-id={repo.id}
            title="Click to expand"
            onClick={() => this.handleClick(repo.id)}>
            <div className="RepoItemWrapper">
                <div className="RepoItemTop">
                    <div className="RepoItemLeft">
                        <img src={repo.owner.avatar_url} alt="Avatar" />
                        <a key={repo.id} href={repo.html_url}>Link</a>
                    </div>
                    <div className="RepoItemRight">
                        <p>{repo.name.replaceAll(/-|_/g, " ").toUpperCase()}</p>
                    </div>
                </div>
                <div className="RepoItemBottom">
                    <p>{repo.description}</p>
                </div>
            </div>
        </div>
    )
})}
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