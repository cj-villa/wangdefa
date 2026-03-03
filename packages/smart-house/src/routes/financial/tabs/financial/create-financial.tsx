import { BetaSchemaForm, type ProFormColumnsType } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React, { useMemo } from 'react';
import { ConsulSelect } from 'src/components';
import request from 'src/request';
import { useConfigModal } from 'src/share/ui/show-modal';

interface CreateFinancialProps {
  initialValues?: any;
}

export const CreateFinancial: React.FC<CreateFinancialProps> = ({ initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  useConfigModal({
    async onConfirm() {
      const formData = await form.validateFields();
      try {
        if (initialValues) {
          // 编辑模式
          await request.updateFinancial({ ...formData, id: initialValues.id });
          message.success('更新成功');
        } else {
          // 创建模式
          await request.createFinancial(formData);
          message.success('创建成功');
        }
      } catch (error) {
        message.error(initialValues ? '更新失败' : '创建失败');
        throw error;
      }
    },
  });

  const columns = useMemo<ProFormColumnsType[]>(() => {
    return [
      {
        title: '理财名称',
        dataIndex: 'name',
        formItemProps: {
          rules: [
            { required: true, message: '请输入理财名称' },
            { max: 32, message: '理财名称不能超过32个字符' },
          ],
        },
        fieldProps: {
          maxLength: 32,
          showCount: true,
        },
      },
      {
        title: '购买渠道',
        dataIndex: 'channel',
        formItemProps: {
          rules: [{ required: true, message: '请选择购买渠道' }],
        },
        renderFormItem: (_, props) => {
          return <ConsulSelect {...props} name="financial_channel" />;
        },
      },
      {
        title: '理财编码',
        dataIndex: 'code',
        formItemProps: {
          rules: [
            { required: true, message: '请输入理财编码' },
            { max: 32, message: '理财编码不能超过32个字符' },
            {
              pattern: /^[a-zA-Z0-9]+$/,
              message: '理财编码只能包含字母和数字',
            },
          ],
        },
        fieldProps: {
          maxLength: 32,
          showCount: true,
        },
      },
      {
        title: '理财顺延时间',
        dataIndex: 'delay',
        valueType: 'digit',
        formItemProps: {
          rules: [
            { required: true, message: '请输入理财顺延时间' },
            { type: 'number', min: 0, max: 3, message: '理财顺延时间不能小于0' },
          ],
        },
        fieldProps: {
          min: 0,
          max: 3,
        },
      },
    ];
  }, []);

  return (
    <BetaSchemaForm
      form={form}
      submitter={false}
      columns={columns}
      layoutType="Form"
      colProps={{ span: 24 }}
    />
  );
};
