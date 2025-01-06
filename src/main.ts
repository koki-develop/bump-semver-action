import * as core from "@actions/core";
import { context } from "@actions/github";
import { GitHub } from "./github";
import { bumpSemver, isValidBumpLevel, validateSemver } from "./util";

export const main = async () => {
  try {
    const inputs = {
      currentVersion: core.getInput("current-version", {
        trimWhitespace: true,
      }),
      level: core.getInput("level", { required: true, trimWhitespace: true }),
      force: core.getInput("force", { trimWhitespace: true }) === "true",
      initialVersion: core.getInput("initial-version", {
        trimWhitespace: true,
      }),
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
      if (inputs.currentVersion) return inputs.currentVersion;

      core.info("Fetching the current version from GitHub...");
      const currentVersion = await github.getLatestVersion();
      if (currentVersion) {
        core.info(`The current version is ${currentVersion}`);
        core.setOutput("current-version", currentVersion);
        return currentVersion;
      }

      core.info("No tags found.");
      return null;
    })();

    const newVersion = (() => {
      if (currentVersion) {
        validateSemver(currentVersion);
        return bumpSemver(currentVersion, inputs.level);
      }

      if (inputs.initialVersion) {
        validateSemver(inputs.initialVersion);
        return inputs.initialVersion;
      }

      throw new Error("No current version or initial version provided");
    })();
    core.info(`Bumping the version to ${newVersion}`);
    core.setOutput("new-version", newVersion);

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
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      throw error;
    }
  }
};

await main();
