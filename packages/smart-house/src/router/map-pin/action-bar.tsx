import { AimOutlined } from '@ant-design/icons';
import { Flex, Input, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { Divider, Space } from 'antd';
import React from 'react';
import s from './index.module.less';
import { type PinItem, useMapPinContext } from './context';
import { useRequest } from 'ahooks';

export const ActionBar: React.FC = () => {
  const {
    positionState: [position = [], setPosition],
    aMapRef,
    pinListState: [, setPinList],
  } = useMapPinContext();

  const { data, runAsync: searchPlace } = useRequest(
    async (keyword: string) => {
      if (!keyword) {
        return [];
      }
      const result = await aMapRef.current?.autoComplete?.search(keyword);
      return result.tips;
    },
    {
      manual: true,
      debounceWait: 500,
    }
  );

  return (
    <Flex>
      <Space className={s['action-bar']} split={<Divider type="vertical" />}>
        <Select
          prefix={<SearchOutlined />}
          placeholder="搜索"
          style={{ width: 300 }}
          showSearch
          onSearch={searchPlace}
          filterOption={false}
          options={data}
          fieldNames={{ label: 'name', value: 'id' }}
          labelInValue
          optionRender={(option: any) => {
            return (
              <Flex vertical>
                <Typography.Text>{option.data?.name || option.name}</Typography.Text>
                <Typography.Text type="secondary">{option.data?.district}</Typography.Text>
              </Flex>
            );
          }}
          onSelect={async (_, option: PinItem) => {
            if (!aMapRef.current) {
              return;
            }
            const AMap = await aMapRef.current.getAMap();
            const map = await aMapRef.current.getMap('map-container');
            const marker = new AMap.Marker({
              // //webapi.amap.com/theme/v1.3/markers/b/mark_bs.png
              position: new AMap.LngLat(option.location.lng, option.location.lat),
              title: option.name,
              label: { content: option.name, direction: 'top' },
            });
            map.add(marker);
            setPinList((prev = {}) => {
              prev[option.id] = {
                ...option,
                location: { lng: option.location.lng, lat: option.location.lat },
                marker,
              };
              return { ...prev };
            });
          }}
        />
        <Flex gap={4}>
          <Input
            addonBefore="经度"
            style={{ width: 150 }}
            value={position[0]}
            onChange={(e) => setPosition([Number(e.target.value), position[1]])}
          />
          <Input
            addonBefore="纬度"
            style={{ width: 150 }}
            value={position[1]}
            onChange={(e) => setPosition([position[0], Number(e.target.value)])}
          />
          <AimOutlined
            onClick={async () => {
              if (!aMapRef.current) {
                return;
              }
              const position = await aMapRef.current.geolocation
                .getCurrentPosition()
                .then((res) => {
                  return [res.position.lng, res.position.lat];
                });
              if (!position) {
                return;
              }
              setPosition(position);
              const AMap = await aMapRef.current.getAMap();
              const map = await aMapRef.current.getMap('map-container');
              map.setCenter(new AMap.LngLat(...position));
            }}
            className={s['action-icon']}
          />
        </Flex>
      </Space>
    </Flex>
  );
};
