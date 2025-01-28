import { useEffect } from "react";
import { useMapbox } from "../../context/mapContext";
import { addSourceLayerToMap, addSourcePolygonToMap, getSourceId, getLayerId, layerExists, sourceExists } from "../../utils";

export const VisualizationLayer = ({ vizLayer, handleLayerClick, hoveredVizLayerId, setHoveredVizLayerId }) => {
    const { map } = useMapbox();
    const vizLayerId = vizLayer.id;
    useEffect(() => {
        if (!map || !vizLayer) return;

        const feature = vizLayer;
        const rasterSourceId = getSourceId("raster"+vizLayerId);
        const rasterLayerId = getLayerId("raster"+vizLayerId);
        const polygonSourceId = getSourceId("polygon"+vizLayerId);
        const polygonLayerId = getLayerId("polygon"+vizLayerId);

        addSourceLayerToMap(map, feature, rasterSourceId, rasterLayerId);
        addSourcePolygonToMap(map, feature, polygonSourceId, polygonLayerId);

        const onClickHandler = (e) => {
            handleLayerClick(vizLayerId);
        }

        const onHoverHandler = (e) => {
            setHoveredVizLayerId(vizLayerId);
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
    }, [vizLayer, map, handleLayerClick, vizLayerId, setHoveredVizLayerId]);

    useEffect(() => {
        if (!map || !hoveredVizLayerId || !vizLayerId ) return;

        const polygonLayerId = getLayerId("polygon"+vizLayerId);
        const rasterLayerId = getLayerId("raster"+vizLayerId);

        if (hoveredVizLayerId !== vizLayerId) {
            // when the plume is not hovered
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#20B2AA');
            }
            if (layerExists(map, rasterLayerId)) {
                map.setLayoutProperty(rasterLayerId, 'visibility', 'none');
            }
        }

        if (hoveredVizLayerId === vizLayerId) {
            // when the plume is hovered
            if (layerExists(map, rasterLayerId)) {
                map.moveLayer(rasterLayerId);
            }
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#0000ff');
            }
        }
    }, [hoveredVizLayerId, map, vizLayerId]);

    // console.log("layers>", map.getStyle().layers)

    return null;
}


export const VisualizationLayers = ({ vizLayers, hoveredVizLayerId, showVisualizationLayers, handleLayerClick, setHoveredVizLayerId }) => {
    const { map } = useMapbox();

    if (!map || !vizLayers.length) return;
    return (<>
        {showVisualizationLayers  && vizLayers && vizLayers.map((vizLayer) => <VisualizationLayer key={vizLayer.id}  vizLayer={vizLayer} handleLayerClick={handleLayerClick} hoveredVizLayerId={hoveredVizLayerId} setHoveredVizLayerId={setHoveredVizLayerId}></VisualizationLayer>)}
        </>
    );
}
