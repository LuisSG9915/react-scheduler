// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SchedulerScreen from "./lib/screens/SchedulerScreen";
import ClientesScreen from "./lib/screens/ClientesScreen";
import CreateCitaScreen from "./lib/screens/CreateCitaScreen";
import CitaScreen from "./lib/screens/CitaScreen";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SchedulerScreen />} />
        <Route path="/Cliente" element={<ClientesScreen />} />
        <Route path="/CreateCitaScreen" element={<CreateCitaScreen />} />
        <Route path="/CitaScreen" element={<CitaScreen />} />
      </Routes>
    </Router>
  );
};

export default App;
