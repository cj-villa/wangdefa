import { useLocalStorageState } from 'ahooks';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { type AMap } from 'src/utils';

export interface PinItem {
  adcode: string;
  address: string;
  city: string[];
  district: string;
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  name: string;
  typecode: string;
  marker: any;
}

export const MapPinContext = createContext<{
  aMapRef: React.MutableRefObject<AMap | undefined>;
  // 地图中心点
  positionState: ReturnType<typeof useLocalStorageState<number[]>>;
  // 地图上所有标记点
  pinListState: ReturnType<typeof useLocalStorageState<Record<string, PinItem>>>;
  // 导航点
  navigationState: [
    Record<string, PinItem>,
    React.Dispatch<React.SetStateAction<Record<string, PinItem>>>
  ];
} | null>(null);

export const MapPinContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const positionState = useLocalStorageState<number[]>('_map_pin_page_position_state_', {
    defaultValue: [],
  });
  const pinListState = useLocalStorageState<Record<string, PinItem>>(
    '_map_pin_page_pin_list_state_',
    {
      defaultValue: {},
      serializer: (value = {}) => {
        return JSON.stringify(
          Object.keys(value).reduce((acc: Record<string, Omit<PinItem, 'marker'>>, key) => {
            const { marker, ...rest } = value[key];
            acc[key] = rest;
            return acc;
          }, {})
        );
      },
    }
  );
  const navigationState = useState<Record<string, PinItem>>({});
  const aMapRef = useRef<AMap>();

  return (
    <MapPinContext.Provider value={{ positionState, pinListState, navigationState, aMapRef }}>
      {children}
    </MapPinContext.Provider>
  );
};

export const useMapPinContext = () => {
  const value = useContext(MapPinContext);
  if (!value) {
    throw new Error('useMapPinContext must be used within a MapPinContextProvider');
  }
  return value;
};
