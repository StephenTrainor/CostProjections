import ReactApexChart from 'react-apexcharts';

import useDeviceDimensions from '../hooks/useDeviceDimensions';
import { componentsConstants } from "../AppConstants";

const { colors, chartSizes, chartConfigurations } = componentsConstants;

const GainLossStackedApexChart = (props) => {
    const { height: deviceHeight, width: deviceWidth } = useDeviceDimensions();
    const { symbol, losingPositions, gainingPositions } = props.currentAirtableRecord.fields;

    const { minimumChartWidth, minimumMediumChartHeight } = chartSizes;
    const { defaultLightColor, losingPositionColor, winningPositionsColor } = colors;
    const { tooltipTheme, legendAlign, titleAlign, titleFontSize, fillOpacity } = chartConfigurations;

    const state = {
        series: [{
            name: 'Winning Positions',
            data: [gainingPositions]
        },
        {
            name: 'Losing Positions',
            data: [losingPositions]
        }],
        options: {
            colors: [winningPositionsColor, losingPositionColor],
            chart: {
                height: minimumMediumChartHeight + deviceHeight / 14,
                width: minimumChartWidth + deviceWidth / 3,
                type: 'bar',
                stacked: true,
                stackType: '100%'
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            stroke: {
                width: 0.7,
                color: [defaultLightColor]
            },
            title: {
                text: `${symbol.toUpperCase()} Win-Loss Percentages`,
                align: titleAlign,
                style: {
                    fontSize: titleFontSize,
                    color: defaultLightColor
                }
            },
            xaxis: {
                categories: [symbol.toUpperCase()],
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
            tooltip: {
                theme: tooltipTheme,
                y: {
                    formatter: function (val) {
                        return val + " positions"
                    }
                }
            },
            fill: {
                opacity: fillOpacity
            },
            legend: {
                align: legendAlign,
                labels: {
                    colors: defaultLightColor
                }
            }
        }
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

GainLossStackedApexChart.defaultProps = {
    currentAirtableRecord: {
        "fields": {
            "symbol": '',
            "losingPositions": 0,
            "gainingPositions": 0
        }
    }
};

export default GainLossStackedApexChart;
