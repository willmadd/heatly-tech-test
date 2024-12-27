import { useRef } from "react";
import { DataCategoryEnum } from "./types";

type Props = {
  dataCategory: DataCategoryEnum;
};

const Canvas = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return <canvas ref={canvasRef}>Canvas Not supported</canvas>;
};

export default Canvas;
