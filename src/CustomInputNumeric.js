import { useState } from "react";
import PropTypes from 'prop-types';
import { toNumber } from "lodash";

const CustomInputNumeric = ({
  integer, positiveOnly, negativeOnly, maxDecimalPlaces, minDecimalPlaces, alwaysShowDecimals,
  commaSeparator, value, prefix, suffix, disabled, defaultValue, size, debounce, onChange
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    // Highlight text on focus
    e.target.select();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (isNaN(value)) {
      onChange(defaultValue);
    }
  };

  const handleChange = (event) => {
    let options = {
      style: 'decimal',
      useGrouping: false,
    }
    if (integer) {
      options.maximumFractionDigits = 0;
      options.minimumFractionDigits = 0;
    }
    let newValue = parseFloat(event.target.value);
    newValue = newValue.toLocaleString('en-US', options);
    newValue = toNumber(newValue);
    if (negativeOnly && !isNaN(newValue) && newValue !== 0) {
      newValue = newValue < 0 ? newValue : -1 * newValue;
    }
    onChange(toNumber(newValue));
  };

  const formattedValue = (value) => {
    let options = {
      style: 'decimal',
      useGrouping: false
    };
    if (prefix === '$') {
      options.style = 'currency';
      options.currency = 'USD';
    }
    if (commaSeparator) {
      options.useGrouping = true;
    }
    if (integer) {
      options.maximumFractionDigits = 0;
      options.minimumFractionDigits = 0;
    }
    if (negativeOnly) {
      options.signDisplay = 'negative';
    }
    return Intl.NumberFormat('en-US', options).format(value);
  };

  return (
    <input
      // Value is used to store the "raw value", without formatting
      // placeholder is used to display the formatted value
      // This allows us to maintain a seperation of concerns
      value={isFocused ? value : ''}
      placeholder={isFocused ? '' : formattedValue(value)}

      className="custom-input-numeric"
      type="number"
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      style={{
        width: '500px',
        height: '100px',
        // fontSize: '100px',
        // Placeholder color does not match
      }}
    />
  );
}

CustomInputNumeric.propTypes = {
  integer: PropTypes.bool,
  positiveOnly: PropTypes.bool,
  negativeOnly: PropTypes.bool,
  maxDecimalPlaces: PropTypes.number,
  minDecimalPlaces: PropTypes.number,
  alwaysShowDecimals: PropTypes.bool,
  commaSeparator: PropTypes.bool,
  value: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  debounce: PropTypes.number,

  onChange: PropTypes.func.isRequired,
}

CustomInputNumeric.defaultProps = {
  integer: false,
  positiveOnly: false,
  negativeOnly: false,
  maxDecimalPlaces: 4,
  minDecimalPlaces: 2,
  alwaysShowDecimals: false,
  commaSeparator: false,
  value: null,
  prefix: null,
  suffix: null,
  disabled: false,
  defaultValue: null,
  size: null,
  debounce: 300,
}

export default CustomInputNumeric;