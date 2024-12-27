import { useRef } from "react";
import { DataCategoryEnum } from "./types";

type Props = {
  dataCategory: DataCategoryEnum;
};

const Canvas = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <canvas
      className="w-screen max-w-[1080px] aspect-[2/1] bg-red-500 "
      ref={canvasRef}
    >
      Canvas Not supported
    </canvas>
  );
};

export default Canvas;
