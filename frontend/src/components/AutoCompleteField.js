import {
  Autocomplete,
  TextField
} from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AutoCompleteField = (props) => {
    const [data, setData] = useState();
    const [last, setLast] = useState('');
    const [value, setValue] = useState(null);
    const [symbol, setSymbol] = useState('');
    const [fullNames, setFullNames] = useState([]);

    const getResponse = async (symbol) => {
        const SYMBOL_API_URL = `http://127.0.0.1:9000/symbol/${symbol}`;

        try {
            var response = await axios.get(SYMBOL_API_URL, { params: {} });
        } catch (error) {
            if (error.response.status !== 429) {
                response = {
                    data: {
                        statusCode: error.response.status,
                        statusMessage: error.response.statusText,
                        results: [],
                    }
                }
            }
        }

        if (response) {
            setData({
                ...response.data
            });
        }
    }

    useEffect(() => {
        if (symbol) {
            if (!data || symbol !== last) {
                getResponse(symbol);
                setLast(symbol);
            }
        }
    }, [setLast, data, last, symbol]);

    useEffect(() => {
        if (!data || (data && data.status !== "OK")) {return};

        setFullNames(
            data.results.map((result) => (
                `${result.ticker} (${result.name})`
            ))
        )
    }, [data]);

    return (
        <Autocomplete 
            freeSolo
            disablePortal
            id="symbol"
            value={value || props.default}
            onChange={(event, newValue) => {
                setValue(newValue);
                
                if (newValue) {
                    let symbol = newValue.split(' ')[0];

                    setLast(symbol);
                    setSymbol(symbol);
                    props.changeState(symbol);
                }
            }}
            error={props.errors.symbol}
            helperText={props.errors.symbolErrorText}
            options={(data && data.status === "OK") ? fullNames : []}
            className={props.className}
            renderInput={(params) => 
            <TextField 
                {...params} 
                onChange={(event) => {
                        setSymbol(event.target.value);
                    }
                } 
                variant="outlined" 
                label="Symbol or Company Name" 
                required={props.required}
                error={props.errors.symbol}
                helperText={props.errors.symbolErrorText}
            />}
        />
    );
};

AutoCompleteField.defaultProps = {
    ticker: '',
    default: '',
    className: '',
    required: true,
    errors: {
        symbol: false,
        symbolErrorText: '',
    },
    errorsUpdate: () => {},
    changeState: () => {},
}

export default AutoCompleteField;
