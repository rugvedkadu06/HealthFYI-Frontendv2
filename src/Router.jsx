import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';
import HealthDashboard from "./App";
import SidebarMedicationsOnly from "./components/pages/medications";
import Hospitals from "./components/pages/hospitals";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HealthDashboard />} />
        <Route path="/dashboard" element={<HealthDashboard />} />
        <Route path="/medications" element={<SidebarMedicationsOnly />} />
        <Route path="/hospitals" element={<Hospitals />} />

      </Routes>
    </Router>
  );
}
