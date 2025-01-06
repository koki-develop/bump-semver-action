import semver from "semver";

export type BumpLevel = "major" | "minor" | "patch";

export const isValidBumpLevel = (level: string): level is BumpLevel => {
  return ["major", "minor", "patch"].includes(level);
};

export const bumpSemver = (version: string, level: BumpLevel) => {
  const prefix = version.startsWith("v") ? "v" : "";
  return prefix + semver.inc(version, level);
};
