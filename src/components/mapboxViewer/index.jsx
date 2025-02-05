import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { MapRegionLegend } from '../legend';
import { LoadingSpinner } from '../loading';

import './index.css';

import { BASEMAP_STYLES, BASEMAP_ID_DEFAULT } from './config';
import { getLocationToZoom, getZoomLevel, getMeanCenterOfLocation, getToolTipContent, getUniqueRegions, getStationRegion } from "./helper";
import {  getMarkerColor, getMarkerSVG } from "../../utils";

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const mapboxStyleBaseUrl = process.env.REACT_APP_MAPBOX_STYLE_URL;

const mapLegendHeading = "Urban Test Bed Sites";

export const MapBoxViewer = ({ stations, region, agency, stationCode, zoomLevel = 2, style, setDisplayChart, setSelection, displayChart }) => {
    const [currentViewer, setCurrentViewer] = useState(null);
    const [regions, setRegions] = useState({});
    const stationMarkersRef = useRef([]);
    const mapContainerRef = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = accessToken;
        let mapboxStyleUrl = 'mapbox://styles/mapbox/streets-v12';
        if (mapboxStyleBaseUrl) {
            let styleId = BASEMAP_STYLES.findIndex(style => style.id === BASEMAP_ID_DEFAULT);
            mapboxStyleUrl = `${mapboxStyleBaseUrl}/${BASEMAP_STYLES[styleId].mapboxId}`;
        }

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: mapboxStyleUrl,
            center: [-98.585522, 1.8333333],
            zoom: zoomLevel,
            projection: 'equirectangular',
            options: { trackResize: true }
        });
        setCurrentViewer(map);
        plotStations(map, stations, region, agency, stationCode);

        return () => {
            stationMarkersRef.current.forEach(marker => {
                let elem = marker.getElement();
                elem.replaceWith(elem.cloneNode(true));
            });
        };
    }, []);

    useEffect(() => {
        if (currentViewer) {
            plotStations(currentViewer, stations, region, agency, stationCode);
            if (!displayChart) {
                currentViewer.resize();
            }
        }
    }, [stations, region, agency, stationCode, displayChart]);

    const plotStations = (map, stations, region, agency, stationCode) => {
        let uniqueRegions = getUniqueRegions(stations);
        setRegions(uniqueRegions);

        let stationMarkers = stations.map(station => {
            const { id: stationId, properties } = station;
            const el = document.createElement('div');
            let stationRegion = getStationRegion(stationId);
            const markerStyleIndex = uniqueRegions[stationRegion].index;
            let markerColor = getMarkerColor(markerStyleIndex);
            el.className = 'marker';
            el.innerHTML = getMarkerSVG(markerColor);
            let marker = addMarker(map, el, properties);

            marker.getElement().addEventListener('click', () => {
                setDisplayChart(true);
                setSelection(stationId);
            });

            return marker;
        });
        stationMarkersRef.current = stationMarkersRef.current.concat(stationMarkers);

        let zoomLocation = getLocationToZoom(stations, stationCode);
        let newZoomLevel = getZoomLevel(region, agency, stationCode, zoomLevel);
        if (zoomLocation) {
            map.flyTo({ center: zoomLocation, zoom: newZoomLevel });
        }
    };

    const addMarker = (map, element, properties) => {
        const { longitude, latitude } = properties;
        let marker = new mapboxgl.Marker(element).setLngLat([longitude, latitude]).addTo(map);
        const tooltipContent = getToolTipContent(properties);
        const popup = new mapboxgl.Popup({ closeButton: false, offset: [-3, -15], anchor: 'bottom' }).setHTML(tooltipContent);

        marker.setPopup(popup);
        marker.getElement().addEventListener("mouseenter", () => popup.addTo(map));
        marker.getElement().addEventListener("mouseleave", () => popup.remove());

        return marker;
    };

    return (
        <Box component="main" className="map-section fullSize" sx={{ flexGrow: 1 }} style={style}>
            <Grid container className="fullSize">
                <Grid item xs={12} sx={{ position: "relative" }} style={{ height: "100%" }}>
                    {stations.length < 1 && currentViewer && <LoadingSpinner />}
                    <div ref={mapContainerRef} className='fullSize' style={{ position: "absolute" }}></div>
                </Grid>
            </Grid>
            <MapRegionLegend heading={mapLegendHeading} regions={regions} />
        </Box>
    );
};