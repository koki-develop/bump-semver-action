import { describe, expect, it } from "vitest";
import { bumpSemver, highestSemver, isValidBumpLevel } from "./util";

describe("isValidBumpLevel", () => {
  it.each([
    ["major", true],
    ["minor", true],
    ["patch", true],
    ["invalid", false],
  ])("isValidBumpLevel(%j) should return %j", (level, expected) => {
    expect(isValidBumpLevel(level)).toBe(expected);
  });
});

describe("bumpSemver", () => {
  it.each([
    ["0.0.0", "major", "1.0.0"],
    ["0.0.0", "minor", "0.1.0"],
    ["0.0.0", "patch", "0.0.1"],
    ["v0.0.0", "major", "v1.0.0"],
    ["v0.0.0", "minor", "v0.1.0"],
    ["v0.0.0", "patch", "v0.0.1"],

    ["1.0.0", "major", "2.0.0"],
    ["1.0.0", "minor", "1.1.0"],
    ["1.0.0", "patch", "1.0.1"],
    ["v1.0.0", "major", "v2.0.0"],
    ["v1.0.0", "minor", "v1.1.0"],
    ["v1.0.0", "patch", "v1.0.1"],
  ])("bumpSemver(%j, %j) should return %j", (version, level, expected) => {
    expect(bumpSemver(version, level as "major" | "minor" | "patch")).toBe(
      expected,
    );
  });
});

describe("highestSemver", () => {
  it.each([
    [[], null],

    [["1.0.0"], "1.0.0"],
    [["1.0.0", "1.0.1"], "1.0.1"],
    [["1.0.0", "1.0.1", "1.1.0"], "1.1.0"],
    [["1.0.0", "1.0.1", "1.1.0", "1.1.1"], "1.1.1"],
    [["1.0.0", "1.0.1", "1.1.0", "1.1.1", "2.0.0"], "2.0.0"],
    [["1.0.0", "1.0.1", "1.1.0", "1.1.1", "2.0.0", "3.0.0-beta"], "2.0.0"],

    [["v1.0.0"], "v1.0.0"],
    [["v1.0.0", "v1.0.1"], "v1.0.1"],
    [["v1.0.0", "v1.0.1", "v1.1.0"], "v1.1.0"],
    [["v1.0.0", "v1.0.1", "v1.1.0", "v1.1.1"], "v1.1.1"],
    [["v1.0.0", "v1.0.1", "v1.1.0", "v1.1.1", "v2.0.0"], "v2.0.0"],
    [
      ["v1.0.0", "v1.0.1", "v1.1.0", "v1.1.1", "v2.0.0", "v3.0.0-beta"],
      "v2.0.0",
    ],
  ])("highestSemver(%j) should return %j", (versions, expected) => {
    expect(highestSemver(versions)).toBe(expected);
  });
});
