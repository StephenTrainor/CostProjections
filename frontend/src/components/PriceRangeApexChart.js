import ReactApexChart from 'react-apexcharts';
import useWindowDimensions from '../hooks/useWindowDimensions';

const PriceRangeApexChart = (props) => {
    const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();
    const { calculation, latestPrice } = props;
    const { option, symbol } = props.state;
    const avgCost = parseInt(props.state.avgCost, 10);
    const targetAvgCost = parseInt(props.state.targetAvgCost, 10);

    const minChartWidth = 180;
    const minChartHeight = 100;

    const previousAvgColor = '#808080';
    const newAvgColor = '#58bc08';
    const latestPriceColor = '#a0a0a0';
    const rangeColor = '#f0ffff';

    const lightColor = "#ffffff";

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
                        colors: lightColor
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: lightColor
                    }
                }
            },
            chart: {
                height: minChartHeight + deviceHeight / 13.34,
                width: minChartWidth + deviceWidth / 3,
                type: 'rangeBar',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            colors: [rangeColor],
            legend: {
                show: true,
                showForSingleSeries: true,
                customLegendItems: ['Price Range', 'Previous Average Cost', 'Latest Price', 'New Average Cost'],
                markers: {
                        fillColors: [rangeColor, previousAvgColor, latestPriceColor, newAvgColor]
                },
                labels: {
                    colors: lightColor
                }
            },
            tooltip: {
                theme: 'dark'
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
