import { useEffect } from 'react';
import { useMapbox } from '../../../context/mapContext';
import {
  addSourceLayerToMap,
  addSourcePolygonToMap,
  getSourceId,
  getLayerId,
  layerExists,
  sourceExists,
} from '../../../utils';

// eslint-disable-next-line prettier/prettier
export const VisualizationLayer = ({
  vizItem,
  onClickOnLayer,
  onHoverOverLayer,
}) => {
  const { map } = useMapbox();
  const vizItemId = vizItem.id;

  useEffect(() => {
    if (!map || !vizItem) return;
    const feature = vizItem;
    const rasterSourceId = getSourceId('raster' + vizItemId);
    const rasterLayerId = getLayerId('raster' + vizItemId);
    const polygonSourceId = getSourceId('polygon' + vizItemId);
    const polygonLayerId = getLayerId('polygon' + vizItemId);

    addSourceLayerToMap(map, feature, rasterSourceId, rasterLayerId);
    addSourcePolygonToMap(map, feature, polygonSourceId, polygonLayerId);

    const onClickHandler = (e) => {
      onClickOnLayer && onClickOnLayer(vizItemId);
    };

    const onHoverHandler = (e) => {
      onHoverOverLayer && onHoverOverLayer(vizItemId);
    };

    map.setLayoutProperty(rasterLayerId, 'visibility', 'visible');
    map.on('click', polygonLayerId, onClickHandler);
    map.on('mousemove', polygonLayerId, onHoverHandler);

    return () => {
      // cleanups
      if (map) {
        if (layerExists(map, rasterLayerId)) map.removeLayer(rasterLayerId);
        if (sourceExists(map, rasterSourceId)) map.removeSource(rasterSourceId);
        if (layerExists(map, polygonLayerId)) map.removeLayer(polygonLayerId);
        if (sourceExists(map, polygonSourceId))
          map.removeSource(polygonSourceId);
        map.off('click', 'clusters', onClickHandler);
      }
    };
  }, [vizItem, map, vizItemId, onClickOnLayer, onHoverOverLayer]);

  return null;
};

export const VisualizationLayers = ({
  vizItems,
  onHoverOverLayer,
  onClickOnLayer,
}) => {
  /*
      Add layers of visualization components on top of map

      @param {STACItem} vizItems   - An array of STACitems which are to be displayed
      @param {function} onHoverOverlayer - function to execute when mouse is hovered on layer. will provide vizItemId as a parameter to the callback
      @param {function} onClickOnlayer - function to execute when layer is clicked. will provide vizItemId as a parameter to the callback
    */
  const { map } = useMapbox();
  if (!map || !vizItems.length) return;
  return (
    <>
      {vizItems.length &&
        vizItems.map((vizItem) => (
          <VisualizationLayer
            key={vizItem.id}
            vizItem={vizItem}
            onClickOnLayer={onClickOnLayer}
            onHoverOverLayer={onHoverOverLayer}
          />
        ))}
    </>
  );
};
