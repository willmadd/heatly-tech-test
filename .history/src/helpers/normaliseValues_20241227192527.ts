export const normaliseValues = (value: number, min: number, max: number) => {
  return (value - min) / (max - min);
};

const markers = data.map((val) => {
  const { x, y } = normaliseLatLng(val.lat, val.lon);

  const maxPopulation = Math.max(...data.map((o) => o.population));
  const minPopulation = Math.min(...data.map((o) => o.population));

  const minGdp = Math.min(...data.map((o) => o.gdp));
  const maxGdp = Math.max(...data.map((o) => o.gdp));

  const minArea = Math.min(...data.map((o) => o.area));
  const maxArea = Math.max(...data.map((o) => o.area));

  const minElevation = Math.min(...data.map((o) => o.averageElevation));
  const maxElevation = Math.max(...data.map((o) => o.averageElevation));

  return {
    [DataCategoryEnum.Population]: normaliseValues(
      val.population,
      minPopulation,
      maxPopulation
    ),
    [DataCategoryEnum.Gdp]: normaliseValues(val.gdp, minGdp, maxGdp),
    [DataCategoryEnum.Area]: normaliseValues(val.area, minArea, maxArea),
    [DataCategoryEnum.Elevation]: normaliseValues(
      val.averageElevation,
      minElevation,
      maxElevation
    ),
    x,
    y,
    lat: val.lat,
    lon: val.lon,
    h: 0.3,
    country: val.country,
  };
});
