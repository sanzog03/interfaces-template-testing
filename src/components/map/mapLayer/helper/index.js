import { sourceExists, layerExists } from '../../utils/index';

export const addSourcePolygonToMap = (
  map,
  feature,
  polygonSourceId,
  polygonLayerId
) => {
  if (
    !map ||
    (sourceExists(map, polygonSourceId) && layerExists(map, polygonLayerId))
  )
    return;

  map.addSource(polygonSourceId, {
    type: 'geojson',
    data: feature,
  });

  map.addLayer({
    id: polygonLayerId,
    type: 'fill',
    source: polygonSourceId,
    layout: {},
    paint: {
      'fill-outline-color': '#20B2AA',
      'fill-color': 'transparent',
    },
  });
};
