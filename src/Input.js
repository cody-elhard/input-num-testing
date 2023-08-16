import { omit } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

const Input = ({
  value, onChange, formatter, instantUpdates, debounce, ...props
}) => {
  const [blockSelectAll, setBlockSelectAll] = useState(false);
  const [internalValue, setInternalValue] = useState((() => {
    const formattedValue = formatter(value);
    return {
      value: formattedValue,
      unformattedValue: value,
      formattedValue,
    };
  })());

  const [isFocusing, setFocus] = useState(false);
  const [onChangeTimeout, setOnChangeTimeout] = useState(null);

  useEffect(() => {
    if (!isFocusing) {
      if (`${value}` !== internalValue.unformattedValue) {
        const formattedValue = formatter(`${value}`);
        setInternalValue({
          value: formattedValue,
          unformattedValue: `${value}`,
          formattedValue,
        });
      }
    }
  });

  return (
    <input
      {...omit(props, ['forwardedRef', 'selectAllOnFocus', 'instantUpdates', 'debounce', 'formatter'])}
      ref={props.forwardedRef}
      value={internalValue.value}
      onFocus={(e) => {
        setInternalValue({
          ...internalValue,
          value: internalValue.unformattedValue === 'null' ? '' : internalValue.unformattedValue,
        });
        setFocus(true);
        if (!blockSelectAll && props.selectAllOnFocus) {
          const elem = e.target;
          setTimeout(() => {
            elem.setSelectionRange(0, internalValue.value.length);
          }, 100);
        }
      }}
      onChange={(e) => {
        const val = e.target.value;
        setInternalValue({
          value: val,
          formattedValue: formatter(val),
          unformattedValue: val,
        });

        clearTimeout(onChangeTimeout);
        if (`${value}` !== `${val}`) {
          if (instantUpdates) {
            onChange({ target: { value: val } });
          } else {
            setOnChangeTimeout(setTimeout(() => {
              onChange({ target: { value: val } });
            }, debounce));
          }
        }
      }}
      onBlur={() => {
        clearTimeout(onChangeTimeout);
        setFocus(false);
        setInternalValue({
          ...internalValue,
          value: internalValue.formattedValue,
        });
        if (`${value}` !== `${internalValue.unformattedValue}`) {
          onChange({ target: { value: internalValue.unformattedValue } });
        }

        setBlockSelectAll(true);
        setTimeout(() => { setBlockSelectAll(false) }, 500);
      }}
    />
  );
};

Input.propTypes = {
  formatter: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  instantUpdates: PropTypes.bool,
  debounce: PropTypes.number,
  selectAllOnFocus: PropTypes.bool,
};

Input.defaultProps = {
  formatter: v => v,
  instantUpdates: false,
  debounce: 300,
  selectAllOnFocus: false,
  value: '',
};

export default React.forwardRef((props, ref) => <Input {...props} forwardedRef={ref} />);
