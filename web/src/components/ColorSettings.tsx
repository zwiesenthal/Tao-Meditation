
import React, { useState, useEffect } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

interface ColorSettingsProps {
    onColorChange: (bgColor: string, textColor: string, hoverColor: string) => void;
}

const ColorSettings: React.FC<ColorSettingsProps> = ({ onColorChange }) => {
    const DEFAULT_BG = '#000000'; // Pure black
    const DEFAULT_TEXT = '#FFFFFF'; // Pure white

    // Helper to convert hex to RGB
    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return [r, g, b];
    };

    // Helper to calculate luminance
    const getLuminance = (hex: string) => {
        const [r, g, b] = hexToRgb(hex);
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };

    // Helper to calculate contrast ratio
    const getContrastRatio = (color1: string, color2: string) => {
        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    };

    const getInitialColors = () => {
        const savedBg = getLocalStorageItem('bgColor');
        const savedText = getLocalStorageItem('textColor');
        if (savedBg && savedText) {
            return { bg: savedBg, text: savedText };
        } else {
            return { bg: DEFAULT_BG, text: DEFAULT_TEXT };
        }
    };

    const [backgroundColor, setBackgroundColor] = useState(getInitialColors().bg);
    const [textColor, setTextColor] = useState(getInitialColors().text);

    const getHoverColor = (bgColor: string) => {
        const luminance = getLuminance(bgColor);
        if (luminance > 0.5) { // Light background, use subtle black overlay
            return `rgba(0, 0, 0, 0.05)`;
        } else { // Dark background, use subtle white overlay
            return `rgba(255, 255, 255, 0.05)`;
        }
    };

    useEffect(() => {
        const hoverColor = getHoverColor(backgroundColor);
        console.log("ColorSettings useEffect - Passing to App.tsx:", { backgroundColor, textColor, hoverColor });
        onColorChange(backgroundColor, textColor, hoverColor);
        setLocalStorageItem('bgColor', backgroundColor);
        setLocalStorageItem('textColor', textColor);
    }, [backgroundColor, textColor, onColorChange]);

    const generateRandomHexColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    };

    const setRandomColors = () => {
        let newBg = generateRandomHexColor();
        let newText = generateRandomHexColor();
        // Ensure sufficient contrast (WCAG AA standard is 4.5:1 for normal text)
        while (getContrastRatio(newBg, newText) < 4.5) {
            newText = generateRandomHexColor();
        }
        console.log("ColorSettings - Randomizing colors:", { newBg, newText });
        setBackgroundColor(newBg);
        setTextColor(newText);
    };

    const resetColors = () => {
        console.log("ColorSettings - Resetting colors to defaults:", { DEFAULT_BG, DEFAULT_TEXT });
        setBackgroundColor(DEFAULT_BG);
        setTextColor(DEFAULT_TEXT);
    };

    return (
        <div className="color-settings">
            <button onClick={setRandomColors}>Randomize Colors</button>
            <button onClick={resetColors}>Reset Colors</button>
        </div>
    );
};

export default ColorSettings;
