import React from "react";
import PropTypes from "prop-types";
import { useRef } from "react";
import useKaleidoscope from "../hooks/useKaleidoscope";

interface KaleidoscopeProps {
  totalQuads: number;
  hue: number;
}

const Kaleidoscope = ({ totalQuads, hue }: KaleidoscopeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useKaleidoscope(canvasRef, totalQuads, hue);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
};

Kaleidoscope.propTypes = {
  totalQuads: PropTypes.number.isRequired,
  hue: PropTypes.number.isRequired,
};

export default Kaleidoscope;
