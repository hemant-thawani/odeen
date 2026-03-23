import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import DataEntry from "./DataEntry";
import History from "./History";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Layout Route: Home includes Sidebar */}
      <Route path="/home" element={<Home />}>
        <Route index element={<DataEntry />} />
        <Route path="dataentry" element={<DataEntry />} />
        <Route path="history" element={<History />} /> */
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App;