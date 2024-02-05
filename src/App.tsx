import "./App.css";
import Counter from "./pages/counter.tsx";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage.tsx";
import TemperatureConverterTwo from "./pages/temperatureConverter.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="counter" element={<Counter />} />
      <Route
        path="temperatureConverter"
        element={<TemperatureConverterTwo />}
      />
    </Routes>
  );
}

export default App;
