import { omit } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Input from './Input';


/**
 * Renders a numeric input. This is a **controlled** component, so you will need
 * handle input changes and values elsewhere in your application. See the [docs
 * on controlled/uncontrolled components](https://reactjs.org/docs/uncontrolled-components.html)
 */
class InternalInputNumeric extends Component {
  static defaultProps = {
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

  static propTypes = {
    size: PropTypes.string,
    /** Do not allow decimal places. */
    integer: PropTypes.bool,
    /** Only positive numbers allowed. */
    positiveOnly: PropTypes.bool,
    /** Only negative numbers allowed. */
    negativeOnly: PropTypes.bool,
    /** The absolute max decimal places as constrained by database. */
    maxDecimalPlaces: PropTypes.number,
    /** The default decimal places to format to. */
    minDecimalPlaces: PropTypes.number,
    /** If number is an integer value, it will add the minDecimalPlaces to it */
    alwaysShowDecimals: PropTypes.bool,
    /** Will we separate numbers with a comma, American-style, on blur. */
    commaSeparator: PropTypes.bool,
    /** What is the value supplied to the field. */
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** Prefills the input with a value if value is null or empty */
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * Gets called whenever the user types a valid number.
     *
     * @param {string} value The new value
     */
    onChange: PropTypes.func.isRequired,
    /** The prefix to apply to the number on blur. */
    prefix: PropTypes.string,
    /** The suffix to apply to the number on blur. */
    suffix: PropTypes.string,
    disabled: PropTypes.bool,
    debounce: PropTypes.number,
  }

  parseResult = (rawValue) => {
    let numericValue = rawValue;
    if (numericValue && this.props.prefix) {
      numericValue = numericValue.replace(this.props.prefix, '');
    }
    if (numericValue && this.props.suffix) {
      numericValue = numericValue.replace(this.props.suffix, '');
    }
    if (this.props.integer) {
      numericValue = parseInt(numericValue, 10);
    } else {
      numericValue = parseFloat(numericValue);
    }

    if (Number.isNaN(numericValue)) return null;

    let fixedValue = numericValue.toFixed(this.props.maxDecimalPlaces);
    const minFixedNumber = numericValue.toFixed(this.props.minDecimalPlaces);
    const noDecimalPlacedFixedNumber = numericValue.toFixed(0);

    if (parseFloat(minFixedNumber) === parseFloat(fixedValue)) {
      fixedValue = minFixedNumber;
    }

    // eslint-disable-next-line max-len
    if (!this.props.alwaysShowDecimals && parseFloat(noDecimalPlacedFixedNumber) === parseFloat(fixedValue)) {
      fixedValue = noDecimalPlacedFixedNumber;
    }

    numericValue = parseFloat(fixedValue);

    if (this.props.positiveOnly) numericValue = Math.abs(numericValue);
    if (this.props.negativeOnly) numericValue = Math.abs(numericValue) * -1;

    return numericValue;
  };

  inputFormat = (value) => {
    let numericValue = parseFloat(value);
    if (Number.isNaN(numericValue)) numericValue = parseFloat(this.props.defaultValue);

    if (Number.isNaN(numericValue)) return '';

    let formattedValue = numericValue.toFixed(this.props.maxDecimalPlaces);
    const minFixedNumber = numericValue.toFixed(this.props.minDecimalPlaces);
    const noDecimalPlacedFixedNumber = numericValue.toFixed(0);

    if (parseFloat(minFixedNumber) === parseFloat(formattedValue)) {
      formattedValue = minFixedNumber;
    }

    // eslint-disable-next-line max-len
    if (!this.props.alwaysShowDecimals && parseFloat(noDecimalPlacedFixedNumber) === parseFloat(formattedValue)) {
      formattedValue = noDecimalPlacedFixedNumber;
    }

    if (this.props.commaSeparator) {
      const thousandsDivider = ',';
      const decimalDivider = '.';

      const [integer, decimal] = formattedValue.toString().split('.');
      formattedValue = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsDivider);
      if (decimal) {
        formattedValue = `${formattedValue}${decimalDivider}${decimal}`;
      }
    }

    let sign = '';
    if (formattedValue[0] === '-') {
      formattedValue = `${formattedValue.slice(1)}`;
      sign = '-';
    }

    return `${sign}${this.props.prefix || ''}${formattedValue}${this.props.suffix || ''}`;
  };

  render() {
    const sizeClass = this.props.size ? `form-control-${this.props.size}` : '';


    return (
      <Input
        {...omit(this.props, ['alwaysShowDecimals', 'forwardedRef', 'integer', 'negativeOnly', 'positiveOnly', 'allowNegative', 'commaSeparator', 'maxDecimalPlaces', 'minDecimalPlaces', 'decimalPlaces', 'value', 'prefix', 'suffix', 'defaultValue'])}
        ref={this.props.forwardedRef}
        className={`form-control ${sizeClass} ${this.props.className || ''}`}
        formatter={this.inputFormat}
        type="numeric"
        value={this.props.value}
        onChange={e => this.props.onChange(this.parseResult(e.target.value))}
        debounce={this.props.debounce}
      />
    );
  }
}

export default React.forwardRef(
  (props, ref) => <InternalInputNumeric {...props} forwardedRef={ref} />,
);
