import "./App.css";
import { CounterPage } from "./pages/CounterPage.tsx";
import { Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/Homepage.tsx";
import { TemperatureConverterPage } from "./pages/TemperatureConverterPage.tsx";
import { CrudPage } from "./pages/CrudPage.tsx";
import { TimerPage } from "./pages/TimerPage.tsx";
import { FlightBookerPage } from "./pages/FlightBookerPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="counter" element={<CounterPage />} />
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
