import './App.css';
import InputNumeric from './InputNumeric';
import { useState } from 'react';
import CustomInputNumeric from './CustomInputNumeric';

function App() {
  const [value, setValue] = useState(0);

  const inputNumericProps = {
    prefix: '$',
    integer: false,
    value: value,
    negativeOnly: false,
    commaSeparator: true,
    onChange: (value) => {
      setValue(value);
    },
    minDecimalPlaces: 2,
    maxDecimalPlaces: 4,
    style: {
      width: '500px',
      height: '100px',
      fontSize: '100px',
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h5>
          Custom Input Numeric
        </h5>
        <CustomInputNumeric {...inputNumericProps} />

        <h5>
          Harvest Profit
        </h5>
        <InputNumeric {...inputNumericProps} />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
