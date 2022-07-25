import {
  Autocomplete,
  TextField
} from '@mui/material';
import { useState, useEffect } from 'react';
import { fetchTickerSymbols } from '../api/polygonTickerSymbols';

const AutoCompleteField = (props) => {
    const [tickerSymbols, setTickerSymbols] = useState();
    const [fullCompanyNames, setFullCompanyNames] = useState([]);
    const [selectedCompanyName, setSelectedCompanyName] = useState(null);
    const [previousTickerSymbol, setPreviousTickerSymbol] = useState('');
    const [enteredSymbol, setEnteredSymbol] = useState('');

    const fetchAutoCompleteSuggestions = async (enteredSymbol) => {
        const getTickerSymbolsResponse = await fetchTickerSymbols(enteredSymbol);

        if (getTickerSymbolsResponse) {
            setTickerSymbols({
                ...getTickerSymbolsResponse
            });
        }
    }

    useEffect(() => {
        if (enteredSymbol) {
            if (!tickerSymbols || enteredSymbol !== previousTickerSymbol) {
                fetchAutoCompleteSuggestions(enteredSymbol);
                setPreviousTickerSymbol(enteredSymbol);
            }
        }
    }, [setPreviousTickerSymbol, tickerSymbols, previousTickerSymbol, enteredSymbol]);

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
                    setEnteredSymbol(selectedTickerSymbol);
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
                        setEnteredSymbol(event.target.value);
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
