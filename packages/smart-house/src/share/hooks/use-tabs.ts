import { useUpdateEffect } from 'ahooks';
import { TabsProps } from 'antd/es/tabs';
import { useMemo, useState } from 'react';
import { useRoute } from 'src/share/hooks/use-route';

export const DEFAULT_TAB_KEY = 'tab_key';

export const useTab = (
  options: string[] | NonNullable<TabsProps['items']>,
  tabOptions: {
    defaultTab?: string;
    tabKey?: string;
    /** 是否保留之前的参数 */
    reservePrevParams?: boolean;
  } = {}
) => {
  const { tabKey = DEFAULT_TAB_KEY, defaultTab, reservePrevParams } = tabOptions;
  const { params, setParam } = useRoute();

  const stringOptionsList = useMemo<string[]>(
    () => options.map((i) => (typeof i === 'object' ? i.key : i)),
    [options]
  );

  const [tab, setTab] = useState<string>(defaultTab ?? stringOptionsList?.[0]);

  const handlerTabChange = (nextTab: string) => {
    return setTab(nextTab);
  };

  useUpdateEffect(() => {
    // 防死循环
    if (tab === params[tabKey]) {
      return;
    }
    setParam(tabKey, tab, !reservePrevParams);
  }, [tab]);

  return { activeKey: tab, onChange: handlerTabChange };
};
