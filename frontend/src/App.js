import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
import SubscriptionCalculator from "./components/SubscriptionCalculator";
import Navbar from "./components/Navbar";
import "../src/App.css";

const App = () => {
  const [data, setData] = useState([]);

  const handleUploadComplete = async () => {
    const response = await fetch("http://localhost:5000/api/upload");
    const result = await response.json();
    setData(result.data);
  };

  return (
    <div>
      <Navbar />
      
      <FileUpload onUploadComplete={handleUploadComplete} />
      {data.length > 0 && <DataTable data={data} />}
      {data.length > 0 && <SubscriptionCalculator data={data} />}
    </div>
  );
};

export default App;
