import { stringToColor } from "../helpers/stringToColor";
import { CylinderGeometry } from "../types";

export const cylinder = (
  x: number = 0,
  y: number = 0,
  height: number = 0,
  colStringHash: string
): CylinderGeometry => {
  const RADIUS = 0.005;
  const SEGMENTS = 20;
  const vertices: number[] = [];
  const colors: number[] = [];
  const angleStep = (2 * Math.PI) / SEGMENTS;

  for (let i = 0; i < SEGMENTS; i++) {
    const angle = i * angleStep;
    const nextAngle = (i + 1) * angleStep;

    const x1 = x + RADIUS * Math.cos(angle);
    const y1 = y + RADIUS * Math.sin(angle);
    const x2 = x + RADIUS * Math.cos(nextAngle);
    const y2 = y + RADIUS * Math.sin(nextAngle);

    const col = stringToColor(colStringHash);

    // Bottom
    vertices.push(x, y, 0, x1, y1, 0, x2, y2, 0);
    colors.push(col.r, col.g, col.b, col.r, col.g, col.b, col.r, col.g, col.b);

    // Top
    vertices.push(x, y, height, x2, y2, height, x1, y1, height);
    colors.push(col.r, col.g, col.b, col.r, col.g, col.b, col.r, col.g, col.b);

    // Side
    vertices.push(x1, y1, 0, x1, y1, height, x2, y2, 0);
    vertices.push(x2, y2, 0, x1, y1, height, x2, y2, height);
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

  return { vertices, colors };
};
