import { useEffect } from 'react';
import { useMapbox } from '../../context/mapContext';
import {
  addSourceLayerToMap,
  addSourcePolygonToMap,
  getSourceId,
  getLayerId,
  layerExists,
  sourceExists,
} from '../../utils';

export const VisualizationLayer = ({
  vizLayer,
  onClickOnLayer,
  onHoverOverLayer,
}) => {
  const { map } = useMapbox();
  const vizLayerId = vizLayer.id;

  useEffect(() => {
    if (!map || !vizLayer) return;
    const feature = vizLayer;
    const rasterSourceId = getSourceId('raster' + vizLayerId);
    const rasterLayerId = getLayerId('raster' + vizLayerId);
    const polygonSourceId = getSourceId('polygon' + vizLayerId);
    const polygonLayerId = getLayerId('polygon' + vizLayerId);

    addSourceLayerToMap(map, feature, rasterSourceId, rasterLayerId);
    addSourcePolygonToMap(map, feature, polygonSourceId, polygonLayerId);

    const onClickHandler = (e) => {
      onClickOnLayer && onClickOnLayer(vizLayerId);
    };

    const onHoverHandler = (e) => {
      onHoverOverLayer && onHoverOverLayer(vizLayerId);
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
  }, [vizLayer, map, vizLayerId, onClickOnLayer, onHoverOverLayer]);

  return null;
};

export const VisualizationLayers = ({
  vizLayers,
  onHoverOverLayer,
  onClickOnLayer,
}) => {
  /*
      Add layers of visualization components on top of map

      @param {STACItem} vizLayers   - An array of stac items which are to be displayed
      @param {boolean} showvisualizationlayers - Display or hide the visualization layers
      @param {function} onHoveroverlayer - function to execute when mouse is hovered on layer
      @param {function}b onCLickonlayer - function to execute when layer is clicked
    */
  const { map } = useMapbox();
  if (!map || !vizLayers.length) return;
  return (
    <>
      {vizLayers &&
        vizLayers.map((vizLayer) => (
          <VisualizationLayer
            key={vizLayer.id}
            vizLayer={vizLayer}
            onClickOnLayer={onClickOnLayer}
            onHoverOverLayer={onHoverOverLayer}
          />
        ))}
    </>
  );
};
