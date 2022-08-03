const apiConstants = Object.freeze({
    BACKEND_BASE_URL: (process.env.REACT_APP_BACKEND_BASE_URL ?? "http://127.0.0.1:9000"), // localhost if REACT_APP_BACKEND_BASE_URL is undefined
});

const componentsConstants = Object.freeze({
    colors: {
        defaultLightColor: '#ffffff', // white
        winningPositionsColor: '#16c25d', // light green
        losingPositionColor: '#e12f2f', // red
        latestPriceColor: '#a0a0a0', // dark green
        previousAvgColor: '#808080', // light grey
        newAvgColor: '#58bc08', // dark grey
        rangeColor: '#f0ffff', // off white
    },
    chartSizes: {
        minimumChartWidth: 180,
        minimumSmallChartHeight: 100,
        minimumMediumChartHeight: 120,
        minimumLargeChartHeight: 200,
    },
    chartConfigurations: {
        tooltipTheme: 'dark',
        legendAlign: 'center',
        titleAlign: 'center',
        titleFontSize: '18px',
        fillOpacity: 0.9,
    }
});

const pagesConstants = Object.freeze({
    INDEX_PAGE_URL: '/',
    primaryMainLightColor: '#ffffff',
    homePage: {
        dropdownOptions: {
            calculationOptions: [
                {
                    value: 'DCAP',
                    label: 'Dollar Cost Average Projection',
                },
                {
                    value: 'CNP',
                    label: 'Cash Needed Projection',
                },
            ],
            newEquityOptions: [
                {
                    value: 'CA',
                    label: 'Cash Available',
                },
                {
                    value: 'NS',
                    label: 'New Shares',
                },
            ]
        },
        defaultProps: {
            userInput: {
                option: 'DCAP',
                newEquityOption: 'CA',
                symbol: '',
                shares: '',
                avgCost: '',
                cash: '',
                targetAvgCost: '',
                newShares: '',
            },
            errors: {
                symbol: false,
                symbolErrorText: '',
                shares: false,
                sharesErrorText: '',
                avgCost: false,
                avgCostErrorText: '',
                cash: false,
                cashErrorText: '',
                targetAvgCost: false,
                targetAvgCostErrorText: '',
                newShares: false,
                newSharesErrorText: '',
            },
        }
    }
});

const errorConstants = Object.freeze({
    errorMessages: {
        requiredFieldErrorText: 'Required Field',
        pageNotFoundErrorText: 'Page not found, redirecting...',
        positiveValueRequiredErrorText: 'Must be a positive value',
        invalidSymbolErrorText: 'Symbol not found. Please select an option from the dropdown as you type.',
        invalidTargetAvgCostErrorText: 'Target Average Cost must be between the latest price and Current Average Cost.',
        invalidAirtablePostRequestErrorText: 'Error when issuing POST request to the Airtable records',
        invalidAirtablePatchRequestErrorText: 'Error when issuing PATCH request to the Airtable records',
    },
    successCodes: {
        OK_CODE: 200, // standard http code
        OK_STRING: 'OK', // specific code used by Polygon.io
    },
    errorCodes: {
        TOO_MANY_REQUESTS_ERROR_CODE: 429, // standard http code
        INVALID_TICKER_SYMBOL_ERROR_CODE: 404, // standard http code
    }
});

export {apiConstants};
export {componentsConstants};
export {pagesConstants};
export {errorConstants};
