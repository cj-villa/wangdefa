import { Modal } from 'antd';
import React, { useContext, useEffect } from 'react';

interface ModalContextStateConfig {
  onConfirm?: (close: VoidFunction) => Promise<any> | any;
}

interface ModalContextState {
  config: ModalContextStateConfig;
  configModal: (config: ModalContextState['config']) => void;
}

interface ConfigRef extends ModalContextStateConfig {}

export const ModalContext = React.createContext<ModalContextState>({
  config: {},
  configModal: () => {},
});

const useModalContext = () => {
  const state = useContext(ModalContext);
  if (!state) {
    throw new Error('useModalContext must be used within a ModalContext');
  }
  return state;
};

export const ModalProvider: React.FC<
  React.PropsWithChildren<{
    configRef: { current: ConfigRef };
  }>
> = ({ children, configRef }) => {
  const [config, configModal] = React.useState<ModalContextState['config']>({});

  const onConfigChang = (nextConfig: ModalContextState['config']) => {
    configModal(nextConfig);
    configRef.current = nextConfig;
  };

  return (
    <ModalContext.Provider value={{ config, configModal: onConfigChang }}>
      {children}
    </ModalContext.Provider>
  );
};

export const configModal = (config: ModalContextState['config']) => {
  const { configModal } = useModalContext();

  useEffect(() => {
    configModal(config);
  }, []);
};

export const showModal = ({
  content,
  onOk,
  ...params
}: Omit<Parameters<typeof Modal.info>[0], 'onOk'> & {
  onOk?: (close: VoidFunction, state: any) => void;
} = {}) => {
  // 直接用引用
  const configRef: { current: ConfigRef } = { current: {} };
  return Modal.confirm({
    ...params,
    content: <ModalProvider configRef={configRef}>{content}</ModalProvider>,
    onOk: async (close) => {
      const state = await configRef.current.onConfirm?.(close);
      return onOk?.(close, state);
    },
    icon: null,
  });
};
