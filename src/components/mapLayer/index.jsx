import { useEffect } from "react";
import { useMapbox } from "../../context/mapContext";
import { addSourceLayerToMap, addSourcePolygonToMap, getSourceId, getLayerId, layerExists, sourceExists } from "../../utils";

export const VisualizationLayer = ({ vizItem, handleLayerClick, vizItemId, hoveredVizItemId, setHoveredVizItemId }) => {
    const { map } = useMapbox();

    useEffect(() => {
        if (!map || !vizItem) return;

        const feature = vizItem;
        const rasterSourceId = getSourceId("raster"+vizItemId);
        const rasterLayerId = getLayerId("raster"+vizItemId);
        const polygonSourceId = getSourceId("polygon"+vizItemId);
        const polygonLayerId = getLayerId("polygon"+vizItemId);

        addSourceLayerToMap(map, feature, rasterSourceId, rasterLayerId);
        addSourcePolygonToMap(map, feature, polygonSourceId, polygonLayerId);

        const onClickHandler = (e) => {
            handleLayerClick(vizItemId);
        }

        const onHoverHandler = (e) => {
            setHoveredVizItemId(vizItemId);
        }

        map.setLayoutProperty(rasterLayerId, 'visibility', 'visible');
        map.on("click", polygonLayerId, onClickHandler);
        map.on("mousemove", polygonLayerId, onHoverHandler);

        return () => {
            // cleanups
            if (map) {
                if (layerExists(map, rasterLayerId)) map.removeLayer(rasterLayerId);
                if (sourceExists(map, rasterSourceId)) map.removeSource(rasterSourceId);
                if (layerExists(map, polygonLayerId)) map.removeLayer(polygonLayerId);
                if (sourceExists(map, polygonSourceId)) map.removeSource(polygonSourceId);
                map.off("click", "clusters", onClickHandler);
            }
        }
    }, [vizItem, map, handleLayerClick, vizItemId, setHoveredVizItemId]);

    useEffect(() => {
        if (!map || !hoveredVizItemId || !vizItemId ) return;

        const polygonLayerId = getLayerId("polygon"+vizItemId);
        const rasterLayerId = getLayerId("raster"+vizItemId);

        if (hoveredVizItemId !== vizItemId) {
            // when the plume is not hovered
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#20B2AA');
            }
            if (layerExists(map, rasterLayerId)) {
                map.setLayoutProperty(rasterLayerId, 'visibility', 'none');
            }
        }

        if (hoveredVizItemId === vizItemId) {
            // when the plume is hovered
            if (layerExists(map, rasterLayerId)) {
                map.moveLayer(rasterLayerId);
            }
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#0000ff');
            }
        }
    }, [hoveredVizItemId, map, vizItemId]);

    // console.log("layers>", map.getStyle().layers)

    return null;
}


export const VisualizationLayers = ({ vizItems, hoveredVizItemId, showVisualizationLayers, handleLayerClick, setHoveredVizItemId }) => {
    const { map } = useMapbox();
    if (!map || !vizItems.length) return;

    return (<>
        {showVisualizationLayers && vizItems && vizItems.length && vizItems.map((vizItem) => <VisualizationLayer key={vizItem.id} vizItemId={vizItem.id} vizItem={vizItem.representationalPlume} handleLayerClick={handleLayerClick} hoveredVizItemId={hoveredVizItemId} setHoveredVizItemId={setHoveredVizItemId}></VisualizationLayer>)}
        </>
    );
}
