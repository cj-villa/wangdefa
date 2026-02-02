import { BetaSchemaForm } from '@ant-design/pro-components';
import { Form, message } from 'antd';
import React from 'react';
import request from 'src/request';
import { type FinancialTransaction, FinancialTransactionType } from 'src/request/type/financial';
import { ProFormColumnsType } from '@ant-design/pro-form/es/components/SchemaForm/typing';
import { ListSelect } from 'src/components';
import { configModal } from 'src/share/ui/show-modal';

interface CreateFinancialTransactionProps {
  initialValues?: FinancialTransaction;
  onSuccess?: () => void;
}

export const CreateFinancialTransaction = ({
  initialValues,
  onSuccess,
}: CreateFinancialTransactionProps) => {
  const [form] = Form.useForm();
  const transactionDate = Form.useWatch('transactionDate', form);

  configModal({
    async onConfirm() {
      try {
        const formData = await form.validateFields();
        if (initialValues?.id) {
          await request.updateFinancialTransaction({ ...formData, id: initialValues.id });
          message.success('更新成功');
        } else {
          await request.createFinancialTransaction(formData);
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
      dataIndex: 'financialId',
      formItemProps: {
        rules: [{ required: true, message: '请选择基金' }],
      },
      renderFormItem: () => (
        <ListSelect
          request="/api/financial/list"
          fieldNames={{ label: 'name', value: 'id' }}
          tips="code"
        />
      ),
    },
    {
      title: '交易类型',
      dataIndex: 'transactionType',
      valueType: 'select',
      fieldProps: {
        placeholder: '请选择交易类型',
        options: [
          { label: '买入', value: FinancialTransactionType.BUY },
          { label: '卖出', value: FinancialTransactionType.SELL },
        ],
      },
      formItemProps: {
        rules: [{ required: true, message: '请选择交易类型' }],
      },
      initialValue: FinancialTransactionType.BUY,
    },
    {
      title: '交易金额',
      dataIndex: 'amount',
      valueType: 'digit',
      fieldProps: {
        placeholder: '请输入交易金额',
        min: 1,
        precision: 2,
        style: { width: '100%' },
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入交易金额' }],
      },
    },
    {
      title: '交易日期',
      dataIndex: 'transactionDate',
      valueType: 'date',
      fieldProps: { style: { width: '100%' } },
      formItemProps: { rules: [{ required: true }] },
    },
    {
      title: '份额确认日期',
      dataIndex: 'ensureDate',
      valueType: 'date',
      fieldProps: { style: { width: '100%' } },
      formItemProps: { rules: [{ required: true }] },
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
