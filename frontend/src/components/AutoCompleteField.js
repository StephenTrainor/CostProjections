import {
  Autocomplete,
  TextField
} from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AutoCompleteField = (props) => {
    const [tickerSymbols, setTickerSymbols] = useState();
    const [fullCompanyNames, setFullCompanyNames] = useState([]);
    const [selectedCompanyName, setSelectedCompanyName] = useState(null);
    const [previousTickerSymbol, setPreviousTickerSymbol] = useState('');
    const [selectedTickerSymbol, setSelectedTickerSymbol] = useState('');

    const fetchTickerSymbols = async (symbol) => {
        const backendTickerSymbolsApiUrl = `http://127.0.0.1:9000/symbol/${symbol}`;

        try {
            var getTickerSymbolsResponse = await axios.get(backendTickerSymbolsApiUrl);
        } catch (error) {
            if (error.response.status !== 429) {
                getTickerSymbolsResponse = {
                    data: {
                        statusCode: error.response.status,
                        statusMessage: error.response.statusText,
                        results: [],
                    }
                }
            }
        }

        if (getTickerSymbolsResponse) {
            setTickerSymbols({
                ...getTickerSymbolsResponse.data
            });
        }
    }

    useEffect(() => {
        if (selectedTickerSymbol) {
            if (!tickerSymbols || selectedTickerSymbol !== previousTickerSymbol) {
                fetchTickerSymbols(selectedTickerSymbol);
                setPreviousTickerSymbol(selectedTickerSymbol);
            }
        }
    }, [setPreviousTickerSymbol, tickerSymbols, previousTickerSymbol, selectedTickerSymbol]);

    useEffect(() => {
        if (!tickerSymbols || (tickerSymbols && tickerSymbols.status !== "OK")) {return};

        setFullCompanyNames(
            tickerSymbols.results.map((result) => (
                `${result.ticker} (${result.name})`
            ))
        )
    }, [tickerSymbols]);

    return (
        <Autocomplete 
            freeSolo
            disablePortal
            id="symbol"
            value={selectedCompanyName || props.defaultTickerSymbol}
            onChange={(event, newValue) => {
                setSelectedCompanyName(newValue);
                
                if (newValue) {
                    let selectedTickerSymbol = newValue.split(' ')[0]; // split on the space to extract ticker symbol out of full name

                    setPreviousTickerSymbol(selectedTickerSymbol);
                    setSelectedTickerSymbol(selectedTickerSymbol);
                    props.externalSetSymbol(selectedTickerSymbol);
                }
            }}
            error={props.errors.symbol}
            helperText={props.errors.symbolErrorText}
            options={(tickerSymbols && tickerSymbols.status === "OK") ? fullCompanyNames : []}
            className={props.className}
            renderInput={(params) => 
            <TextField 
                {...params} 
                onChange={(event) => {
                        setSelectedTickerSymbol(event.target.value);
                    }
                } 
                variant="outlined" 
                label="Symbol or Company Name" 
                required={props.requiredInputField}
                error={props.errors.symbol}
                helperText={props.errors.symbolErrorText}
            />}
        />
    );
};

AutoCompleteField.defaultProps = {
    defaultTickerSymbol: '',
    className: '',
    requiredInputField: true,
    errors: {
        symbol: false,
        symbolErrorText: '',
    },
    updateErrors: () => {},
    externalSetSymbol: () => {},
}

export default AutoCompleteField;
