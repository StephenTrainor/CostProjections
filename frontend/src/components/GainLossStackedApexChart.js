import ReactApexChart from 'react-apexcharts';
import useWindowDimensions from '../hooks/useWindowDimensions';

const GainLossStackedApexChart = (props) => {
    const { height: deviceHeight, width: deviceWidth } = useWindowDimensions();
    const { symbol, losingPositions, gainingPositions } = props.currentAirtableRecord.fields;
    
    const minDeviceWidth = 180;
    const minDeviceHeight = 120;

    const lightColor = '#ffffff'

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
            colors: ['#16c25d', '#e12f2f'],
            chart: {
                height: minDeviceHeight + deviceHeight / 14,
                width: minDeviceWidth + deviceWidth / 3,
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
                color: ['#fff']
            },
            title: {
                text: `${symbol.toUpperCase()} Win-Loss Percentages`,
                align: 'center',
                style: {
                    fontSize: '18px',
                    color: lightColor
                }
            },
            xaxis: {
                categories: [symbol.toUpperCase()],
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
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function (val) {
                        return val + " positions"
                    }
                }
            },
            fill: {
                opacity: 0.9
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                labels: {
                    colors: lightColor
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
