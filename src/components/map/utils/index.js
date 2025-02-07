/*
      Get id for source

      @param {string} idx   - Name/identification of source
*/
export const getSourceId = (idx) => {
  return 'raster-source-' + idx;
};

/*
      Get id for layer

      @param {string} idx    - Name/identification of layer
*/
export const getLayerId = (idx) => {
  return 'raster-layer-' + idx;
};

/*
      Add source and layer on map
      @param {map object} map - instance of map 
      @param {STACItem} feature - collection of features to add on map 
      @param {string} sourceId - id of the source to add
      @param {string} layerId - id of the layer to add source on 
*/
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

/*
      Check if layer exists on map
      @param {map object} map - instance of map 
      @param {string} idx    - Name/identification of layer
     
*/
export function layerExists(map, layerId) {
  return !!map.getLayer(layerId);
}

/*
      Check if source exists on map
      @param {map object} map - instance of map 
      @param {string} idx    - Name/identification of source
     
*/
export function sourceExists(map, sourceId) {
  return !!map.getSource(sourceId);
}
