module.exports = {
  rules: {
    'prettier/prettier': 2,
    'comma-dangle': 0,
    'no-bitwise': 0,
    'no-empty': 1,
    'no-nested-ternary': 1,
    'no-param-reassign': 0,
    'prefer-promise-reject-errors': 1,
    'generator-star-spacing': 0,
    'max-params': [2, 4],
    'no-console': [
      1,
      {
        allow: ['warn', 'error', 'info', 'table', 'time', 'timeEnd', 'timeLog', 'trace'],
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'sibling', 'parent', 'index', 'unknown'],
        pathGroups: [
          {
            pattern: './**/*.+(less|css)',
            group: 'unknown',
            position: 'after',
          },
          {
            pattern: '../**/*.+(less|css)',
            group: 'unknown',
            position: 'after',
          },
        ],
        // 'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        warnOnUnassignedImports: true,
      },
    ],
    'import/no-unresolved': 0,
    'import/no-cycle': 0,
    '@typescript-eslint/no-empty-function': 2,
  },
};
