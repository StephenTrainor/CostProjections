import ReactApexChart from "react-apexcharts";

import getDeviceDimensions from '../hooks/getDeviceDimensions';
import { componentsConstants } from "../AppConstants";

const { colors, chartSizes, chartConfigurations } = componentsConstants;

const AllTimeVisitsApexChart = (props) => {
    const { airtableRecords }  = props;
    const { height: deviceHeight, width: deviceWidth } = getDeviceDimensions();

    const { minimumChartWidth, minimumLargeChartHeight } = chartSizes;
    const { defaultLightColor, losingPositionColor, winningPositionsColor } = colors;
    const { tooltipTheme, legendAlign, titleAlign, titleFontSize, fillOpacity } = chartConfigurations;

    const state = {
        series: [{
            name: 'Losing Positions',
            data: []
        },
        {
            name: 'Gaining Positions',
            data: []
        }],
        options: {
            colors: [losingPositionColor, winningPositionsColor],
            chart: {
                type: 'bar',
                height: minimumLargeChartHeight + deviceHeight / 8,
                width: minimumChartWidth + deviceWidth / 3,
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                }
            },
            xaxis: {
                categories: [],
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
            title: {
                text: 'Most Visited Stocks',
                align: titleAlign,
                style: {
                    fontSize: titleFontSize,
                    color: defaultLightColor
                }
            },
            legend: {
                align: legendAlign,
                labels: {
                    colors: defaultLightColor
                }
            },
            fill: {
                opacity: fillOpacity
            },
            tooltip: {
                theme: tooltipTheme,
            }
        }
    };

    airtableRecords.sort((a, b) => {
        return b.fields.allTimeVisits - a.fields.allTimeVisits;
    });

    for (let i = 0; i < 6; i++) {
        if (airtableRecords[i] === undefined) {break}

        const { symbol, losingPositions, gainingPositions } = airtableRecords[i].fields;

        state.series[0].data.push(losingPositions);
        state.series[1].data.push(gainingPositions);
        state.options.xaxis.categories.push(symbol);
    }

    return (
        <ReactApexChart 
            series={state.series}
            options={state.options}
            type={state.options.chart.type}
            width={state.options.chart.width}
            height={state.options.chart.height}
            tooltip={state.options.tooltip}
            legend={state.options.legend}
        />
    )
}

AllTimeVisitsApexChart.defaultProps = {
    airtableRecords: []
};

export default AllTimeVisitsApexChart;
