module.exports = {
  root: true,
  extends: [
    'eslint-config-alloy',
    'eslint-config-alloy/react',
    'eslint-config-alloy/typescript',
  ],
  globals: {
    React: false,
    ReactDOM: false
  },
  rules: {
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],
  }
};