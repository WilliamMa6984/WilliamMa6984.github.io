import { Octokit } from "octokit";
import { Component } from 'react';
import GithubLogo from '../Resources/github-mark-white.svg';

const USERNAME = "WilliamMa6984"

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

    let res = octokit.request('GET https://api.github.com/users/' + USERNAME + '/repos?sort=created&order=desc', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    return res
  }
  
  handleClick(repo) {
    var element = document.querySelector(".RepoItem[data-id='" + repo.id + "']")
    var desc = document.querySelector(".RepoItem[data-id='" + repo.id + "'] .RepoItemBottom")
    var banner = document.querySelector(".RepoItem[data-id='" + repo.id + "'] .RepoItemTop")
    
    if (element.style.width === "40vw") {
        element.style.width = "20vw"
        element.style.height = "22vh"
        desc.style.opacity = "0"
        desc.style.height = "10%"

        banner.style.height = "90%"
    } else {
        element.style.width = "40vw"
        element.style.height = "40vh"
        desc.style.opacity = "1"
        desc.style.height = "70%"

        banner.style.height = "30%"
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
            onClick={() => this.handleClick(repo)}>
            <div className="RepoItemWrapper">
                <div className="RepoItemTop">
                    <div className="RepoItemLeft">
                        <img src={repo.owner.avatar_url} alt="Avatar" style={{height: "7vh"}} />
                        <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" title="Link to Github" style={{height: "4vh"}}>
                          <img src={GithubLogo} style={{height: "100%"}} alt="Github logo" />
                        </a>
                    </div>
                    <div className="RepoItemRight">
                        <p>{repo.name.replaceAll(/-|_/g, " ").toUpperCase()}</p>
                    </div>
                </div>
                <div className="RepoItemBottom" style={{backgroundImage: "url('https://raw.githubusercontent.com/" + repo.full_name + "/main/GithubPagesThumbnail/thumbnail.png')"}}>
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