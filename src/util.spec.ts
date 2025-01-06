import { describe, expect, it } from "vitest";
import { bumpSemver } from "./util";

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
