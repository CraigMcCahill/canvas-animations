import { RefObject, useCallback, useEffect, useMemo } from "react";

const getPixelRatio = () => {
  return window.devicePixelRatio || 1;
};

const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

const drawQuad = (
  context: CanvasRenderingContext2D,
  xPoints: number[],
  yPoints: number[],
) => {
  context.beginPath();
  context.moveTo(xPoints[0], yPoints[0]);
  context.lineTo(xPoints[1], yPoints[1]);
  context.lineTo(xPoints[2], yPoints[2]);
  context.lineTo(xPoints[3], yPoints[3]);
  context.closePath();
  context.fill();
};

const useKaleidoscope = (
  canvasRef: RefObject<HTMLCanvasElement>,
  totalQuads: number,
  hue: number,
) => {
  const sx = useMemo(
    () => Array.from({ length: 4 }, () => Math.random() * 2 + 1),
    [],
  );
  const sy = useMemo(
    () =>
      Array(4)
        .fill(0)
        .map(() => Math.random() * 2 + 1),
    [],
  );
  const initialCornersX = useMemo(() => [0, 0, -1, -1], []);
  const initialCornersY = useMemo(() => [0, -1, -1, 0], []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");

    if (!context) return;
    const ratio = getPixelRatio();

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    return { width, height, ratio };
  }, [canvasRef]);

  useEffect(() => {
    if (!canvasRef.current) return;

    let cornersX: number[], cornersY: number[], requestId: number;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const backCanvas = document.createElement("canvas");
    const backContext = backCanvas.getContext("2d");

    const initializeAnimation = () => {
      if (!backCanvas || !backContext) return;

      const resize = resizeCanvas();
      if (!resize) return;

      const { width, height, ratio } = resize;

      // Resize the back canvas
      backCanvas.width = width * ratio;
      backCanvas.height = height * ratio;
      backContext.fillStyle = `hsla(${hue},100%,80%,0.4)`;
      backContext.translate(backCanvas.width / 2, backCanvas.height / 2);

      cornersX = initialCornersX.map((corner) => corner * width);
      cornersY = initialCornersY.map((corner) => corner * height);

      if (requestId) cancelAnimationFrame(requestId);

      const render = () => {
        if (!context) return;

        backContext.save();
        backContext.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation
        backContext.clearRect(0, 0, backCanvas.width, backCanvas.height);
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

        for (let i = 0; i < totalQuads; i++) {
          drawQuad(backContext, cornersX, cornersY);
          backContext.rotate(degreesToRadians(360 / totalQuads));
        }

        context.drawImage(backCanvas, 0, 0);
        requestId = requestAnimationFrame(render);
      };

      render();
    };

    initializeAnimation();

    const handleResize = () => {
      initializeAnimation(); // Reinitialize animation when resized
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(requestId);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    canvasRef,
    totalQuads,
    hue,
    resizeCanvas,
    initialCornersX,
    initialCornersY,
    sx,
    sy,
  ]);

  return null;
};

export default useKaleidoscope;
