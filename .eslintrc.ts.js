/** 通用的eslint配置 */
module.exports = {
  extends: ['eslint-config-alloy/typescript', '.eslintrc'],
  rules: {
    /** 禁止未使用过的变量 */
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
      },
    ],
  },
};
