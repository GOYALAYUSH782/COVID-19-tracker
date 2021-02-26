import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
    },
    recovered: {
        hex: "#7dd71d",
    },
    deaths: {
        hex: "#fb4443",
    },
};

const buildChartData = (data, casesType = 'cases') => {
    let chartData = [];
    let lastDataPoint;
    if (!data) {
        return [];
    }
    Object.entries(data[casesType]).forEach(([date, value]) => {
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: value - lastDataPoint
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint = value;
    })
    return chartData;
}

function LineGraph({ country, casesType = 'cases', ...props }) {
    const [data, setData] = useState({});

    useEffect(() => {
        const url = country === 'worldwide' ? 'https://disease.sh/v3/covid-19/historical/all?lastdays=120' : `https://disease.sh/v3/covid-19/historical/${country}?lastdays=120`;

        const fetchData = async () => {
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    const d = country === 'worldwide' ? data : data?.timeline;
                    const chartData = buildChartData(d, casesType);
                    setData(chartData);
                });
        };
        fetchData();
    }, [casesType, country]);

    return (
        <div className={props.className}>
            {(data?.length > 0) && (
                <Line
                    options={options}
                    data={{
                        datasets: [
                            {
                                backgrounColor: 'rgba(204,16,52,0.5)',
                                borderColor: casesTypeColors[casesType].hex,
                                data: data
                            }
                        ]
                    }}
                />
            )}

        </div>
    )
}

export default LineGraph
