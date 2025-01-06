# Bump Semantic Version Action

[![GitHub Release](https://img.shields.io/github/v/release/koki-develop/bump-semver-action)](https://github.com/koki-develop/bump-semver-action/releases/latest)
[![CI](https://img.shields.io/github/actions/workflow/status/koki-develop/bump-semver-action/ci.yml?branch=main&logo=github&style=flat&label=ci)](https://github.com/koki-develop/bump-semver-action/actions/workflows/ci.yml)
[![Build](https://img.shields.io/github/actions/workflow/status/koki-develop/bump-semver-action/build.yml?branch=main&logo=github&style=flat&label=build)](https://github.com/koki-develop/bump-semver-action/actions/workflows/build.yml)

Bump a semver version.

## Usage

See [`action.yml`](./action.yml).

```yaml
jobs:
  bump:
    permissions:
      contents: write
    steps:
      - uses: koki-develop/bump-semver-action@v1
        with:
          level: patch # major, minor, patch
```

## LICENSE

[MIT](./LICENSE)
