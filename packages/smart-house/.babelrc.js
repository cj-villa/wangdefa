module.exports = {
  plugins: [require.resolve('react-refresh/babel')],
  presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
};
