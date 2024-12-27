export enum DataCategoryEnum {
  Population = "population",
  Gdp = "gdp",
  Area = "area",
  Elevation = "averageElevation",
}

export type RawData = {
  country: string;
  lat: number;
  lon: number;
  population: number;
  gdp: number;
  area: number;
  averageElevation: number;
};

export type MarkerData = {
  [DataCategoryEnum.Population]: number;
  [DataCategoryEnum.Gdp]: number;
  [DataCategoryEnum.Area]: number;
  [DataCategoryEnum.Elevation]: number;
  x: number;
  y: number;
  h: number;
  country: string;
  lat: number;
  lon: number;
};

export type CylinderGeometry = {
  vertices: number[];
  colors: number[];
};