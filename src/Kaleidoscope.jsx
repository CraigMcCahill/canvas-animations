import React from "react";

import { useRef, useEffect } from "react";

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
  //alert("Start Draw quad!");
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
  const { totalQuads } = props;
  let ref = useRef();

  useEffect(() => {
    let canvas = ref.current;
    let context = canvas.getContext("2d");

    let ratio = getPixelRatio(context);
    let width = getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    let height = getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    let backCanvas = document.createElement("canvas");
    backCanvas.height = canvas.height;
    backCanvas.width = canvas.width;
    let backContext = backCanvas.getContext("2d");
    backContext.fillStyle = "rgba(217, 13, 145, .3)";
    backContext.translate(canvas.width / 2, canvas.height / 2);

    let requestId;
    let rotation = 0;
    const quads = [];

    //the four corners of the quad
    //TODO: move to init function
    const cornersX = new Array(4);
    cornersX[0] = 0;
    cornersX[1] = 0;
    cornersX[2] = -width;
    cornersX[3] = -width;
    const cornersY = new Array(4);
    cornersY[0] = 0;
    cornersY[1] = -height;
    cornersY[2] = -height;
    cornersY[3] = 0;

    const sy = new Array(4);
    const sx = new Array(4);

    for (let i = 0; i < 4; i++) {
      sx[i] = Math.random() * 2 + 1;
      sy[i] = Math.random() * 2 + 1;
    }

    const render = () => {
      backContext.save();
      backContext.setTransform(1, 0, 0, 1, 0, 0);
      backContext.clearRect(0, 0, canvas.width, canvas.height);
      context.clearRect(0, 0, canvas.width, canvas.height);
      backContext.restore();

      for (let i = 0; i < 4; i++) {
        cornersX[i] += sx[i];
        cornersY[i] += sy[i];
        if (Math.abs(cornersX[i]) > width) sx[i] = -sx[i];
        if (Math.abs(cornersY[i]) > height) sy[i] = -sy[i];
      }
      for (let i = 0; i < totalQuads; i++) {
        drawQuad(rotation + 1, backContext, cornersX, cornersY, totalQuads);
      }

      context.drawImage(backCanvas, 0, 0);
      requestId = requestAnimationFrame(render);
    };

    render();
    rotation++;

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, []);

  return <canvas ref={ref} style={{ width: "100vw", height: "100vh" }} />;
};

export default Kaleidoscope;
