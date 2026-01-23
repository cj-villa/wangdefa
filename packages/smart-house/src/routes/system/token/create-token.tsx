import { BetaSchemaForm } from '@ant-design/pro-components';
import { configModal } from 'src/share/ui/show-modal';
import { Form, message } from 'antd';
import request from 'src/request';

export const CreateToken = () => {
  const [form] = Form.useForm();

  configModal({
    async onConfirm() {
      const formData = await form.validateFields();
      await request.createToken(formData);
      message.success('创建成功');
    },
  });

  return (
    <BetaSchemaForm
      form={form}
      submitter={false}
      columns={[
        {
          title: '名称',
          dataIndex: 'name',
          formItemProps: {
            rules: [{ required: true }],
          },
        },
      ]}
    />
  );
};
