import semver from "semver";

export const bumpSemver = (
  version: string,
  level: "major" | "minor" | "patch",
) => {
  const prefix = version.startsWith("v") ? "v" : "";
  return prefix + semver.inc(version, level);
};
