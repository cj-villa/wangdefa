module.exports = {
  root: true,
  extends: [
    'eslint-config-alloy',
    'eslint-config-alloy/typescript',
  ],
  env: {},
  globals: {},
  rules: {
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],
  },
};