

import React, { useState, useEffect, useRef } from 'react';
import taoText from '../text/tao_text';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorage';

const STATES = {
    PLAYING: "Pause",
    PAUSED: "Resume",
    NOT_STARTED: "Play",
    FINISHED: "Done",
}

const FileNames: { [key: string]: { [key: string]: string } } = {
    silent: {
        "1": "silent_1.mp3",
        "3": "silent_3.mp3",
        "5": "silent_5.mp3",
        "10": "silent_10.mp3",
        "20": "silent_20.mp3",
    },
    guided: {
        "10": "todo-guided-10.mp3",
        "20": "todo-guided-20.mp3",
    }
}

const Meditate: React.FC<{ colorSettingsComponent: React.ReactNode }> = ({ colorSettingsComponent }) => {
    const [text, setText] = useState(STATES.NOT_STARTED);
    const [startTime, setStartTime] = useState(() => {
        const savedStartTime = getLocalStorageItem('meditationStartTime');
        return savedStartTime ? parseInt(savedStartTime, 10) : 10 * 60;
    });
    const [timeLeft, setTimeLeft] = useState(startTime);
    const [pageNumber, setPageNumber] = useState(() => {
        const syncedPage = getLocalStorageItem('meditationPage');
        return syncedPage ? parseInt(syncedPage, 10) : 0;
    });
    const [isRandom, setIsRandom] = useState(() => {
        const savedIsRandom = getLocalStorageItem('meditationIsRandom');
        const syncedPage = getLocalStorageItem('meditationPage');
        // If a synced page exists, default to sequential, otherwise use saved preference or true
        return syncedPage ? false : (savedIsRandom === 'true' ? true : false);
    });
    const [bodyText, setBodyText] = useState(taoText[pageNumber]);
    const [audioStyle, setAudioStyle] = useState("silent"); // SILENT or GUIDED
    const [fileName, setFileName] = useState(() => {
        const initialMins = startTime / 60;
        return FileNames["silent"][initialMins.toString()] || "silent_10.mp3";
    });
    const [isSettingsHidden, setIsSettingsHidden] = useState(true);

    const audioRef = useRef<HTMLAudioElement>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const readAloud = () => {
        if ('speechSynthesis' in window) {
            const textToSpeak = bodyText;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'en-US';
            utterance.rate = 1; // Slightly slower for better comprehension

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
        // Stop reading if bodyText changes or component unmounts
        return () => {
            stopReading();
        };
    }, [bodyText]); // Dependency on bodyText to stop on text change

    useEffect(() => {
        if (isRandom) {
            let randomIndex = Math.floor(Math.random() * taoText.length);
            setBodyText(taoText[randomIndex]);
        } else {
            setBodyText(taoText[pageNumber]);
        }
    }, [isRandom, pageNumber]);

    // Save isRandom to local storage whenever it changes
    useEffect(() => {
        setLocalStorageItem('meditationIsRandom', isRandom.toString());
    }, [isRandom]);

    // Save startTime to local storage whenever it changes
    useEffect(() => {
        setLocalStorageItem('meditationStartTime', startTime.toString());
    }, [startTime]);

    // This effect now also handles setting the audio source
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Set initial source
        audio.src = `${process.env.PUBLIC_URL}/assets/${fileName}`;

        const updateTimer = () => {
            // Only update time if it's a valid number
            if (!isNaN(audio.duration) && isFinite(audio.currentTime)) {
                 setTimeLeft(Math.round(audio.duration - audio.currentTime));
            }
        };

        const onEnded = () => {
            setText(STATES.FINISHED);
        };

        audio.addEventListener('timeupdate', updateTimer);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTimer);
            audio.removeEventListener('ended', onEnded);
        };
    }, [fileName]); // Rerun when fileName changes

    const playButton = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (text === STATES.PLAYING) {
            audio.pause();
            setText(STATES.PAUSED);
        } else if (text === STATES.PAUSED) {
            audio.play().then(() => {
                setText(STATES.PLAYING);
            }).catch(e => console.error("Playback failed", e));
        } else if (text === STATES.NOT_STARTED) {
            // The src is now set by the useEffect, so we can just play
            audio.play().then(() => {
                setText(STATES.PLAYING);
            }).catch(e => console.error("Playback failed", e));
        } else if (text === STATES.FINISHED) {
            setText(STATES.NOT_STARTED);
            setTimeLeft(startTime);
            if (!isRandom) {
                localStorage.setItem('meditationPage', (pageNumber+1).toLocaleString());
                setPageNumber(prev => prev + 1);
            } else {
                // Get a new random text
                let randomIndex = Math.floor(Math.random() * taoText.length);
                setBodyText(taoText[randomIndex]);
            }
        }
    };

    const setAudioFileFromTime = (mins: number) => {
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        setText(STATES.NOT_STARTED);
        const newFileName = FileNames[audioStyle][mins.toString()];
        if (newFileName) {
            setFileName(newFileName); // This will trigger the useEffect to change src
        }
        setTimeLeft(mins * 60);
        setStartTime(mins * 60);
    };

    const toMins = (time: number) => {
        if (time < 0 || isNaN(time)) return 0;
        return Math.floor(time / 60);
    }

    const toSeconds = (time: number) => {
        if (time < 0 || isNaN(time)) return "00";
        let seconds = Math.round(time % 60);
        if (seconds === 60) { // Handle edge case of rounding
            return "00";
        }
        if (seconds < 10) {
            return "0" + seconds;
        }
        return seconds.toString();
    }

    // When the component first loads, or when settings change the start time,
    // we need to make sure the timeLeft is accurate, especially before playing.
    useEffect(() => {
        if (text === STATES.NOT_STARTED) {
            setTimeLeft(startTime);
        }
    }, [startTime, text]);


    return (
        <div>
            <p>{bodyText}</p>
            <div>
                <button onClick={playButton}>{text}</button>
                {/* Timer display */}
                <span style={{fontSize: '1.5em', margin: '0 20px'}}>{toMins(timeLeft)}:{toSeconds(timeLeft)}</span>
            </div>
            <button onClick={() => setIsSettingsHidden(!isSettingsHidden)}>
                {isSettingsHidden ? 'Settings' : 'Hide Settings'}
            </button>
            <button onClick={isSpeaking ? stopReading : readAloud}>
                {isSpeaking ? 'Stop Reading' : 'Read Aloud'}
            </button>
            {!isSettingsHidden && (
                <div style={{marginTop: '20px'}}>
                    <div>
                        {[1, 3, 5, 10, 20].map(duration => (
                            <button key={duration} onClick={() => setAudioFileFromTime(duration)}>
                                {duration} minute{duration > 1 ? 's' : ''}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => {
                        const newRandomState = !isRandom;
                        setIsRandom(newRandomState);
                        if (!newRandomState) { // If switching to sequential
                            const syncedPage = getLocalStorageItem('meditationPage');
                            const newPageNumber = syncedPage ? parseInt(syncedPage, 10) : 0;
                            setPageNumber(newPageNumber);
                        }
                    }}>
                        {isRandom ? "Random" : "Sequential"}
                    </button>
                    <button onClick={() => {
                        const syncedPage = getLocalStorageItem('readPage');
                        if (syncedPage) {
                            const newPageNumber = parseInt(syncedPage, 10);
                            setPageNumber(newPageNumber);
                            setIsRandom(false); // Automatically switch to sequential mode
                        } else {
                            // Optionally, log to console or update UI without alert
                            console.log("No page synced from Read mode.");
                        }
                    }}>
                        Sync from Read Page
                    </button>
                    {colorSettingsComponent}
                </div>
            )}
            <audio ref={audioRef} />
        </div>
    );
};

export default Meditate;

