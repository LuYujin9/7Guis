import "./App.css";
import Counter from "./pages/counter.tsx";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage.tsx";
import TemperatureConverterPage from "./pages/temperatureConverter.tsx";
import CrudPage from "./pages/crudPage.tsx";
import TimerPage from "./pages/TimerPage.tsx";
import FlightBookerPage from "./pages/flightBookerPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="counter" element={<Counter />} />
      <Route
        path="temperatureConverter"
        element={<TemperatureConverterPage />}
      />
      <Route path="timerPage" element={<TimerPage />} />
      <Route path="flightBookerPage" element={<FlightBookerPage />} />
      <Route path="crudPage" element={<CrudPage />} />
    </Routes>
  );
}

export default App;
