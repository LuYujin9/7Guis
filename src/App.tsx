import "./App.css";
import { CounterPage } from "./pages/counterPage.tsx";
import { Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/homepage.tsx";
import { TemperatureConverterPage } from "./pages/temperatureConverterPage.tsx";
import { CrudPage } from "./pages/crudPage.tsx";
import { TimerPage } from "./pages/TimerPage.tsx";
import { FlightBookerPage } from "./pages/flightBookerPage.tsx";

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
