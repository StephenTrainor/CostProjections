import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Box, MenuItem } from '@mui/material';

import CustomFormatTextField from '../components/CustomFormatTextField';
import AutoCompleteField from '../components/AutoCompleteField';
import ApiLink from '../components/ApiLink';
import styles from './Pages.module.css';

import { pagesConstants, errorConstants } from '../AppConstants';

const { dropdownOptions, defaultProps} = pagesConstants.homePage;
const { requiredFieldErrorText, positiveValueRequiredErrorText } = errorConstants.errorMessages;
const { calculationOptions, newEquityOptions } = dropdownOptions;

const Home = (props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const inputValues = (state && state.edit) ? state.userInput : { ...props.userInput };
  const errorValues = (state) ? {
    ...props.errors,
    ...state.errors
  } : {
    ...props.errors
  };

  const [userInputValues, setUserInputValues] = useState(inputValues);
  const [errors, setErrors] = useState(errorValues);

  const validatePositiveInputValue = (event) => {
    var key = event.target.name;
    var errorText = `${key}ErrorText`;

    if (event.target.value.includes('-')) {
      setErrors({
        ...errors,
        [key]: true,
        [errorText]: positiveValueRequiredErrorText,
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
    const { value } = event.target;

    const newInputValue = value;//.replaceAll("$", "").replaceAll(",", "").replaceAll(".", "");
    
    setUserInputValues({
      ...userInputValues,
      [event.target.name]: newInputValue,
    });

    if (!value) {
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
    
    for (let [key, value] of Object.entries(userInputValues)) { // checking for empty input fields
      if (value) { continue; } // skip if a value is present in the input field
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
      navigate("/quote", { state: {
        userInput: userInputValues
      } });
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
              userInputValues={userInputValues}
              errors={errors}
              label="Shares Owned"
              field="shares"
            />
          </div>
          <div className={styles.userInputContainer}>
            <CustomFormatTextField
              onChangeFunction={validatePositiveInputValue}
              userInputValues={userInputValues}
              errors={errors}
              label="Average Cost Per Share"
              field="avgCost"
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
                  userInputValues={userInputValues}
                  errors={errors}
                  label="Cash Available"
                  field="cash"
                  prefix="$"
                />
              </div>
            ) : (
              <div className={styles.userInputContainer}>
                <CustomFormatTextField 
                  onChangeFunction={validatePositiveInputValue}
                  label="New Shares"
                  userInputValues={userInputValues}
                  errors={errors}
                  field="newShares"
                />
              </div>
            )}
            </>
          ) : (
            <div className={styles.userInputContainer}>
              <CustomFormatTextField 
                onChange={validatePositiveInputValue}
                userInputValues={userInputValues}
                errors={errors}
                label="Target Average Cost"
                field="targetAvgCost"
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
            <ApiLink />
            <ApiLink href="https://polygon.io" linkText="Tickers Provided by Polygon" />
          </footer>
        </Box>
      </div>
    </div>
  );
}

Home.defaultProps = {
  ...defaultProps
};

export default Home;
