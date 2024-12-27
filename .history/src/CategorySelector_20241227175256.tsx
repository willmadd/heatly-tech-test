import { DataCategoryEnum } from "../types";
type Props = {};

const CategorySelector = (props: Props) => {
  return (
    <div className="absolute top-5 left-5 bg-white min-h-12 min-w-12 rounded shadow-md border px-3 py-1 ">
      <fieldset className="grid grid-cols-[1fr,auto] gap-x-2">
        <label htmlFor="marker1">Population</label>
        <input
          checked={dataCategory === DataCategoryEnum.Population}
          onChange={() => setDataCategory(DataCategoryEnum.Population)}
          type="radio"
          name="marker"
          id="marker1"
        />
        <label htmlFor="marker2">GDP</label>
        <input
          type="radio"
          name="marker"
          id="marker2"
          checked={dataCategory === DataCategoryEnum.Gdp}
          onChange={() => setDataCategory(DataCategoryEnum.Gdp)}
        />
        <label htmlFor="marker3">Area</label>
        <input
          type="radio"
          name="marker"
          id="marker3"
          checked={dataCategory === DataCategoryEnum.Area}
          onChange={() => setDataCategory(DataCategoryEnum.Area)}
        />
        <label htmlFor="marker4">Average Elevation</label>
        <input
          type="radio"
          name="marker"
          id="marker4"
          checked={dataCategory === DataCategoryEnum.Elevation}
          onChange={() => setDataCategory(DataCategoryEnum.Elevation)}
        />
      </fieldset>
    </div>
  );
};

export default CategorySelector;
