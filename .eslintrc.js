/** 通用的eslint配置 */
module.exports = {
  plugins: ['prettier'],
  rules: {
    /** 空格 */
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true,
      },
    ],
    /** 代码规范 */
    'prettier/prettier': 'error',
  },
};
