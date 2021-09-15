import React from "react";

import Slider from "@material-ui/core/Slider";

import Kaleidoscope from "../Kaleidoscope";

const AnimationManager = () => {
  const [value, setValue] = React.useState(4);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Kaleidoscope totalQuads={value} />
      <Slider
        value={value}
        onChange={handleChange}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        min={2}
        max={32}
      />
    </div>
  );
};

export default AnimationManager;
