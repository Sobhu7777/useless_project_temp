import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import DetectingScreen from "./components/DetectingScreen";
import Result from "./components/Result";
import SnackHoroscope from "./components/SnackHoroscope";
import SnackReincarnation from "./components/SnackReincarnation";
import SnackDeath from "./components/SnackDeath";
import ThattukadaLoader from "./components/Preloader.jsx";
import Intro from "./components/intro.jsx";

function App() {
  return (
    <>
      <ThattukadaLoader />
      <Router>
        <Routes>
          <Route path="/" element={<Intro/>}/>
          <Route path="/home" element={<Home />} />
          <Route path="/detecting" element={<DetectingScreen />} />
          <Route path="/result" element={<Result />} />
          <Route path="/snack-horoscope" element={<SnackHoroscope />} />
          <Route path="/snack-reincarnation" element={<SnackReincarnation />} />
          <Route path="/snack-death" element={<SnackDeath />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
