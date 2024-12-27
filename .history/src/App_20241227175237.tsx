import { useState } from "react";
import { DataCategoryEnum } from "../types";

function App() {
  const [dataCategory, setDataCategory] = useState<DataCategoryEnum>(
    DataCategoryEnum.Population
  );

  return (
    <>
      <div className="text-red-400">Hello</div>
    </>
  );
}

export default App;
