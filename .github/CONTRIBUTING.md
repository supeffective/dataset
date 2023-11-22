# Contributing Guide

Thanks for your interest to contribute to this project. Please take a moment and read through this guide:

## Repository

- We use Node v20 and the `pnpm` package manager.
- We use [Convention Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our commit messages.

## Developing

### Quick Start

Here are the basic commands you'll need to get started:

```sh

# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Build dist files
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint (formatter and linter)
pnpm lint

# Format (fixes linting and formatting issues)
pnpm lint-fix

# Type check
pnpm typelint

# Run all quality checks (linter, formatter, build, test, typelint, etc.)
pnpm quality-checks

```

## Testing

We use `bun` to run tests. You can run all tests with:

```sh
pnpm test
```

Tests ending with `*.test.tsx` or `*.dom.test.ts` are considered browser tests and will be run in a browser-like
environment.

Tests ending with `*.test.ts` (except `*.dom.test.ts`) are considered universal tests and will be run in all
environments.
