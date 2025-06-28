
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Meditate from './components/Meditate';
import Read from './components/Read';
import ColorSettings from './components/ColorSettings';
import { getLocalStorageItem } from './utils/localStorage';
import './App.css';

const App: React.FC = () => {
  const DEFAULT_BG = '#121212';
  const DEFAULT_TEXT = '#e0e0e0';

  const [backgroundColor, setBackgroundColor] = useState(() => {
    return getLocalStorageItem('bgColor') || DEFAULT_BG;
  });
  const [textColor, setTextColor] = useState(() => {
    return getLocalStorageItem('textColor') || DEFAULT_TEXT;
  });
  const [hoverColor, setHoverColor] = useState('rgba(255, 255, 255, 0.05)'); // Default hover color

  const handleColorChange = useCallback((bgColor: string, txtColor: string, hvrColor: string) => {
    console.log("App.tsx handleColorChange - Received colors:", { bgColor, txtColor, hvrColor });
    setBackgroundColor(bgColor);
    setTextColor(txtColor);
    setHoverColor(hvrColor);
  }, []);

  useEffect(() => {
    console.log("App.tsx useEffect - Setting CSS variables:", { backgroundColor, textColor, hoverColor });
    document.documentElement.style.setProperty('--bg-color', backgroundColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--text-border-color', textColor);
    document.documentElement.style.setProperty('--hover-overlay-color', hoverColor);
  }, [backgroundColor, textColor, hoverColor]);

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Meditate</NavLink>
          </li>
          <li>
            <NavLink to="/read">Read</NavLink>
          </li>
        </ul>
      </nav>
      <div className="component-container">
        <Routes>
          <Route path="/read" element={<Read colorSettingsComponent={<ColorSettings onColorChange={handleColorChange} />} />} />
          <Route path="/" element={<Meditate colorSettingsComponent={<ColorSettings onColorChange={handleColorChange} />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
