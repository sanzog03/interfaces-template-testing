import { MapboxProvider } from './context';

const MainMap = ({ children }) => {
  return (
    <MapboxProvider>
      {/* Other components that need access to the map */}
      {children}
    </MapboxProvider>
  );
};

export default MainMap;
