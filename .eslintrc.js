/** 通用的eslint配置 */
module.exports = {
  root: true,
  extends: [require.resolve('@cj-villa/design-paper/.eslintrc.js')],
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
  },
};
