export const stringToColor = (input: string) => {
  // Hash the string to generate a number
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate normalized RGB values (0.0 to 1.0)
  const r = ((hash >> 24) & 0xff) / 255.0;
  const g = ((hash >> 16) & 0xff) / 255.0;
  const b = ((hash >> 8) & 0xff) / 255.0;

  // Ensure values are within range [0.0, 1.0]
  return {
    r: Number(r.toFixed(3)),
    g: Number(g.toFixed(3)),
    b: Number(b.toFixed(3)),
  };
};
