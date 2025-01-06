import * as core from "@actions/core";
import { context } from "@actions/github";
import { GitHub } from "./github";
import { bumpSemver, isValidBumpLevel } from "./util";

export const main = async () => {
  try {
    const inputs = {
      current_version: core.getInput("current_version"),
      level: core.getInput("level", { required: true }),
      force: core.getInput("force") === "true",
    } as const;

    if (!isValidBumpLevel(inputs.level)) {
      throw new Error(`invalid level: ${inputs.level}`);
    }

    const github = new GitHub({
      owner: context.repo.owner,
      repo: context.repo.repo,
      token: core.getInput("token"),
    });

    const currentVersion = await (async () => {
      if (inputs.current_version) return inputs.current_version;

      core.info("Fetching the current version from GitHub...");
      const currentVersion = await github.getLatestVersion();
      if (!currentVersion) throw new Error("failed to get current version");
      core.info(`The current version is ${currentVersion}`);

      return currentVersion;
    })();

    const newVersion = bumpSemver(currentVersion, inputs.level);
    core.info(`Bumping the version to ${newVersion}`);

    const isTagExists = await github.isTagExists(newVersion);
    if (isTagExists) {
      if (!inputs.force) {
        throw new Error(
          `tag ${newVersion} already exists. Set "force: true" to update the tag.`,
        );
      }
      await github.updateTag({ tag: newVersion, sha: context.sha });
      core.info(`Tag ${newVersion} updated`);
    } else {
      await github.createTag({ tag: newVersion, sha: context.sha });
      core.info(`Tag ${newVersion} created`);
    }

    core.setOutput("new_version", newVersion);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      throw error;
    }
  }
};

await main();
