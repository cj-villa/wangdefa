declare module '*.svg' {
  import * as React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export { ReactComponent };
  export default src;
}

// global.d.ts
declare module '*.module.less' {
  const classes: Record<string, string>;
  export default classes;
}
