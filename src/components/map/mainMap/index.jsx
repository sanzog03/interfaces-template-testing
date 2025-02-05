import { MapboxProvider } from './context';

export const MainMap = ({ children }) => {
  return (
    <MapboxProvider>
      {/* Other components that need access to the map */}
      {children}
    </MapboxProvider>
  );
};
