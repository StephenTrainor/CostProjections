import NumberFormat from 'react-number-format';
import React, { useState, forwardRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import styles from './Pages.module.css';
import Footer from '../components/Footer';
import AutoCompleteField from '../components/AutoCompleteField';

const err = "Required Field";
const calculationOptions = [
  {
    value: 'DCAP',
    label: 'Dollar Cost Average Projection',
  },
  {
    value: 'CNP',
    label: 'Cash Needed Project',
  },
];

const newEquityOptions = [
  {
    value: 'CA',
    label: 'Cash Available',
  },
  {
    value: 'NS',
    label: 'New Shares',
  },
];

const NumberFormatCustomDollar = forwardRef(function NumberFormatCustomDollar(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
});

const NumberFormatCustom = forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
});

const Home = (props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const inputValues = (state && state.edit) ? state : { ...props.userInput };

  var errorValues = {
    ...props.errors,
  };

  if (state) { 
    if (state.targetAvgCost && state.targetErrorText) {
      errorValues = {
        ...errorValues,
        targetAvgCost: state.targetAvgCost,
        targetAvgCostErrorText: state.targetErrorText,
      };
    }
    if (state.symbol && state.symbolErrorText) {
      errorValues = {
        ...errorValues,
        symbol: state.symbol,
        symbolErrorText: state.symbolErrorText,
      };
    }
  }

  const [values, setValues] = useState(inputValues);
  const [errors, setErrors] = useState(errorValues);

  const validatePositiveInputValue = (event) => {
    var key = event.target.name;
    var errorText = `${key}ErrorText`;

    if (event.target.value.includes('-')) {
      setErrors({
        ...errors,
        [key]: true,
        [errorText]: 'Must be a positive value',
      })
    } 
    else {
      setErrors({
        ...errors,
        [key]: false,
        [errorText]: '',
      });
      updateInputValues(event);
    }
  }

  const updateInputValues = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });

    if (!event.target.value) {
      setErrors({
        ...errors,
        [event.target.name]: true,
      });
    }
  };

  const externalSetSymbol = (symbol) => {
    setValues({
      ...values,
      symbol: symbol,
    });
  };

  const getResponse = (event) => {
    event.preventDefault();

    let emptyInputField = false;
    for (let [key, value] of Object.entries(values)) {
      if (value) { continue; }
      if (values.option === "CNP" && (key === "cash" || key === "newShares")) { continue; }
      if (values.option === "DCAP") {
        if (key === "targetAvgCost") { continue; }
        if (key === "cash" && values.newShares) { continue; }
        if (key === "newShares" && values.cash) { continue; }
      }

      setErrors(prev => ({
        ...prev,
        [key]: true,
      }));
      emptyInputField = true;
    }

    if (!emptyInputField) {
      navigate("/quote", { state: values });
    }
  };

  return (
    <div className={styles.centeredContainer}>
      <div className={`${styles.mainHeaderContainer} ${styles.centeredContainer}`}>
        <h1 className={styles.mainHeader}>Cost Projections</h1>
      </div>
      <div className={`${styles.centeredContainer}`}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className={styles.columnFlexBox}
          borderRadius={5}
          backgroundColor="#FFFFFF"
          width={320}
        >
          <div className={styles.userInputContainer}>
            <TextField 
              select
              className={styles.userInput}
              label="Calculation Option"
              value={values.option}
              name="option"
              onChange={(event) => {updateInputValues(event)}}
            >
              {calculationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className={styles.userInputContainer}>
              <AutoCompleteField 
                changeState={externalSetSymbol} 
                className={styles.userInput}
                required={true}
                default={values.symbol}
                errors={errors}
                errorsUpdate={setErrors}
              />
          </div>
          <div className={styles.userInputContainer}>
            <TextField 
              onChange={(event) => {validatePositiveInputValue(event)}}
              className={styles.userInput}
              varaint="outlined"
              value={values.shares}
              label="Shares Owned"
              name="shares"
              id="shares"
              error={errors.shares}
              helperText={errors.sharesErrorText || ((errors.shares) ? err : '')}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
              required
            />
          </div>
          <div className={styles.userInputContainer}>
            <TextField 
              onChange={(event) => {validatePositiveInputValue(event)}}
              className={styles.userInput}
              variant="outlined"
              value={values.avgCost}
              label="Average Cost Per Share"
              name="avgCost"
              id="avgCost"
              error={errors.avgCost}
              helperText={errors.avgCostErrorText || ((errors.avgCost) ? err : '')}
              InputProps={{
                inputComponent: NumberFormatCustomDollar,
              }}
              required
            />
          </div>
          { values.option === "DCAP" ? (
            <>
            <div className={styles.userInputContainer}>
              <TextField 
                select
                className={styles.userInput}
                label="Added Equity Option"
                value={values.newEquityOption}
                name="newEquityOption"
                onChange={(event) => {updateInputValues(event)}}
              >
                {newEquityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            { values.newEquityOption === "CA" ? (
              <div className={styles.userInputContainer}>
                <TextField
                  onChange={(event) => {validatePositiveInputValue(event)}}
                  className={styles.userInput}
                  variant="outlined"
                  value={values.cash}
                  label="Cash Available"
                  name="cash"
                  id="cash"
                  error={errors.cash}
                  helperText={errors.cashErrorText || ((errors.cash) ? err : '')}
                  InputProps={{
                    inputComponent: NumberFormatCustomDollar,
                  }}
                  required
                />
              </div>
            ) : (
              <div className={styles.userInputContainer}>
                <TextField 
                  onChange={(event) => {validatePositiveInputValue(event)}}
                  className={styles.userInput}
                  variant="outlined"
                  value={values.newShares}
                  label="New Shares"
                  name="newShares"
                  id="newShares"
                  error={errors.newShares}
                  helperText={errors.newSharesErrorText || ((errors.newShares) ? err : '')}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                  required
                />
              </div>
            )}
            </>
          ) : (
            <div className={styles.userInputContainer}>
              <TextField 
                onChange={(event) => {validatePositiveInputValue(event)}}
                className={styles.userInput}
                variant="outlined"
                value={values.targetAvgCost}
                label="Target Average Cost"
                name="targetAvgCost"
                id="targetAvgCost"
                error={errors.targetAvgCost}
                helperText={(state && state.targetErrorText) ? errors.targetAvgCostErrorText : ((errors.targetAvgCost) ? err : '')}
                InputProps={{
                  inputComponent: NumberFormatCustomDollar,
                }}
                required
              />
            </div>
          )}
          <div className={styles.userInputContainer}>
            <Button 
              type="submit"
              variant="contained"
              onClick={(event) => {getResponse(event)}}
            >
              Get Quote
            </Button>
          </div>
          <footer>
            <Footer />
            <Footer href="https://polygon.io" msg="Tickers Provided by Polygon" />
          </footer>
        </Box>
      </div>
    </div>
  );
}

Home.defaultProps = {
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
    newEquityOption: false,
    newEquityOptionErrorText: '',
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
};

export default Home;

/*
1. Typeahead for searching, [X]
2. revisit UX [X]
2.1 Backend code for iex [X]
2.2 Remove inline functions [X]
2.3 Remove extra divs [X]
2.4 Add database for most visited stocks [X]
2.5 Clean up code before code review [X]
3. design system styling/components (outsource as much as possible to OOB components) ??
4. alpaca use cases (no coding) ??
*/
