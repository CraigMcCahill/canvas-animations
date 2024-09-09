import { useEffect } from "react";

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
  context.rotate(degreesToRadians(360 / totalQuads));
  context.beginPath();
  context.moveTo(xPoints[0], yPoints[0]);
  context.lineTo(xPoints[1], yPoints[1]);
  context.lineTo(xPoints[2], yPoints[2]);
  context.lineTo(xPoints[3], yPoints[3]);
  context.closePath();
  context.fill();
};

const useKaleidoscope = (canvasRef, totalQuads, hue) => {
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const ratio = getPixelRatio(context);

    // Properly parse width and height
    const computedStyle = getComputedStyle(canvas);
    const width = parseFloat(computedStyle.getPropertyValue("width"));
    const height = parseFloat(computedStyle.getPropertyValue("height"));

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const sx = Array(4)
      .fill()
      .map(() => Math.random() * 2 + 1);
    const sy = Array(4)
      .fill()
      .map(() => Math.random() * 2 + 1);

    let cornersX = [0, 0, -width, -width];
    let cornersY = [0, -height, -height, 0];

    const backCanvas = document.createElement("canvas");
    backCanvas.width = canvas.width;
    backCanvas.height = canvas.height;
    const backContext = backCanvas.getContext("2d");
    backContext.fillStyle = `hsla(${hue},100%,50%,0.4)`;
    backContext.translate(canvas.width / 2, canvas.height / 2);

    let requestId;
    let rotation = 0;

    const render = () => {
      // Clear the canvas for new drawing
      backContext.save();
      backContext.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation
      backContext.clearRect(0, 0, canvas.width, canvas.height);
      context.clearRect(0, 0, canvas.width, canvas.height);
      backContext.restore();

      // Update corners and reflect motion
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

      // Draw quads
      for (let i = 0; i < totalQuads; i++) {
        drawQuad(rotation + 1, backContext, cornersX, cornersY, totalQuads);
      }

      // Draw the back buffer onto the main canvas
      context.drawImage(backCanvas, 0, 0);

      requestId = requestAnimationFrame(render);
      rotation += 1;
    };

    render();

    // Cleanup on component unmount
    return () => {
      if (requestId) cancelAnimationFrame(requestId);
    };
  }, [canvasRef, totalQuads, hue]); // Dependencies: ref, totalQuads, hue
};

export default useKaleidoscope;
