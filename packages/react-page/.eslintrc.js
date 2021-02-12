module.exports = {
  root: true,
  extends: [
    'eslint-config-alloy',
    'eslint-config-alloy/react',
    'eslint-config-alloy/typescript',
  ],
  plugins: [
    'react-hooks',
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
    "react-hooks/rules-of-hooks": 'error',
    "react-hooks/exhaustive-deps": 'warn',
  }
};