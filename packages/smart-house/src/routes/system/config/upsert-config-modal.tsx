import React, { useEffect } from 'react';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { Form, message, Spin } from 'antd';
import { useRequest } from 'ahooks';
import request from 'src/request';
import { configModal } from 'src/share/ui/show-modal';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

export const UpsertConfigModal = (props: { name?: string }) => {
  const { name } = props;
  const [form] = Form.useForm();

  const { runAsync, loading } = useRequest(request.getSystemConfig, {
    manual: true,
  });

  configModal({
    async onConfirm() {
      const formData = await form.validateFields();
      console.log('formData', formData);
      return request.updateSystemConfig(formData).then(() => {
        message.success('配置更新成功');
      });
    },
  });

  useEffect(() => {
    if (name) {
      runAsync(name).then((data) => {
        form.setFieldsValue({ key: name, data: JSON.stringify(data, null, 2) });
        return data;
      });
    }
  }, [name]);

  return (
    <Spin spinning={loading}>
      <BetaSchemaForm
        submitter={{ render: () => null }}
        form={form}
        columns={[
          {
            title: '名称',
            dataIndex: 'key',
            fieldProps: { disabled: name },
            formItemProps: { rules: [{ required: true, message: '请输入名称' }] },
          },
          {
            title: '配置',
            dataIndex: 'data',
            formItemProps: { rules: [{ required: true, message: '请输入配置' }] },
            renderFormItem: (_, { onChange, value }) => (
              <CodeMirror value={value} onUpdate={onChange} height="200px" extensions={[json()]} />
            ),
          },
        ]}
      />
    </Spin>
  );
};
