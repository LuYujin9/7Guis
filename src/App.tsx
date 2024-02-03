import "./App.css";
import Counter from "./pages/counter.tsx";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage.tsx";
import TemperatureConverter from "./pages/temperatureConverter.tsx";
import TemperatureConverterTwo from "./pages/temperatureConverterTwo.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="counter" element={<Counter />} />
      <Route path="temperatureConverter" element={<TemperatureConverter />} />
      <Route
        path="temperatureConverterTwo"
        element={<TemperatureConverterTwo />}
      />
    </Routes>
  );
}

export default App;
