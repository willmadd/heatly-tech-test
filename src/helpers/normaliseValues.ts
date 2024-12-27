export const normaliseValues = (
  value: number,
  min: number,
  max: number
): number => {
  return (value - min) / (max - min);
};
