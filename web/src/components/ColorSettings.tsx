import React, { useState, useEffect } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

interface ColorSettingsProps {
    onColorChange: (bgColor: string, textColor: string, hoverColor: string) => void;
}

const DEFAULT_BG = '#000000'; // Pure black.
const DEFAULT_TEXT = '#FFFFFF'; // Pure white.

// WCAG AA contrast ratio for normal text.
const MIN_CONTRAST_RATIO = 4.5;

const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return [r, g, b];
};

const getLuminance = (hex: string): number => {
    const channels = hexToRgb(hex).map(value => {
        const v = value / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

const getContrastRatio = (color1: string, color2: string): number => {
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
};

// A subtle overlay that reads against the given background.
const getHoverColor = (bgColor: string): string =>
    getLuminance(bgColor) > 0.5 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

const generateRandomHexColor = (): string =>
    '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

const getInitialColors = () => {
    const savedBg = getLocalStorageItem('bgColor');
    const savedText = getLocalStorageItem('textColor');
    if (savedBg && savedText) {
        return { bg: savedBg, text: savedText };
    }
    return { bg: DEFAULT_BG, text: DEFAULT_TEXT };
};

const ColorSettings: React.FC<ColorSettingsProps> = ({ onColorChange }) => {
    const initialColors = getInitialColors();
    const [backgroundColor, setBackgroundColor] = useState(initialColors.bg);
    const [textColor, setTextColor] = useState(initialColors.text);

    useEffect(() => {
        onColorChange(backgroundColor, textColor, getHoverColor(backgroundColor));
        setLocalStorageItem('bgColor', backgroundColor);
        setLocalStorageItem('textColor', textColor);
    }, [backgroundColor, textColor, onColorChange]);

    const setRandomColors = () => {
        const newBg = generateRandomHexColor();
        let newText = generateRandomHexColor();
        while (getContrastRatio(newBg, newText) < MIN_CONTRAST_RATIO) {
            newText = generateRandomHexColor();
        }
        setBackgroundColor(newBg);
        setTextColor(newText);
    };

    const resetColors = () => {
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
