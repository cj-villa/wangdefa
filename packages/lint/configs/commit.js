/**
 * 校验commit的内容格式，commit的pattern为
 * type(scope?): subject
 * body?
 * footer?
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    /** 指定允许的type枚举 */
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert', 'release'],
    ],
  },
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  questions: {
    type: {
      description: "Select the type of change that you're committing:",
      enum: {
        feat: {
          description: 'A new feature',
          title: 'Features',
          emoji: '✨',
        },
        fix: {
          description: 'A bug fix',
          title: 'Bug Fixes',
          emoji: '🐛',
        },
        docs: {
          description: 'Documentation only changes',
          title: 'Documentation',
          emoji: '📚',
        },
        style: {
          description:
            'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
          title: 'Styles',
          emoji: '💎',
        },
        refactor: {
          description: 'A code change that neither fixes a bug nor adds a feature',
          title: 'Code Refactoring',
          emoji: '📦',
        },
        test: {
          description: 'Adding missing tests or correcting existing tests',
          title: 'Tests',
          emoji: '🚨',
        },
        chore: {
          description: "Other changes that don't modify src or test files",
          title: 'Chores',
          emoji: '♻️',
        },
        revert: {
          description: 'Reverts a previous commit',
          title: 'Reverts',
          emoji: '🗑',
        },
      },
    },
  },
};
