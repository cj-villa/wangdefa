/** 地图标记 */
import { useEffect, useRef } from 'react';
import { Section } from 'src/components';
import { AMap } from 'src/utils';
import { useMapPinContext } from './context';
import s from './index.module.less';
import { ActionBar } from './action-bar';
import { Flex } from 'antd';
import { SiderBar } from './sider-bar';

export const MapPinPage = () => {
  const {
    aMapRef,
    positionState: [position, setPosition],
    pinListState: [pinList, setPinList],
  } = useMapPinContext();
  const mapRef = useRef<any>();

  const initMap = async (aMap: AMap) => {
    const map = await aMap.getMap('map-container');
    if (position?.length) {
      const gaMap = await aMap.getAMap();
      map.setCenter(new gaMap.LngLat(...position));
    } else {
      setPosition(map.getCenter().toJSON());
    }
    mapRef.current = map;

    ['Scale', 'MapType', 'ToolBar'].forEach((plugin) => {
      aMap.getPluginInstance(plugin).then((instance) => {
        map.addControl(instance);
      });
    });
  };

  // 补偿marker
  const compensatePinList = async () => {
    if (!aMapRef.current || !pinList) {
      return;
    }
    const AMap = await aMapRef.current.getAMap();
    const map = await aMapRef.current.getMap('map-container');
    for (const key of Object.keys(pinList)) {
      const pinItem = pinList[key];
      const marker = new AMap.Marker({
        position: new AMap.LngLat(pinItem.location.lng, pinItem.location.lat),
        title: pinItem.name,
        label: { content: pinItem.name, direction: 'top' },
      });
      map.add(marker);
      pinList[key].marker = marker;
    }
    setPinList(pinList);
  };

  useEffect(() => {
    const aMap = new AMap({
      plugins: new Set(['AutoComplete']),
    });
    aMapRef.current = aMap;
    initMap(aMap);
    compensatePinList();
  }, []);

  return (
    <Section className={s['map-pin-page']} vertical fullpage>
      <ActionBar />
      <Flex style={{ flex: 1 }}>
        <div id="map-container" className={s['map-container']} />
        <SiderBar />
      </Flex>
    </Section>
  );
};
