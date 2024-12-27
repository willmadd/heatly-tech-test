enum DataCategoryEnum {
  Population = "population",
  Gdp = "gdp",
  Area = "area",
  Elevation = "averageElevation",
}

type MarkerData = {
  [DataCategoryEnum.Population]: string;
  [DataCategoryEnum.Gdp]: string;
  [DataCategoryEnum.Area]: string;
  [DataCategoryEnum.Elevation]: string;
  x: number;
  y: number;
  h: number;
  country: string;
};

type CylinderGeometry = {
  vertices: number[];
  colors: number[];
};
