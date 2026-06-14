import React, { useState, useEffect, useRef, useCallback } from 'react';
import taoText from '../text/tao_text';

const MOBILE_QUERY = '(max-width: 768px)';
const MOBILE_ARROW_FADE_MS = 500;

const Read: React.FC<{ colorSettingsComponent: React.ReactNode }> = ({ colorSettingsComponent }) => {
    const [pageNumber, setPageNumber] = useState(() => {
        const savedPage = localStorage.getItem('readPage');
        return savedPage ? parseInt(savedPage, 10) : 0;
    });
    const [jumpToPage, setJumpToPage] = useState('');
    const [showNavArrows, setShowNavArrows] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const fadeOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isMobile = () => window.matchMedia(MOBILE_QUERY).matches;

    // Functional updates keep these stable so handlers/effects never read a stale page.
    const nextPage = useCallback(() => {
        setPageNumber(prev => (prev < taoText.length - 1 ? prev + 1 : prev));
    }, []);

    const prevPage = useCallback(() => {
        setPageNumber(prev => (prev > 0 ? prev - 1 : prev));
    }, []);

    // Persist the current page and (on mobile) fade the arrows out after a moment.
    useEffect(() => {
        localStorage.setItem('readPage', pageNumber.toString());

        setShowNavArrows(true);
        if (fadeOutTimerRef.current) {
            clearTimeout(fadeOutTimerRef.current);
        }
        if (isMobile()) {
            fadeOutTimerRef.current = setTimeout(() => setShowNavArrows(false), MOBILE_ARROW_FADE_MS);
        }

        return () => {
            if (fadeOutTimerRef.current) {
                clearTimeout(fadeOutTimerRef.current);
            }
        };
    }, [pageNumber]);

    const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        const page = parseInt(jumpToPage, 10);
        if (!isNaN(page) && page >= 1 && page <= taoText.length) {
            setPageNumber(page - 1);
            setJumpToPage('');
        }
    };

    const readAloud = () => {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech is not supported in this browser.');
            return;
        }

        const utterance = new SpeechSynthesisUtterance(taoText[pageNumber]);
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // Slightly slower for better comprehension.
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        speechSynthesis.cancel(); // Stop any ongoing speech.
        speechSynthesis.speak(utterance);
    };

    const stopReading = useCallback(() => {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    // Stop any narration when the page changes or the component unmounts.
    useEffect(() => stopReading, [pageNumber, stopReading]);

    // Arrow keys flip pages.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                nextPage();
            } else if (e.key === 'ArrowLeft') {
                prevPage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextPage, prevPage]);

    const arrowClass = (side: 'left' | 'right') =>
        `nav-arrow ${side}-arrow${showNavArrows ? '' : ' fade-out'}`;

    return (
        <div className="read-container read-page-container">
            <div className="read-main-content">
                <button className={arrowClass('left')} onClick={prevPage} disabled={pageNumber === 0}>
                    &#8249;
                </button>
                <div className="read-content">
                    <p>{taoText[pageNumber]}</p>
                </div>
                <button
                    className={arrowClass('right')}
                    onClick={nextPage}
                    disabled={pageNumber === taoText.length - 1}
                >
                    &#8250;
                </button>
            </div>
            <div className="read-controls">
                <span>
                    Page {pageNumber + 1} of {taoText.length}
                </span>
                <input
                    type="number"
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    onKeyDown={handleJumpToPage}
                    placeholder="Page"
                    style={{ width: 68 }}
                />
                <button onClick={isSpeaking ? stopReading : readAloud}>
                    {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
                </button>
            </div>
            {colorSettingsComponent}
        </div>
    );
};

export default Read;
