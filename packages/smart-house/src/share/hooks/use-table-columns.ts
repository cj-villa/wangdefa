import { ProColumns } from '@ant-design/pro-components';
import { useMemo } from 'react';
import { useRoute } from 'src/share/hooks/use-route';
import { ProColumnType } from '@ant-design/pro-table/es/typing';

export const useTableColumns = <DataSource, ValueType = 'text'>(
  columns: ProColumnType<DataSource, ValueType>[]
) => {
  const { params } = useRoute();
  return useMemo(
    () =>
      columns.map((column) => {
        const dataIndex =
          typeof column.dataIndex === 'string'
            ? column.dataIndex
            : JSON.stringify(column.dataIndex);
        const initialValue = params[dataIndex];
        if (initialValue) {
          column.initialValue = initialValue;
        }
        return column;
      }),
    [columns]
  );
};
