import { useState } from "react";
import "./App.css";
import Counter from "./pages/counter.tsx";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage.tsx";
import TemperatureConverter from "./pages/temperatureConverter.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="counter" element={<Counter />} />
      <Route path="temperatureConverter" element={<TemperatureConverter />} />
    </Routes>
  );
}

export default App;
