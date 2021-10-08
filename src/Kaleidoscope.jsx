import { React, useRef, useEffect } from "react";
import PropTypes from 'prop-types';

const getPixelRatio = (context) => {
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  return (window.devicePixelRatio || 1) / backingStore;
};

const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

const drawQuad = (rotate, context, xPoints, yPoints, totalQuads) => {
  context.rotate(degreesToRadians(1 * (360 / totalQuads)));

  context.beginPath();
  context.moveTo(xPoints[0], yPoints[0]);
  context.lineTo(xPoints[1], yPoints[1]);
  context.lineTo(xPoints[2], yPoints[2]);
  context.lineTo(xPoints[3], yPoints[3]);

  context.closePath();
  context.fill();
};


const Kaleidoscope = (props) => {
  const { totalQuads, hue } = props;
  const ref = useRef();

  useEffect(() => {
    // x and y coordinate incrementors to move quad corners randomly
    const sx = new Array(4).fill().map(() => Math.random() * 2 + 1);
    const sy = new Array(4).fill().map(() => Math.random() * 2 + 1);
    const canvas = ref.current;

    const context = canvas.getContext("2d");

    const ratio = getPixelRatio(context);
    const width = getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    const height = getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    let cornersX = [0, 0, -width, -width];
    let cornersY = [0, -height, -height, 0];

    const backCanvas = document.createElement("canvas");
    backCanvas.height = canvas.height;
    backCanvas.width = canvas.width;
    const backContext = backCanvas.getContext("2d");
    backContext.fillStyle = `hsla(${hue},100%,50%,0.4)`;
    backContext.translate(canvas.width / 2, canvas.height / 2);

    let requestId;
    const rotation = 0;

    const render = () => {
      backContext.save();
      backContext.setTransform(1, 0, 0, 1, 0, 0);
      backContext.clearRect(0, 0, canvas.width, canvas.height);
      context.clearRect(0, 0, canvas.width, canvas.height);
      backContext.restore();

      cornersX = cornersX.map((cornerX, i) => {
        const newCornerX = cornerX + sx[i];
        if (Math.abs(newCornerX) > width) sx[i] = -sx[i];
        return newCornerX;
      });

      cornersY = cornersY.map((cornerY, i) => {
        const newCornerY = cornerY + sy[i];
        if (Math.abs(newCornerY) > height) sy[i] = -sy[i];
        return newCornerY;
      });

      cornersX.forEach(() => {
        drawQuad(rotation + 1, backContext, cornersX, cornersY, totalQuads);
      });

      context.drawImage(backCanvas, 0, 0);
      requestId = requestAnimationFrame(render);
    };

    render();
    // rotation += 1;

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [totalQuads, hue]);

  return (
    <canvas ref={ref}
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
  hue: PropTypes.number.isRequired
};


export default Kaleidoscope;
