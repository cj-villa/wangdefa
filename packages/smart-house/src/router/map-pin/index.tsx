/** 地图标记 */
import { MapPinContextProvider } from './context';
import { MapPinPage } from './map-pin';

export default () => {
  return (
    <MapPinContextProvider>
      <MapPinPage />
    </MapPinContextProvider>
  );
};
