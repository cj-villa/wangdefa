/**
 * 规则继承于阿里的规则集，具体的规范可见：https://github.com/alibaba/f2e-spec
 */
module.exports = {
  root: true,
  extends: ['../rules/base'],
  overrides: [
    {
      files: ['**/*.js'],
      extends: ['eslint-config-ali/react', 'plugin:prettier/recommended', '../rules/custom'],
    },
    {
      files: ['**/*.ts'],
      extends: [
        'eslint-config-ali/typescript/react',
        'plugin:prettier/recommended',
        '../rules/custom',
        '../rules/ts-custom',
      ],
    },
    {
      files: ['**/*.jsx'],
      extends: [
        'eslint-config-ali/react',
        'plugin:prettier/recommended',
        '../rules/custom',
        '../rules/react-custom',
      ],
    },
    {
      files: ['**/*.tsx'],
      extends: [
        'eslint-config-ali/typescript/react',
        'plugin:prettier/recommended',
        '../rules/custom',
        '../rules/react-custom',
        '../rules/ts-custom',
      ],
    },
    {
      files: ['**/*.vue'],
      extends: [
        'eslint-config-ali/typescript/vue',
        'plugin:prettier/recommended',
        '../rules/custom',
        '../rules/ts-custom',
      ],
    },
    {
      files: ['**/app-*/**/*.ts'],
      extends: [
        'eslint-config-ali/typescript/node',
        'plugin:prettier/recommended',
        '../rules/custom',
        '../rules/ts-custom',
      ],
    },
  ],
};
