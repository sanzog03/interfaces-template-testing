import { useEffect } from "react";

import { useChart } from "../../context/chartContext";

export const LineChart = ({ index, data, labels }) => {
    // data should be an array of vector points
    // labels should be an array of the vector labels

    const { chart } = useChart();
    useEffect(() => {
        if (!chart || !data.length || !labels.length) return;

        if (!chart.data.datasets[index]) {
            chart.data.datasets[index] = {
                label: `Dataset ${index + 1}`,
                data: [],
                borderColor: "red",
                borderWidth: 2,
            };
        }

        chart.data.labels = labels;
        chart.data.datasets[index].data = data;
        chart.update();
    }, [chart, data, labels]);

    return null;
}
