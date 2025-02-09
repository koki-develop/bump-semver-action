import { getOctokit } from "@actions/github";
import { type SimpleGit, simpleGit } from "simple-git";
import { highestSemver } from "./util";

export class GitHub {
  private readonly owner: string;
  private readonly repo: string;
  private readonly octokit: ReturnType<typeof getOctokit>;
  private readonly git: SimpleGit;

  constructor(config: {
    owner: string;
    repo: string;
    token: string;
  }) {
    this.owner = config.owner;
    this.repo = config.repo;
    this.octokit = getOctokit(config.token);
    this.git = simpleGit(process.cwd());
  }

  async getLatestVersion(): Promise<string | null> {
    const release = await this._getLatestRelease();
    if (release) return release.tag_name;

    const tag = await this._getLatestTag();
    if (tag) return tag;

    return null;
  }

  async createTag(params: { tag: string; sha: string }): Promise<void> {
    await this.git.tag([params.tag, params.sha]);
    await this.octokit.rest.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/tags/${params.tag}`,
      sha: params.sha,
    });
  }

  async updateTag(params: { tag: string; sha: string }): Promise<void> {
    await this.git.tag([params.tag, params.sha]);
    await this.octokit.rest.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `tags/${params.tag}`,
      sha: params.sha,
      force: true,
    });
  }

  async isTagExists(tag: string): Promise<boolean> {
    return this.octokit.rest.git
      .getRef({
        owner: this.owner,
        repo: this.repo,
        ref: `tags/${tag}`,
      })
      .then(() => {
        return true;
      })
      .catch((error) => {
        if (error.status && error.status === 404) {
          return false;
        }
        throw error;
      });
  }

  private async _getLatestRelease() {
    return await this.octokit.rest.repos
      .getLatestRelease({
        owner: this.owner,
        repo: this.repo,
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.status && error.status === 404) {
          return null;
        }
        throw error;
      });
  }

  private async _getLatestTag(): Promise<string | null> {
    const data = await this.octokit.paginate(
      this.octokit.rest.git.listMatchingRefs,
      {
        owner: this.owner,
        repo: this.repo,
        ref: "tags",
      },
    );

    const tags = data.filter((ref) => ref.ref.startsWith("refs/tags/"));
    return highestSemver(tags.map((tag) => tag.ref.replace("refs/tags/", "")));
  }
}
