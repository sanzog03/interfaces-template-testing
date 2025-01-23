import { useState, useEffect } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";

export function FilterByDate({regions, vizItems, setFilteredRegions,setFilteredSelectedVizItems }) {
    const [startDate, setStartDate] = useState(moment("2018-01-01"));
    const [endDate, setEndDate] = useState(() => moment());

    useEffect(() => {
        if (!regions.length) return;

        const filteredRegions = []
        // only filter ones where: startDate <= vizItem.date <= endDate
        for (let i=0; i < regions.length; i++) {
            const region = regions[i];
            const regionStartDatetime = moment(region.startDate);
            const regionEndDatetime = moment(region.endDate);
            if (regionStartDatetime.isSameOrAfter(startDate) && regionEndDatetime.isSameOrBefore(endDate)) {
                filteredRegions.push(region);
            }
        }
        setFilteredRegions(filteredRegions);

        if (!vizItems || !vizItems.length) return;

        const filteredVizItems = []
        // only filter ones where: startDate <= vizItem.date <= endDate
        for (let i=0; i < vizItems.length; i++) {
            const vizItem = vizItems[i];
            const vizItemStartDatetime = moment(vizItem.startDate);
            const vizItemEndDatetime = moment(vizItem.endDate);
            if (vizItemStartDatetime.isSameOrAfter(startDate) && vizItemEndDatetime.isSameOrBefore(endDate)) {
                filteredVizItems.push(vizItem);
            }
        }
        setFilteredSelectedVizItems(filteredVizItems);

    }, [regions, startDate, endDate, setFilteredRegions, vizItems, setFilteredSelectedVizItems]);

    return (
        <>
            <div style={{ width: "45%", height: "90%" }}>
                <DatePicker 
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                />
            </div>
            <div style={{ width: "45%", height: "90%" }}>
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                />
            </div>
        </>
    );
}
