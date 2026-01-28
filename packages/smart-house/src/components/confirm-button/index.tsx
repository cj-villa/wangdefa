import React from 'react';
import { Button, type ButtonProps, Popconfirm, Spin, Typography } from 'antd';
import { useRequest } from 'ahooks';
import { asyncNoop } from 'src/share/toolkits/empty';

interface ConfirmButtonProps extends Omit<ButtonProps, 'type' | 'loading'> {
  type?: 'text' | 'button';
  confirmText?: string;
}

export const ConfirmButton: React.FC<React.PropsWithChildren<ConfirmButtonProps>> = (props) => {
  const { children, type, onClick = asyncNoop, confirmText, ...rest } = props;

  const { runAsync, loading } = useRequest<any, any>(
    async (...param: Parameters<typeof onClick>) => {
      return onClick(...(param ?? []));
    },
    {
      manual: true,
    }
  );

  const wrapConfirm = (children: React.ReactNode) =>
    !confirmText ? (
      React.isValidElement(children) ? (
        React.cloneElement<any>(children, { onClick: runAsync })
      ) : (
        children
      )
    ) : (
      <Popconfirm title={confirmText} onConfirm={runAsync} okText="确认" cancelText="取消">
        {children}
      </Popconfirm>
    );

  if (type !== 'button') {
    return wrapConfirm(
      <Spin wrapperClassName="inline-block" spinning={loading}>
        <Typography.Link {...rest}>{children}</Typography.Link>
      </Spin>
    );
  }
  return wrapConfirm(
    <Button loading={loading} {...rest}>
      {children}
    </Button>
  );
};
