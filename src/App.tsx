import { useState } from "react";
import { DataCategoryEnum } from "./types";
import CategorySelector from "./CategorySelector";
import Canvas from "./Canvas";

function App() {
  const [dataCategory, setDataCategory] = useState<DataCategoryEnum>(
    DataCategoryEnum.Population
  );

  return (
    <>
      <main className="relative bg-[#00334C] min-h-screen min-w-screen flex items-center justify-center">
        <Canvas dataCategory={dataCategory} />
        <CategorySelector
          dataCategory={dataCategory}
          setDataCategory={setDataCategory}
        />
      </main>
    </>
  );
}

export default App;
