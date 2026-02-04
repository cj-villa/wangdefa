import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import s from './index.module.less';

interface PortalContext {
  refs: Record<string, HTMLDivElement>;
  setRefs: React.Dispatch<React.SetStateAction<Record<string, HTMLDivElement>>>;
}

export const PortalContext = React.createContext<PortalContext>({ refs: {}, setRefs: () => ({}) });

export const PortalProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [refs, setRefs] = React.useState<Record<string, HTMLDivElement>>({});
  return <PortalContext.Provider value={{ refs, setRefs }}>{children}</PortalContext.Provider>;
};

export const PortalTarget: React.FC<React.PropsWithChildren<{ id: string }>> = ({
  children,
  id,
}) => {
  const { setRefs } = React.useContext(PortalContext);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    setRefs((refs) => ({ ...refs, [id]: ref.current! }));
    return () => {
      setRefs(({ id, ...refs }) => refs);
    };
  }, []);

  return (
    <div className={s['portal-target']} id={id} ref={ref}>
      {children}
    </div>
  );
};

export const PortalBody: React.FC<React.PropsWithChildren<{ id: string }>> = ({ id, children }) => {
  const { refs } = React.useContext(PortalContext);
  if (!refs[id]) {
    return null;
  }
  return createPortal(children, refs[id]);
};
