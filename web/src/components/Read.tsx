

import React, { useState, useEffect, useRef } from 'react';
import taoText from '../text/tao_text';

const Read: React.FC<{ colorSettingsComponent: React.ReactNode }> = ({ colorSettingsComponent }) => {
    const [pageNumber, setPageNumber] = useState(() => {
        const savedPage = localStorage.getItem('taoPage');
        return savedPage ? parseInt(savedPage, 10) : 0;
    });
    const [jumpToPage, setJumpToPage] = useState('');

    useEffect(() => {
        localStorage.setItem('taoPage', pageNumber.toString());
    }, [pageNumber]);

    const nextPage = () => {
        if (pageNumber < taoText.length - 1) {
            setPageNumber(pageNumber + 1);
        }
    };

    const prevPage = () => {
        if (pageNumber > 0) {
            setPageNumber(pageNumber - 1);
        }
    };

    const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const page = parseInt(jumpToPage, 10);
            if (!isNaN(page) && page >= 1 && page <= taoText.length) {
                setPageNumber(page - 1);
                setJumpToPage('');
            }
        }
    };

    const syncMeditationPage = () => {
        localStorage.setItem('meditationSyncPage', pageNumber.toString());
    };

    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const readAloud = () => {
        if ('speechSynthesis' in window) {
            const textToSpeak = taoText[pageNumber];
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'en-US';
            utterance.rate = 0.9; // Slightly slower for better comprehension

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            speechSynthesis.cancel(); // Stop any ongoing speech
            speechSynthesis.speak(utterance);
            utteranceRef.current = utterance;
        } else {
            alert("Text-to-speech not supported in this browser.");
        }
    };

    const stopReading = () => {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    useEffect(() => {
        // Stop reading if page changes or component unmounts
        return () => {
            stopReading();
        };
    }, [pageNumber]); // Dependency on pageNumber to stop on page change

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                nextPage();
            } else if (e.key === 'ArrowLeft') {
                prevPage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [pageNumber]);


    return (
        <div className="read-container">
            <button className="nav-arrow left-arrow" onClick={prevPage} disabled={pageNumber === 0}>&#8249;</button>
            <p>{taoText[pageNumber]}</p>
            <button className="nav-arrow right-arrow" onClick={nextPage} disabled={pageNumber === taoText.length - 1}>&#8250;</button>
            <div className="read-controls">
                <span>
                    Page {pageNumber + 1} of {taoText.length}
                </span>
                <input
                    type="number"
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    onKeyDown={handleJumpToPage}
                    placeholder="Jump to page"
                />
                <button onClick={isSpeaking ? stopReading : readAloud}>
                    {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                </button>
                {colorSettingsComponent}
            </div>
        </div>
    );
};

export default Read;

