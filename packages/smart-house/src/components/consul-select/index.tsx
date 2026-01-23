import { Select, SelectProps } from 'antd';
import React from 'react';
import { useRequest } from 'ahooks';
import request from 'src/request';

interface ConsulSelectProps extends Omit<SelectProps, 'options'> {
  name: string;
}

export const useConsulSelectOptions = (key: string) => {
  const { data } = useRequest(() => request.getSystemConfig(`/options/${key}`), {
    cacheKey: `consul-select-${key}`,
    cacheTime: 30000,
  });

  return {
    options: Object.entries(data || {}).map(([key, value]) => ({
      label: value,
      value: key,
    })),
    valueEnum: Object.entries(data || {}).reduce<Record<string, { text: string }>>(
      (valueEnum, [key, value]) => {
        valueEnum[key] = { text: value };
        return valueEnum;
      },
      {}
    ),
  };
};

export const ConsulSelect: React.FC<ConsulSelectProps> = (props) => {
  const { name, ...rest } = props;

  const { options } = useConsulSelectOptions(name);

  return <Select {...rest} options={options} />;
};
