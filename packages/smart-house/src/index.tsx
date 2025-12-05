import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';

window._AMapSecurityConfig = {
  securityJsCode: '708301eade5faae33ef9c00d070ee54a',
};

createRoot(document.body).render(<App />);
