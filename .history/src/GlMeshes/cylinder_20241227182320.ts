import { stringToColor } from "../helpers/stringToColor";
import { CylinderGeometry } from "../types";

type CylinderProps = {
  x?: number;
  y?: number;
  h?: number;
  radius?: number;
  segments?: number;
  colStringHash: string;
};

export const cylinder = ({
  x = 0,
  y = 0,
  h = 0,
  radius = 0.005,
  segments = 20,
  colStringHash,
}: CylinderProps): CylinderGeometry => {
  const vertices: number[] = [];
  const colors: number[] = [];
  const angleStep = (2 * Math.PI) / segments;

  for (let i = 0; i < segments; i++) {
    const angle = i * angleStep;
    const nextAngle = (i + 1) * angleStep;

    const x1 = x + radius * Math.cos(angle);
    const y1 = y + radius * Math.sin(angle);
    const x2 = x + radius * Math.cos(nextAngle);
    const y2 = y + radius * Math.sin(nextAngle);

    const col = stringToColor(colStringHash);

    // Bottom face
    vertices.push(x, y, 0, x1, y1, 0, x2, y2, 0);
    colors.push(col.r, col.g, col.b, col.r, col.g, col.b, col.r, col.g, col.b);

    // Top face
    vertices.push(x, y, h, x2, y2, h, x1, y1, h);
    colors.push(col.r, col.g, col.b, col.r, col.g, col.b, col.r, col.g, col.b);

    // Side faces
    vertices.push(x1, y1, 0, x1, y1, h, x2, y2, 0);
    vertices.push(x2, y2, 0, x1, y1, h, x2, y2, h);
    colors.push(
      col.r,
      col.g,
      col.b,
      col.r,
      col.g,
      col.b,
      col.r,
      col.g,
      col.b,
      col.r,
      col.g,
      col.b,
      col.r,
      col.g,
      col.b,
      col.r,
      col.g,
      col.b
    );
  }

  // Ensure a valid return of the expected type
  return { vertices, colors };
};
