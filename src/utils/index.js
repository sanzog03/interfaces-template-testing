export const addSourceLayerToMap = (map, feature, sourceId, layerId) => {
  if (!map || (sourceExists(map, sourceId) && layerExists(map, layerId)))
    return;

  const collection = feature.collection; // feature.collection
  const assets = 'rad'; // first element in the asset json object. i.e. Object.keys(features.assets)[0]
  let VMIN = 0;
  let VMAX = 0.4;
  let colorMap = 'plasma';
  let itemId = feature.id;

  const TILE_URL =
    `${process.env.REACT_APP_RASTER_API_URL}/collections/${collection}/items/${itemId}/tiles/WebMercatorQuad/{z}/{x}/{y}@1x` +
    '?assets=' +
    assets +
    '&bidx=1' +
    '&colormap_name=' +
    colorMap +
    '&rescale=' +
    VMIN +
    '%2C' +
    VMAX;
  // "&nodata=-9999";

  map.addSource(sourceId, {
    type: 'raster',
    tiles: [TILE_URL],
    tileSize: 256,
    bounds: feature.bbox,
  });

  map.addLayer({
    id: layerId,
    type: 'raster',
    source: sourceId,
    layout: {
      visibility: 'none', // Set the layer to be hidden initially
    },
    paint: {},
  });
};

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

export const getSourceId = (idx) => {
  return 'raster-source-' + idx;
};

export const getLayerId = (idx) => {
  return 'raster-layer-' + idx;
};

export function layerExists(map, layerId) {
  return !!map.getLayer(layerId);
}

export function sourceExists(map, sourceId) {
  return !!map.getSource(sourceId);
}

export const getMarkerColor = (index) => {
  // const markerClasses = ["marker", "marker marker-blue", "marker marker-purple", "marker marker-pink", "marker marker-red"];
  const markerColors = ["#fcbb46", "#6991f3", "#c530ff", "#fe3b84", "#f94e42"];
  // Index is unlimited but markerClasses array has limited items
  let idx = index % markerColors.length;
  return markerColors[idx];
}

export const getMarkerSVG = (color, strokeColor="#000000") => {
  return `
  <svg fill="${color}" width="30px" height="30px" viewBox="-51.2 -51.2 614.40 614.40" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="${strokeColor}"
          stroke-width="10.24">
          <path
              d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
      </g>
      <g id="SVGRepo_iconCarrier">
          <path
              d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
      </g>
  </svg>`;
}

export const getMarkerSVGComponent = (color, strokeColor="#000000") => {
  return (
      <svg fill={color} width="30px" height="30px" viewBox="-51.2 -51.2 614.40 614.40" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke={strokeColor}
              stroke-width="10.24">
              <path
                  d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
          </g>
          <g id="SVGRepo_iconCarrier">
              <path
                  d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
          </g>
      </svg>
  );
}
