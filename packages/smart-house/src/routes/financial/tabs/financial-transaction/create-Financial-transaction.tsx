import { BetaSchemaForm } from '@ant-design/pro-components';
import { ProFormColumnsType } from '@ant-design/pro-form/es/components/SchemaForm/typing';
import { Form, message } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { ListSelect } from 'src/components';
import request from 'src/request';
import { type FinancialTransaction, FinancialTransactionType } from 'src/request/type/financial';
import { useConfigModal } from 'src/share/ui/show-modal';

interface CreateFinancialTransactionProps {
  initialValues?: FinancialTransaction;
  onSuccess?: () => void;
}

export const CreateFinancialTransaction = ({
  initialValues,
  onSuccess,
}: CreateFinancialTransactionProps) => {
  const [form] = Form.useForm();
  const isEdit = Boolean(initialValues?.id);
  const editingId = initialValues?.id;
  const KEEP_OPEN_ERROR = '__KEEP_OPEN_AFTER_CREATE__';

  const formatPayload = (formData: Record<string, any>) => {
    return {
      financialId: formData.financialId,
      transactionType: formData.transactionType,
      amount: String(formData.amount),
      fee: String(formData.fee ?? 0),
      transactionDate: dayjs(formData.transactionDate).toISOString(),
      ensureDate: dayjs(formData.ensureDate).toISOString(),
    };
  };

  useConfigModal({
    async onConfirm() {
      try {
        const formData = await form.validateFields();
        const payload = formatPayload(formData);
        if (isEdit && editingId) {
          await request.updateFinancialTransaction({ ...payload, id: editingId });
          message.success('更新成功');
        } else {
          await request.createFinancialTransaction(payload);
          const continueCreate = Boolean(formData.continueCreate);
          message.success(continueCreate ? '创建成功，可继续新建' : '创建成功');
          if (continueCreate) {
            throw new Error(KEEP_OPEN_ERROR);
          }
        }
        onSuccess?.();
      } catch (error) {
        if (error instanceof Error && error.message === KEEP_OPEN_ERROR) {
          throw error;
        }
        message.error(isEdit ? '更新失败' : '创建失败');
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
      title: '手续费',
      dataIndex: 'fee',
      valueType: 'digit',
      fieldProps: {
        placeholder: '请输入手续费',
        min: 0,
        precision: 2,
        style: { width: '100%' },
      },
      initialValue: 0,
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
    ...(!isEdit
      ? [
          {
            title: '保存后继续新建',
            dataIndex: 'continueCreate',
            valueType: 'switch' as const,
            colProps: { span: 24 },
            initialValue: false,
          },
        ]
      : []),
  ];

  return (
    <BetaSchemaForm
      layoutType="Form"
      form={form}
      columns={columns}
      initialValues={{ fee: 0, ...initialValues }}
      submitter={{ render: () => null }}
    />
  );
};
