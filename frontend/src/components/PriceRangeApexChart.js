import ReactApexChart from 'react-apexcharts';

import getDeviceDimensions from '../hooks/getDeviceDimensions';
import { componentsConstants } from "../AppConstants";

const { colors, chartSizes, chartConfigurations } = componentsConstants;

const PriceRangeApexChart = (props) => {
    const { height: deviceHeight, width: deviceWidth } = getDeviceDimensions();
    const { calculation, latestPrice } = props;
    const { option, symbol } = props.state;
    const avgCost = parseInt(props.state.avgCost, 10);
    const targetAvgCost = parseInt(props.state.targetAvgCost, 10);

    const { tooltipTheme, legendAlign } = chartConfigurations;
    const { minimumChartWidth, minimumSmallChartHeight } = chartSizes;
    const { defaultLightColor, latestPriceColor, previousAvgColor, newAvgColor, rangeColor} = colors;

    const state = {
        series: [{
            name: 'Price Range',
            data: [
                {
                x: symbol.toUpperCase(),
                y: (avgCost < latestPrice) ? [avgCost, latestPrice] : [latestPrice, avgCost],
                goals: [
                    {
                        name: 'Previous Average Cost',
                        value: parseInt(avgCost, 10),
                        strokeWidth: 5,
                        strokeColor: previousAvgColor,
                    },
                    {
                        name: 'New Average Cost',
                        value: (option === "CNP") ? targetAvgCost : calculation,
                        strokeWidth: 4,
                        strokeColor: newAvgColor,
                    },
                    {
                        name: 'Latest Price',
                        value: latestPrice,
                        strokeWidth: 5,
                        strokeColor: latestPriceColor,
                    }
                ]
            }]
        }],
        
        options: {
            xaxis: {
                min: ((avgCost <= latestPrice) ? avgCost : latestPrice) - (Math.abs(latestPrice - avgCost) * 0.1),
                max: ((avgCost >= latestPrice) ? avgCost : latestPrice) + (Math.abs(latestPrice - avgCost) * 0.1),
                labels: {
                    style: {
                        colors: defaultLightColor
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: defaultLightColor
                    }
                }
            },
            chart: {
                height: minimumSmallChartHeight + deviceHeight / 13.34,
                width: minimumChartWidth + deviceWidth / 3,
                type: 'rangeBar',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            colors: [rangeColor],
            legend: {
                align: legendAlign,
                show: true,
                showForSingleSeries: true,
                customLegendItems: ['Price Range', 'Previous Average Cost', 'Latest Price', 'New Average Cost'],
                markers: {
                        fillColors: [rangeColor, previousAvgColor, latestPriceColor, newAvgColor]
                },
                labels: {
                    colors: defaultLightColor
                }
            },
            tooltip: {
                theme: tooltipTheme
            }
        },
    };

    return (
        <ReactApexChart 
            series={state.series} 
            options={state.options} 
            type={state.options.chart.type} 
            width={state.options.chart.width} 
            height={state.options.chart.height} 
            tooltip={state.options.tooltip}
        />
    );
};

export default PriceRangeApexChart;
