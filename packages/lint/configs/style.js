module.exports = {
  root: true,
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order',
    'stylelint-prettier/recommended',
  ],
  plugins: ['stylelint-scss', 'stylelint-less'],
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
  rules: {
    'alpha-value-notation': null,
    'color-function-notation': null,
    'selector-pseudo-class-no-unknown': null,
    'selector-type-no-unknown': null,
    'color-hex-length': null,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
  },
  overrides: [
    {
      files: ['**/*.less'],
      customSyntax: require('postcss-less'),
      rules: {
        'at-rule-no-unknown': null,
        'function-no-unknown': null,
        'value-keyword-case': [
          'lower',
          {
            ignoreFunctions: ['/.*/'],
          },
        ],
        'declaration-empty-line-before': null,
        'selector-pseudo-element-no-unknown': null,
      },
    },
  ],
};
