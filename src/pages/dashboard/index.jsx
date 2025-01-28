import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';


import MainMap from '../../components/mainMap';
import { MarkerFeature } from '../../components/mapMarker';
import {VisualizationLayers  } from '../../components/mapLayer';


import { ColorBar } from '../../components/colorBar';
import { LoadingSpinner } from '../../components/loading';
import { PersistentDrawerRight } from "../../components/drawer";
import InfoCardWithFilters from "../../components/title";
import { MapControls } from '../../components/mapControls';
import { MapZoom } from '../../components/mapZoom';

import "./index.css";

const TITLE = 'GOES Methane Plume Viewer';
const DESCRIPTION = 'The Geostationary Operational Environmental Satellites collect \
images of the surface every 5 minutes. Only very large emission events can be detected, \
but plume expansion is easy to see over time. More plumes will be added soon.';

export function Dashboard({ dataTree, collectionId, metaDataTree, vizItemMetaData, zoomLocation, setZoomLocation, zoomLevel, setZoomLevel, loadingData }) {
  // states for data
  const [ regions, setRegions ] = useState([]); // store all available regions
  const [ vizItems, setVizItems ] = useState([]); // store all available visualization items
  const [ selectedRegionId, setSelectedRegionId ] = useState(""); // region_id of the selected region (marker)
  const prevSelectedRegionId = useRef(""); // to be able to restore to previously selected region.
  const [ selectedVizItems, setSelectedVizItems ] = useState([]); // all visualization items for the selected region (marker)
  const [ hoveredVizItemId, setHoveredVizItemId ] = useState(""); // vizItem_id of the visualization item which was hovered over

  const [ filteredRegions, setFilteredRegions ] = useState([]); // all regions with the filter applied
  const [ filteredSelectedVizItems, setFilteredSelectedVizItems ] = useState([]); // visualization items for the selected region with the filter applied

  const [ vizItemIds, setVizItemIds ] = useState([]); // list of vizItem_ids for the search feature.
  const [ vizItemsForAnimation, setVizItemsForAnimation ] = useState([]); // list of subdaily_visualization_item used for animation

  const [ showVisualizationLayers, setShowVisualizationLayers ] = useState(true);

  // states for components/controls
  const [ openDrawer, setOpenDrawer ] = useState(false);

  // handler functions
  const handleSelectedRegion = (regionId) => {
    if (!dataTree.current || !Object.keys(dataTree.current).length || !regionId) return;
    setSelectedRegionId(regionId); // an useEffect handles it further
    setShowVisualizationLayers(true); // all the available visualization items  layers should be visible when region is selected
    prevSelectedRegionId.current = regionId;
    const region = dataTree.current[regionId];
    setZoomLocation(region.location);
    setZoomLevel(null); // take the default zoom level
    setOpenDrawer(true);
    setSelectedVizItems([]); // reset the visualization items shown, to trigger re-evaluation of selected visualization item
  }

  const handleSelectedVizItems = (vizItemId) => {
    if (!vizItems || !vizItemId) return;

    const vizItem = vizItems[vizItemId];
    const { location } = vizItem;
    handleSelectedVizItemSearch(vizItemId);
    handleAnimationReady(vizItemId);
    setZoomLocation(location);
    setZoomLevel(null); // take the default zoom level
    setSelectedRegionId(""); //to reset the visualization item that was shown
  }

  const handleAnimationReady = (vizItemId) => {
    // will make the visualization item ready for animation.
    if (!vizItems || !vizItemId) return;

    const vizItem = vizItems[vizItemId];
    setVizItemsForAnimation(vizItem.subDailyPlumes);
    // just clear the previous visualization item layers and not the cards
    setShowVisualizationLayers(false);
  }

  const handleSelectedVizItemSearch = (vizItemId) => {
    // will focus on the visualization item along with its visualization item metadata card
    // will react to update the metadata on the sidedrawer
    if (!vizItems || !vizItemId) return;
    const vizItem = vizItems[vizItemId];
    const { location } = vizItem;

    setSelectedVizItems([vizItem]);
    setOpenDrawer(true);
    setZoomLocation(location);
    setZoomLevel(null); // take the default zoom level
    setSelectedRegionId(""); //to reset the visualization item that was shown
    setVizItemsForAnimation([]); // to reset the previous animation
  }

  const handleResetHome = () => {
    setSelectedRegionId("");
    setHoveredVizItemId("");
    setFilteredSelectedVizItems([]);
    setVizItemsForAnimation([]);
    setOpenDrawer(false);
    setZoomLevel(4);
    setZoomLocation([-98.771556, 32.967243]);
  }

  const handleResetToSelectedRegion = () => {
    setHoveredVizItemId("");
    setVizItemsForAnimation([]);
    if (!prevSelectedRegionId.current) {
      return handleResetHome();
    }
    handleSelectedRegion(prevSelectedRegionId.current);
  }

  // Component Effects
  useEffect(() => {
    if (!dataTree.current) return;

    const vizItems = {}; // visualization_items[string] = visualization_item
    const regions = []; // string[]
    const vizItemIds = []; // string[] // for search
    Object.keys(dataTree.current).forEach(region => {
      regions.push(dataTree.current[region]);
      dataTree.current[region].plumes.forEach(vizItem => {
        // check what visualization_item is in dataModels.ts
        vizItems[vizItem.id] = vizItem;
        vizItemIds.push(vizItem.id);
      });
    });
    setVizItems(vizItems);
    setRegions(regions);
    setVizItemIds(vizItemIds); // for search
  // the reference to datatree is in current, so see changes with respect to that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTree.current]);

  useEffect(() => {
    if (!dataTree.current || !selectedRegionId) return;
    const vizItems = dataTree.current[selectedRegionId].plumes;
    setSelectedVizItems(vizItems);
    setVizItemsForAnimation([]); // reset the animation
    setShowVisualizationLayers(true); // all the available visualization items layers should be visible when region is selected
  // the reference to datatree is in current, so see changes with respect to that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTree.current, selectedRegionId]);

  // JSX
  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <MainMap>
          <InfoCardWithFilters
            title={TITLE}
            description={DESCRIPTION}
            vizItemIds={vizItemIds}
            handleSelectedVizItemSearch={handleSelectedVizItemSearch}
            regions={regions}
            selectedVizItems={selectedVizItems}
            setFilteredRegions={setFilteredRegions}
            setFilteredSelectedVizItems={setFilteredSelectedVizItems}
            vizItemsForAnimation={vizItemsForAnimation} />
            <MapZoom zoomLocation={zoomLocation} zoomLevel={zoomLevel} /> 
           < MapControls
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            handleResetHome={handleResetHome}
            handleResetToSelectedRegion={handleResetToSelectedRegion}
           />
          <MarkerFeature
            regions={filteredRegions}
            setSelectedRegionId={handleSelectedRegion}
          ></MarkerFeature>
          <VisualizationLayers
            showVisualizationLayers={showVisualizationLayers}
            vizItems={filteredSelectedVizItems}
            handleLayerClick={handleSelectedVizItems}
            hoveredVizItemId={hoveredVizItemId}
            setHoveredVizItemId={setHoveredVizItemId}
          />  
        </MainMap>
        <PersistentDrawerRight
          open={openDrawer}
          setOpen={setOpenDrawer}
          selectedVizItems={filteredSelectedVizItems}
          vizItemMetaData={vizItemMetaData}
          metaDataTree={metaDataTree}
          collectionId={collectionId}
          vizItemsMap={vizItems}
          handleSelectedVizItems={handleSelectedVizItems}
          hoveredVizItemId={hoveredVizItemId}
          setHoveredVizItemId={setHoveredVizItemId}
        />
      </div>
      <ColorBar/>
      {loadingData && <LoadingSpinner/>}
    </Box>
  );
}
