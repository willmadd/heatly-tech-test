export enum DataCategoryEnum {
  Population = "population",
  Gdp = "gdp",
  Area = "area",
  Elevation = "averageElevation",
}

export type MarkerData = {
  [DataCategoryEnum.Population]: string;
  [DataCategoryEnum.Gdp]: string;
  [DataCategoryEnum.Area]: string;
  [DataCategoryEnum.Elevation]: string;
  x: number;
  y: number;
  h: number;
  country: string;
};

export type CylinderGeometry = {
  vertices: number[];
  colors: number[];
};
