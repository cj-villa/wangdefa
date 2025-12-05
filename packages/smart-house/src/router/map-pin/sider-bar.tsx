import cn from 'classnames';
import {
  AimOutlined,
  DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { Flex } from 'antd';
import { ProList } from '@ant-design/pro-components';
import { useMapPinContext } from './context';
import s from './index.module.less';

export const SiderBar = () => {
  const {
    aMapRef,
    positionState: [, setPosition],
    pinListState: [pinList = {}, setPinList],
    navigationState: [navigation = {}, setNavigation],
  } = useMapPinContext();
  const [open, setOpen] = useState(true);

  const trigger = useMemo(() => {
    if (open) {
      return (
        <MenuUnfoldOutlined className={s['sider-bar-trigger']} onClick={() => setOpen(false)} />
      );
    }
    return <MenuFoldOutlined className={s['sider-bar-trigger']} onClick={() => setOpen(true)} />;
  }, [open]);

  return (
    <>
      {trigger}
      <Flex vertical className={cn(s['sider-bar'], { [s['sider-bar_hidden']]: !open })}>
        <ProList
          rowKey="id"
          headerTitle={<p style={{ whiteSpace: 'nowrap' }}>导航</p>}
          metas={{
            title: { dataIndex: 'name' },
            description: {
              render: (_, record) => {
                return `${record.district}${record.city.join(' ')}${record.address}`;
              },
            },
            actions: {
              render: (text, row: any) => [
                <DeleteOutlined
                  onClick={async () => {
                    setNavigation((prev) => {
                      delete prev[row.id];
                      return { ...prev };
                    });
                  }}
                />,
                <AimOutlined
                  onClick={async () => {
                    if (!aMapRef.current) {
                      return;
                    }
                    const position = [row.location.lng, row.location.lat];
                    setPosition(position);
                    const AMap = await aMapRef.current.getAMap();
                    const map = await aMapRef.current.getMap('map-container');
                    map.setCenter(new AMap.LngLat(...position));
                  }}
                  className={s['action-icon']}
                />,
              ],
            },
          }}
          dataSource={Object.values(navigation)}
        />
        <ProList
          rowKey="id"
          headerTitle={<p style={{ whiteSpace: 'nowrap' }}>已选中的地点</p>}
          metas={{
            title: { dataIndex: 'name' },
            description: {
              render: (_, record) => {
                return `${record.district}${record.city.join(' ')}${record.address}`;
              },
            },
            actions: {
              render: (text, row: any) => [
                <DeleteOutlined
                  onClick={async () => {
                    if (!aMapRef.current) {
                      return;
                    }
                    setPinList((prev = {}) => {
                      delete prev[row.id];
                      return { ...prev };
                    });
                    const map = await aMapRef.current.getMap('map-container');
                    map.remove(row.marker);
                  }}
                />,
                <AimOutlined
                  onClick={async () => {
                    if (!aMapRef.current) {
                      return;
                    }
                    const position = [row.location.lng, row.location.lat];
                    setPosition(position);
                    const AMap = await aMapRef.current.getAMap();
                    const map = await aMapRef.current.getMap('map-container');
                    map.setCenter(new AMap.LngLat(...position));
                  }}
                  className={s['action-icon']}
                />,
                <SendOutlined
                  onClick={async () => {
                    setNavigation((prev) => {
                      prev[row.id] = row;
                      return { ...prev };
                    });
                  }}
                />,
              ],
            },
          }}
          dataSource={Object.values(pinList)}
        />
      </Flex>
    </>
  );
};
