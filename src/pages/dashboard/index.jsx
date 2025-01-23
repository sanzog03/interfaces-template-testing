import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import styled from "styled-components";

import MainMap from '../../components/mainMap';
import { MarkerFeature } from '../../components/mapMarker';
import {VisualizationLayers  } from '../../components/mapLayer';
import { PlumeAnimation } from '../../components/plumeAnimation';
import { MapControls } from "../../components/mapControls";
import { MapZoom } from '../../components/mapZoom';
import { ColorBar } from '../../components/colorBar';
import { LoadingSpinner } from '../../components/loading';
import { PersistentDrawerRight } from "../../components/drawer";
import { Title } from "../../components/title";
import { Search } from "../../components/search";
import { FilterByDate } from '../../components/filter';

import "./index.css";
import { MeasurementLayer } from '../../components/measurementLayer';


const HorizontalLayout = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 12px;
`;

const scaleUnits = {
  KM: "km",
  MILES: "mi",
};

export function Dashboard({ dataTree, collectionId, metaDataTree, plumeMetaData, zoomLocation, setZoomLocation, zoomLevel, setZoomLevel, loadingData }) {
  // states for data
  const [ regions, setRegions ] = useState([]); // store all available regions
  const [ vizItems, setVizItems ] = useState([]); // store all available plumes
  const [ selectedRegionId, setSelectedRegionId ] = useState(""); // region_id of the selected region (marker)
  const prevSelectedRegionId = useRef(""); // to be able to restore to previously selected region.
  const [ selectedVizItems, setSelectedVizItems ] = useState([]); // all plumes for the selected region (marker)
  const [ hoveredVizItemId, setHoveredVizItemId ] = useState(""); // plume_id of the plume which was hovered over

  const [ filteredRegions, setFilteredRegions ] = useState([]); // all regions with the filter applied
  const [ filteredSelectedVizItems, setFilteredSelectedVizItems ] = useState([]); // plumes for the selected region with the filter applied

  const [ vizItemIds, setVizItemIds ] = useState([]); // list of plume_ids for the search feature.
  const [ vizItemsForAnimation, setVizItemsForAnimation ] = useState([]); // list of subdaily_plumes used for animation

  const [ showVisualizationLayers, setShowVisualizationLayers ] = useState(true);

  // states for components/controls
  const [ openDrawer, setOpenDrawer ] = useState(false);
  const [ measureMode, setMeasureMode ] = useState(false);
  const [ clearMeasurementIcon, setClearMeasurementIcon ] = useState(false)
  const [ clearMeasurementLayer, setClearMeasurementLayer ] = useState(false)
  const [ mapScaleUnit, setMapScaleUnit ] = useState(scaleUnits.MILES);

  // handler functions
  const handleSelectedRegion = (regionId) => {
    if (!dataTree.current || !Object.keys(dataTree.current).length || !regionId) return;
    setSelectedRegionId(regionId); // an useEffect handles it further
    setShowVisualizationLayers(true); // all the available plumes layers should be visible when region is selected
    prevSelectedRegionId.current = regionId;
    const region = dataTree.current[regionId];
    setZoomLocation(region.location);
    setZoomLevel(null); // take the default zoom level
    setOpenDrawer(true);
    setSelectedVizItems([]); // reset the plumes shown, to trigger re-evaluation of selected plume
  }

  const handleSelectedPlume = (vizItemId) => {
    if (!vizItems || !vizItemId) return;

    const vizItem = vizItems[vizItemId];
    const { location } = vizItem;
    handleSelectedPlumeSearch(vizItemId);
    handleAnimationReady(vizItemId);
    setZoomLocation(location);
    setZoomLevel(null); // take the default zoom level
    setSelectedRegionId(""); //to reset the plume that was shown
  }

  const handleAnimationReady = (vizItemId) => {
    // will make the plume ready for animation.
    if (!vizItems || !vizItemId) return;

    const vizItem = vizItems[vizItemId];
    setVizItemsForAnimation(vizItem.subDailyPlumes);
    // just clear the previous plume layers and not the cards
    setShowVisualizationLayers(false);
  }

  const handleSelectedPlumeSearch = (vizItemId) => {
    // will focus on the plume along with its plume metadata card
    // will react to update the metadata on the sidedrawer
    if (!vizItems || !vizItemId) return;
    const vizItem = vizItems[vizItemId];
    const { location } = vizItem;

    setSelectedVizItems([vizItem]);
    setOpenDrawer(true);
    setZoomLocation(location);
    setZoomLevel(null); // take the default zoom level
    setSelectedRegionId(""); //to reset the plume that was shown
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

    const plumes = {}; // plumes[string] = Plume
    const regions = []; // string[]
    const plumeIds = []; // string[] // for search
    Object.keys(dataTree.current).forEach(region => {
      regions.push(dataTree.current[region]);
      dataTree.current[region].plumes.forEach(plume => {
        // check what plume is in dataModels.ts
        plumes[plume.id] = plume;
        plumeIds.push(plume.id);
      });
    });
    setVizItems(plumes);
    setRegions(regions);
    setVizItemIds(plumeIds); // for search
  // the reference to datatree is in current, so see changes with respect to that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTree.current]);

  useEffect(() => {
    if (!dataTree.current || !selectedRegionId) return;
    const plumes = dataTree.current[selectedRegionId].plumes;
    setSelectedVizItems(plumes);
    setVizItemsForAnimation([]); // reset the animation
    setShowVisualizationLayers(true); // all the available plumes layers should be visible when region is selected
  // the reference to datatree is in current, so see changes with respect to that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTree.current, selectedRegionId]);

  // JSX
  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <MainMap>
          <Title>
            <HorizontalLayout>
              <Search
                ids={vizItemIds}
                handleSelectedPlumeSearch={handleSelectedPlumeSearch}
              ></Search>
            </HorizontalLayout>
            <HorizontalLayout>
              <FilterByDate
                regions={regions}
                plumes={selectedVizItems}
                setFilteredRegions={setFilteredRegions}
                setFilteredSelectedPlumes={setFilteredSelectedVizItems}
              />
            </HorizontalLayout>
            <HorizontalLayout>
              <PlumeAnimation plumes={vizItemsForAnimation} />
            </HorizontalLayout>
          </Title>
          <MarkerFeature
            regions={filteredRegions}
            setSelectedRegionId={handleSelectedRegion}
          ></MarkerFeature>
          <VisualizationLayers
            showVisualizationLayers={showVisualizationLayers}
            vizItems={filteredSelectedVizItems}
            handleLayerClick={handleSelectedPlume}
            hoveredVizItemId={hoveredVizItemId}
            setHoveredVizItemId={setHoveredVizItemId}
          />
          <MapControls
            openDrawer={openDrawer}
            measureMode={measureMode}
            onClickHamburger={() => {
              setOpenDrawer((openDrawer) => !openDrawer);
            }}
            onClickMeasureMode={() => {
              setMeasureMode((measureMode) => !measureMode);
            }}
            onClickClearIcon={() => {
              setClearMeasurementLayer(true);
            }}
            clearMeasurementIcon={clearMeasurementIcon}
            mapScaleUnit={mapScaleUnit}
            setMapScaleUnit={setMapScaleUnit}
            handleResetHome={handleResetHome}
            handleResetToSelectedRegion={handleResetToSelectedRegion}
          />
          <MapZoom zoomLocation={zoomLocation} zoomLevel={zoomLevel} />
          <MeasurementLayer
            measureMode={measureMode}
            setMeasureMode={setMeasureMode}
            setClearMeasurementIcon={setClearMeasurementIcon}
            clearMeasurementLayer={clearMeasurementLayer}
            setClearMeasurementLayer={setClearMeasurementLayer}
            mapScaleUnit={mapScaleUnit}
          />
        </MainMap>
        <PersistentDrawerRight
          open={openDrawer}
          setOpen={setOpenDrawer}
          selectedPlumes={filteredSelectedVizItems}
          plumeMetaData={plumeMetaData}
          metaDataTree={metaDataTree}
          collectionId={collectionId}
          plumesMap={vizItems}
          handleSelectedPlumeCard={handleSelectedPlume}
          hoveredPlumeId={hoveredVizItemId}
          setHoveredPlumeId={setHoveredVizItemId}
        />
      </div>
      <ColorBar/>
      {loadingData && <LoadingSpinner/>}
    </Box>
  );
}
