import { BetaSchemaForm } from '@ant-design/pro-components';
import { configModal } from 'src/share/show-modal';
import { Form, message } from 'antd';
import request from 'src/request';
import React from 'react';

interface CreateFundProps {
  initialValues?: any;
}

export const CreateFund: React.FC<CreateFundProps> = ({ initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  configModal({
    async onConfirm() {
      const formData = await form.validateFields();
      try {
        if (initialValues) {
          // 编辑模式
          await request.updateFund({ ...formData, id: initialValues.id });
          message.success('更新成功');
        } else {
          // 创建模式
          await request.createFund(formData);
          message.success('创建成功');
        }
      } catch (error) {
        message.error(initialValues ? '更新失败' : '创建失败');
        throw error;
      }
    },
  });

  return (
    <BetaSchemaForm
      form={form}
      submitter={false}
      columns={[
        {
          title: '基金名称',
          dataIndex: 'name',
          formItemProps: {
            rules: [
              { required: true, message: '请输入基金名称' },
              { max: 32, message: '基金名称不能超过32个字符' },
            ],
          },
        },
        {
          title: '基金编码',
          dataIndex: 'code',
          formItemProps: {
            rules: [
              { required: true, message: '请输入基金编码' },
              { max: 32, message: '基金编码不能超过32个字符' },
              {
                pattern: /^[a-zA-Z0-9]+$/,
                message: '基金编码只能包含字母和数字',
              },
            ],
          },
        },
      ]}
      layoutType="Form"
      colProps={{ span: 24 }}
    />
  );
};
