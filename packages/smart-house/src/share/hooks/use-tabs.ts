import { useEffect, useMemo, useState } from 'react';
import { useRoute } from 'src/share/hooks/use-route';
import { useLocation } from 'react-router-dom';
import { TabsProps } from 'antd/es/tabs';
import { useUpdateEffect } from 'ahooks';

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

  const location = useLocation();
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

  useEffect(() => {
    const paramsTabKey = params[tabKey];
    // 防死循环
    if (tab === paramsTabKey) {
      return;
    }
    if (typeof paramsTabKey !== 'string' || !stringOptionsList.includes(paramsTabKey)) {
      return;
    }
    handlerTabChange(paramsTabKey);
  }, [location]);

  return { activeKey: tab, onChange: handlerTabChange };
};
