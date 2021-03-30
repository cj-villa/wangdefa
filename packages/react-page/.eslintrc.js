module.exports = {
  root: true,
  extends: ['eslint-config-alloy', 'eslint-config-alloy/react', '../../.eslintrc.ts'],
  plugins: ['react-hooks'],
  globals: {
    React: false,
    ReactDOM: false,
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
