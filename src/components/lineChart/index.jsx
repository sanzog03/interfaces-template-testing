import { useEffect } from "react";

import { useChart } from "../../context/chartContext";

export const LineChart = ({ data, labels }) => {
    // data should be an array of vector points
    // labels should be an array of the vector labels

    const { chart } = useChart();

    console.log(">>>>", chart);

    useEffect(() => {
        if (!chart || !data.length || !labels.length) return;

        chart.data.labels = labels;
        chart.data.datasets = data;
        // chart.update()
    }, [data, labels]);


    return null;
}
