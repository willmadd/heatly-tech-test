export const normaliseLatLng = (
  lat: number,
  lng: number
): { x: number; y: number } => {
  const x = (lng / 180) * 0.75;

  const y = (lat / 90) * 0.75;

  return { x, y };
};
