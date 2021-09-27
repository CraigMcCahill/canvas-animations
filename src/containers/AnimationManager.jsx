import React from "react";

import Slider from "@material-ui/core/Slider";

import Kaleidoscope from "../Kaleidoscope";

const AnimationManager = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="animation">
      <Kaleidoscope totalQuads={24} hue={value} />
      <div className="controls">
        <Slider
          value={value}
          onChange={handleChange}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          min={0}
          max={360}
        />
      </div>
    </div>
  );
};

export default AnimationManager;
