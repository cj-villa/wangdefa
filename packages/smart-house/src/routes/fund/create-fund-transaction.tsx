import { Form, Select, DatePicker, InputNumber, message } from 'antd';
import React, { useEffect } from 'react';
import request from 'src/request';
import { Fund, FundTransaction, FundTransactionType } from 'src/request/type/fund';

const { Option } = Select;

interface CreateFundTransactionProps {
  initialValues?: FundTransaction;
  onSuccess?: () => void;
}

export const CreateFundTransaction = ({ initialValues, onSuccess }: CreateFundTransactionProps) => {
  const [form] = Form.useForm();
  const [funds, setFunds] = React.useState<Fund[]>([]);

  useEffect(() => {
    const loadFunds = async () => {
      try {
        const response = await request.listFund({ current: 1, pageSize: 100 });
        setFunds(response.data?.list || []);
      } catch (error) {
        message.error('加载基金列表失败');
      }
    };
    loadFunds();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        transactionDate: initialValues.transactionDate
          ? new Date(initialValues.transactionDate)
          : undefined,
      });
    }
  }, [initialValues, form]);

  const handleSubmit = async (formData: any) => {
    try {
      if (initialValues?.id) {
        await request.updateFundTransaction({ ...formData, id: initialValues.id });
        message.success('更新成功');
      } else {
        await request.createFundTransaction(formData);
        message.success('创建成功');
      }
      onSuccess?.();
    } catch (error) {
      message.error(initialValues?.id ? '更新失败' : '创建失败');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        transactionType: FundTransactionType.BUY,
        transactionDate: new Date(),
      }}
    >
      <Form.Item name="fundId" label="基金" rules={[{ required: true, message: '请选择基金' }]}>
        <Select placeholder="请选择基金" disabled={!!initialValues}>
          {funds.map((fund) => (
            <Option key={fund.id} value={fund.id}>
              {fund.name} ({fund.code})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="transactionType"
        label="交易类型"
        rules={[{ required: true, message: '请选择交易类型' }]}
      >
        <Select placeholder="请选择交易类型">
          <Option value={FundTransactionType.BUY}>买入</Option>
          <Option value={FundTransactionType.SELL}>卖出</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="amount"
        label="交易金额"
        rules={[{ required: true, message: '请输入交易金额' }]}
      >
        <InputNumber style={{ width: '100%' }} placeholder="请输入交易金额" min={0} precision={2} />
      </Form.Item>

      <Form.Item
        name="shares"
        label="交易份额"
        rules={[{ required: true, message: '请输入交易份额' }]}
      >
        <InputNumber style={{ width: '100%' }} placeholder="请输入交易份额" min={0} precision={4} />
      </Form.Item>

      <Form.Item
        name="transactionPrice"
        label="交易价格"
        rules={[{ required: true, message: '请输入交易价格' }]}
      >
        <InputNumber style={{ width: '100%' }} placeholder="请输入交易价格" min={0} precision={4} />
      </Form.Item>

      <Form.Item
        name="transactionDate"
        label="交易日期"
        rules={[{ required: true, message: '请选择交易日期' }]}
      >
        <DatePicker style={{ width: '100%' }} placeholder="请选择交易日期" />
      </Form.Item>
    </Form>
  );
};