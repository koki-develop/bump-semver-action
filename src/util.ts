import semver from "semver";

export type BumpLevel = "major" | "minor" | "patch";

export const isValidBumpLevel = (level: string): level is BumpLevel => {
  return ["major", "minor", "patch"].includes(level);
};

export const bumpSemver = (version: string, level: BumpLevel) => {
  const prefix = version.startsWith("v") ? "v" : "";
  return prefix + semver.inc(version, level);
};

export const highestSemver = (versions: string[]) => {
  return semver.maxSatisfying(
    versions.filter((v) => !semver.prerelease(v)),
    "*",
  );
};

export const validateSemver = (version: string) => {
  if (!semver.valid(version)) {
    throw new Error(`version must be a valid semver: ${version}`);
  }
};
