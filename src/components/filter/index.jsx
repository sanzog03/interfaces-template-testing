import { useState, useEffect } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from "moment";

export function FilterByDate({ vizItems,setFilteredVizItems }) {
    const [startDate, setStartDate] = useState(moment("2018-01-01"));
    const [endDate, setEndDate] = useState(() => moment());

    useEffect(() => {
        if (!vizItems.length) return;
        const filteredVizItems = vizItems.filter(vizItem => {
            const vizItemStartDatetime = moment(vizItem.startDate);
            const vizItemEndDatetime = moment(vizItem.endDate);
             if (vizItemStartDatetime.isSameOrAfter(startDate) && vizItemEndDatetime.isSameOrBefore(endDate)) {
                return vizItem;
            }else return null
        });
        setFilteredVizItems(filteredVizItems.map(vizItem => vizItem));
    }, [ startDate, endDate,  vizItems, setFilteredVizItems]);

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
