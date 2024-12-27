import { useState } from "react";
import { DataCategoryEnum } from "./types";
import CategorySelector from "./CategorySelector";

function App() {
  const [dataCategory, setDataCategory] = useState<DataCategoryEnum>(
    DataCategoryEnum.Population
  );

  return (
    <>
      <main className="relative bg-blue-900">
        <CategorySelector
          dataCategory={dataCategory}
          setDataCategory={setDataCategory}
        />
        {/* <div className="text-red-400">Hello</div> */}
      </main>
    </>
  );
}

export default App;
