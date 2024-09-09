import React, { useRef } from "react";
import PropTypes from "prop-types";
import useKaleidoscope from "../hooks/useKaleidoscope";

const Kaleidoscope = ({ totalQuads, hue }) => {
  const canvasRef = useRef(null);

  useKaleidoscope(canvasRef, totalQuads, hue);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    />
  );
};

Kaleidoscope.propTypes = {
  totalQuads: PropTypes.number.isRequired,
  hue: PropTypes.number.isRequired,
};

export default Kaleidoscope;
