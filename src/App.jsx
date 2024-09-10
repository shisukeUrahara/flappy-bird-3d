import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Game from './components/Game';
import HighScores from './components/HighScores';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/highscores" element={<HighScores />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;