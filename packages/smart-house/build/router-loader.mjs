/** router-loader 将 component 中的组件路径修改为真正的组件 */
import * as path from 'path';

const routerLoader = function (content) {
  const fileName = path.basename(this.resourcePath);
  if (fileName !== 'router.config.tsx') {
    return content;
  }
  const components = new Set(content.match(/(?<=component: ')(.*)?(?=')/g));
  const result = `${[...components]
    .map(
      (component) => `import ${component.replace(/[^\w]/g, '').toUpperCase()} from '${component}';`
    )
    .join('\n')}${content}`.replace(
    /component: '(.*)'/g,
    (_, p1) => `component: <${p1.replace(/[^\w]/g, '').toUpperCase()} />`
  );
  return result;
};

export default routerLoader;
