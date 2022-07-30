import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Box, MenuItem } from '@mui/material';

import CustomFormatTextField from '../components/CustomFormatTextField';
import AutoCompleteField from '../components/AutoCompleteField';
import Footer from '../components/Footer';
import styles from './Pages.module.css';

const requiredFieldErrorText = "Required Field";
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

  const [userInputValues, setUserInputValues] = useState(inputValues);
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
    const newInputValue = event.target.value.replaceAll("$", "").replaceAll(",", "").replaceAll(".", "");
    
    setUserInputValues({
      ...userInputValues,
      [event.target.name]: newInputValue,
    });

    if (!event.target.value) {
      setErrors({
        ...errors,
        [event.target.name]: true,
      });
    }
  };

  const externalSetSymbol = (symbol) => {
    setUserInputValues({
      ...userInputValues,
      symbol: symbol,
    });
  };

  const validateRedirectToQuote = (event) => {
    event.preventDefault();

    let emptyInputField = false;
    for (let [key, value] of Object.entries(userInputValues)) {
      if (value) { continue; }
      if (userInputValues.option === "CNP" && (key === "cash" || key === "newShares")) { continue; }
      if (userInputValues.option === "DCAP") {
        if (key === "targetAvgCost") { continue; }
        if (key === "cash" && userInputValues.newShares) { continue; }
        if (key === "newShares" && userInputValues.cash) { continue; }
      }

      setErrors(prev => ({
        ...prev,
        [key]: true,
      }));
      emptyInputField = true;
    }

    if (!emptyInputField) {
      console.log(userInputValues);
      navigate("/quote", { state: userInputValues });
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
              value={userInputValues.option}
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
                defaultTickerSymbol={userInputValues.symbol}
                className={styles.userInput}
                requiredInputField={true}
                errors={errors}
                updateErrors={setErrors}
                externalSetSymbol={externalSetSymbol} 
              />
          </div>
          <div className={styles.userInputContainer}>
            <CustomFormatTextField 
              onChange={validatePositiveInputValue}
              value={userInputValues.shares}
              label="Shares Owned"
              name="shares"
              id="shares"
              error={errors.shares}
              helperText={errors.sharesErrorText || ((errors.shares) ? requiredFieldErrorText : '')}
            />
          </div>
          <div className={styles.userInputContainer}>
            <CustomFormatTextField
              onChangeFunction={validatePositiveInputValue}
              value={userInputValues.avgCost}
              label="Average Cost Per Share"
              name="avgCost"
              id="avgCost"
              error={errors.avgCost}
              helperText={errors.avgCostErrorText || ((errors.avgCost) ? requiredFieldErrorText : '')}
              prefix="$"
            />
          </div>
          { userInputValues.option === "DCAP" ? (
            <>
            <div className={styles.userInputContainer}>
              <TextField 
                select
                className={styles.userInput}
                label="Added Equity Option"
                value={userInputValues.newEquityOption}
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
            { userInputValues.newEquityOption === "CA" ? (
              <div className={styles.userInputContainer}>
                <CustomFormatTextField 
                  onChangeFunction={validatePositiveInputValue}
                  value={userInputValues.cash}
                  label="Cash Available"
                  name="cash"
                  id="cash"
                  erorr={errors.cash}
                  helperText={errors.cashErrorText || ((errors.cash) ? requiredFieldErrorText : '')}
                  prefix="$"
                />
              </div>
            ) : (
              <div className={styles.userInputContainer}>
                <CustomFormatTextField 
                  onChangeFunction={validatePositiveInputValue}
                  value={userInputValues.newShares}
                  label="New Shares"
                  name="newShares"
                  id="newShares"
                  error={errors.newShares}
                  helperText={errors.newSharesErrorText || ((errors.newShares) ? requiredFieldErrorText : '')}
                />
              </div>
            )}
            </>
          ) : (
            <div className={styles.userInputContainer}>
              <CustomFormatTextField 
                onChange={validatePositiveInputValue}
                value={userInputValues.targetAvgCost}
                label="Target Average Cost"
                name="targetAvgCost"
                id="targetAvgCost"
                error={errors.targetAvgCost}
                helperText={(state && state.targetErrorText) ? errors.targetAvgCostErrorText : ((errors.targetAvgCost) ? requiredFieldErrorText : '')}
                prefix="$"
              />
            </div>
          )}
          <div className={styles.userInputContainer}>
            <Button 
              type="submit"
              variant="contained"
              onClick={(event) => {validateRedirectToQuote(event)}}
            >
              Get Quote
            </Button>
          </div>
          <footer>
            <Footer />
            <Footer href="https://polygon.io" linkText="Tickers Provided by Polygon" />
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
