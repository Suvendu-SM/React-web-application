import { React, useEffect, memo, useState } from "react";
import "../styles/GraphVisual.css";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);




const buildChartData = (data, casesType = "cases") => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
};

const buildCountryChartData = (data, casesType, subData) => {
    let chartData = [];
    let lastDataPoint;
    for (let val of data) {
        try {
            if (lastDataPoint && val[0] !== undefined) {
                let newDataPoint = {
                    x: val[0].day,
                    y: val[0][casesType][subData] - lastDataPoint,
                };
                chartData.push(newDataPoint);
            }
            if (val[0] !== undefined)
                lastDataPoint = val[0][casesType][subData];
        } catch (error) {
            console.log(error, casesType);
        }

    }
    return chartData;
}


const GraphVisual = memo(props => {
    const [data, setData] = useState({});
    const { CountrySelect, countryInfo, caseType, subData, label } = props

    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=10")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    let chartData = buildChartData(data);
                    setData(chartData);
                });
        };
        if (CountrySelect === 'Worldwide')
            fetchData();
    }, [CountrySelect])

    useEffect(() => {
        setData((buildCountryChartData(countryInfo, caseType, subData)))
    }, [countryInfo]);

    return (
        <div className="Graph">
            <Line
                data={{
                    datasets: [
                        {
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],

                            data: data,
                            label: label
                        },
                    ],
                }}
            />
        </div>
    );
});

export default (GraphVisual);
