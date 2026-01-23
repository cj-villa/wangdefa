import { BetaSchemaForm } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React from 'react';
import request from 'src/request';
import { type FundTransaction, FundTransactionType } from 'src/request/type/fund';
import { ProFormColumnsType } from '@ant-design/pro-form/es/components/SchemaForm/typing';
import { ListSelect } from 'src/components';
import { configModal } from 'src/share/ui/show-modal';

interface CreateFundTransactionProps {
  initialValues?: FundTransaction;
  onSuccess?: () => void;
}

export const CreateFundTransaction = ({ initialValues, onSuccess }: CreateFundTransactionProps) => {
  const [form] = Form.useForm();

  configModal({
    async onConfirm() {
      try {
        const formData = await form.validateFields();
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
        throw error;
      }
    },
  });

  const columns: ProFormColumnsType[] = [
    {
      title: '基金',
      dataIndex: 'fundId',
      formItemProps: {
        rules: [{ required: true, message: '请选择基金' }],
      },
      renderFormItem: () => (
        <ListSelect request="/api/fund/list" fieldNames={{ label: 'name', value: 'id' }} />
      ),
    },
    {
      title: '交易类型',
      dataIndex: 'transactionType',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择交易类型',
        options: [
          { label: '买入', value: FundTransactionType.BUY },
          { label: '卖出', value: FundTransactionType.SELL },
        ],
      },
      formItemProps: {
        rules: [{ required: true, message: '请选择交易类型' }],
      },
      initialValue: FundTransactionType.BUY,
    },
    {
      title: '交易份额',
      dataIndex: 'shares',
      valueType: 'digit',
      fieldProps: {
        placeholder: '请输入交易份额',
        min: 1,
        precision: 0,
        style: { width: '100%' },
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入交易份额' }],
      },
    },
    {
      title: '份额确认日期',
      dataIndex: 'transactionDate',
      valueType: 'date',
      fieldProps: {
        allowClear: true,
        placeholder: '默认根据当前时间T+1进行计算',
        style: { width: '100%' },
      },
    },
  ];

  return (
    <BetaSchemaForm
      layoutType="Form"
      form={form}
      columns={columns}
      initialValues={initialValues}
      submitter={{ render: () => null }}
    />
  );
};
