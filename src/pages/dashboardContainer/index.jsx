import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dashboard } from '../dashboard';


export function DashboardContainer() {
    const [ selectedStationId, setSelectedStationId ] = useState("");
    const [ stations, setStations ] = useState([]);
    const [ stationMetadata, setStationMetadata ] = useState({});

    // get the query params
    const [ searchParams ] = useSearchParams();
    const [ agency ] = useState(searchParams.get('agency') || "nist"); // nist, noaa, or nasa
    const [ dataCategory ] = useState(searchParams.get('data-category') || ""); // testbed
    const [ region ] = useState(searchParams.get('region') || ""); // lam or nec
    const [ ghg, setSelectedGHG ] = useState(searchParams.get('ghg') || "co2"); // co2 or ch4
    const [ stationCode ] = useState(searchParams.get('station-code') || ""); // buc, smt, etc
    const [ zoomLevel ] = useState (searchParams.get('zoom-level')); // let default zoom level controlled by map component


    return (
        <Dashboard
            stations={stations}
            selectedStationId={selectedStationId}
            stationMetadata={stationMetadata}
            ghg={ghg}
            agency={agency}
            region={region}
            stationCode={stationCode}
            zoomLevel={zoomLevel}
            setSelectedStationId={setSelectedStationId}
            setSelectedGHG={setSelectedGHG}
        />
    );
}