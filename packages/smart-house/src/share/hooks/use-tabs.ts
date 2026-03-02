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

  const routeTab = useMemo(() => {
    const value = params[tabKey];
    return typeof value === 'string' ? value : undefined;
  }, [params, tabKey]);

  const initialTab = useMemo(() => {
    if (routeTab && stringOptionsList.includes(routeTab)) {
      return routeTab;
    }
    return defaultTab ?? stringOptionsList?.[0];
  }, [defaultTab, routeTab, stringOptionsList]);

  const [tab, setTab] = useState<string>(initialTab);

  const activeKey = useMemo(() => {
    if (routeTab && stringOptionsList.includes(routeTab)) {
      return routeTab;
    }
    return tab;
  }, [routeTab, stringOptionsList, tab]);

  const handlerTabChange = (nextTab: string) => {
    if (!stringOptionsList.includes(nextTab)) {
      return;
    }
    setTab(nextTab);
    if (nextTab === params[tabKey]) {
      return;
    }
    setParam(tabKey, nextTab, !reservePrevParams);
  };

  useUpdateEffect(() => {
    if (!activeKey || activeKey === params[tabKey]) {
      return;
    }
    setParam(tabKey, activeKey, !reservePrevParams);
  }, [activeKey, params, reservePrevParams, setParam, tabKey]);

  return { activeKey, onChange: handlerTabChange };
};
