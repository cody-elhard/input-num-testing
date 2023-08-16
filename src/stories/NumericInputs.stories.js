import { useState } from 'react';
import '../App.css';
import CustomInputNumeric from "../CustomInputNumeric";

export const Default = (args) => {
  const [value, setValue] = useState(0);

  return (
    <CustomInputNumeric
      {...args}
      value={value}
      onChange={(val) => setValue(val)}
    />
  );
}

export default {
  title: 'Codys Numeric Input',
  component: CustomInputNumeric,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  // tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
};