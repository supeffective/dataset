/**
 * @type {import('@commitlint/types').UserConfig}
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [1, 'always', 100],
    'type-empty': [1, 'never'],
    'type-enum': [2, 'always', ['chore', 'ci', 'docs', 'feat', 'fix', 'refactor', 'style', 'test', 'data']],
    // 'scope-empty': [2, 'never'],
    'scope-enum': [
      2,
      'always',
      [
        'build',
        'lint',
        'ci',
        'repo',
        'docs',
        'cs',
        'style',
        'tests',
        'releases',
        'deps',
        'config',
        'setup',
        'readme',
        'tools',
        'workflow',
        'data',
        'dataset',
        'pages',
        'sdk',
        'client',
        'dev',
        'server',
        'viewer',
      ],
    ],
  },
  ignores: [(commit) => commit.includes('update deps')],
}
