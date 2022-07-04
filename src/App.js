import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import React,  { useEffect, useState } from 'react';
import {Text, View, StyleSheet, Pressable, LogBox} from 'react-native';
import Sound from 'react-native-sound';
import Timer from './Timer';
import taoText from './tao_text';
import TextBox from './TextBox';
import {getSettings, setSettings } from './Util';
import SettingsBox from './SettingsBox';

LogBox.ignoreLogs(['new NativeEventEmitter']);

const FileNames = {
    silent: {
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

const STATES = {
    PLAYING: "Pause",
    PAUSED: "Resume",
    NOT_STARTED: "Play"
}

const DEFAULT_SETTINGS = {
    "Duration": 600,
    "Random": false,
    "PageNumber": 0,
    "Guided": false,
    "FontSize": 24,
}

var sound = null;
var settings;
var interval;

const SILENT = "silent";
const GUIDED = "guided";

// i feel like i should have an object for the settings

const App = () => {
    const [text, setText] = useState(STATES.NOT_STARTED);
    const [startTime, setStartTime] = useState(10*60);
    const [timeLeft, setTimeLeft] = useState(startTime);
    const [pageNumber, setPageNumber] = useState(0);
    const [bodyText, setBodyText] = useState(taoText[pageNumber]);
    const [isRandom, setIsRandom] = useState(true);
    const [audioStyle, setAudioStyle] = useState(SILENT); // SILENT or GUIDED
    const [fileName, setFileName] = useState("silent_10.mp3");
    const [isSettingsHidden, setIsSettingsHidden] = useState(true);
    useKeepAwake();

    const playTimer = () => {
        if (sound !== null) {
            sound.play(resetTimer);
        } else {
            playEndSound();
        }
    }

    const pauseTimer = () => {
        if(!sound) {
            return;
        }

        console.log("pause timer");
        sound && sound.pause();
    }

    const playButton = () => {
        switch (text) {
            case STATES.NOT_STARTED:
                setText(STATES.PLAYING);
                playTimer();
                break;
            case STATES.PLAYING:
                setText(STATES.PAUSED);
                pauseTimer();
                break;
            case STATES.PAUSED:
                setText(STATES.PLAYING);
                playTimer();
                break;
        }
    }

    const settingsButtonPressed = () => {
        setIsSettingsHidden((prevHidden) => !prevHidden);
        console.log("settings button pressed");
    }

    const incrementPageNumber = () => {
        settings.PageNumber = settings.PageNumber + 1;
        setSettings(settings);
        // setPageNumber(settings.PageNumber);
        console.log("increment page number, new settings", {settings});
    }

    const toggleRandom = () => {
        settings.Random = !settings.Random;
        setSettings(settings);
        setIsRandom((prevRandom) => !prevRandom);
        console.log("toggle random: ", {isRandom});
    }

    const playEndSound = () => {
        Sound.setCategory('Playback');
        console.log("play sound:", {fileName});
        sound = new Sound(fileName, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else {
                sound.play(resetTimer);
                
                var duration = Math.floor(sound.getDuration());

                interval = setInterval(() => {
                    sound.getCurrentTime((seconds) => {
                        console.log({seconds, duration});
                        if (seconds >= duration) {
                            if(!isRandom) 
                            {
                                incrementPageNumber();
                            }
                            sound.stop();
                            sound.release();
                            sound = null;
                            clearInterval(interval);
                        }
                        setTimeLeft(Math.round(duration - seconds));
                    });
                }, 1000);
            }
        });
    }

    const resetTimer = () => {
        setText(STATES.NOT_STARTED);
    }

    const setAudioFileFromTime = (mins) => {
        // settingsButtonPressed(); // hide settings
        var fileName = FileNames[audioStyle][(mins).toString()];
        console.log("set audio file from time", {fileName, mins, audioStyle})
        if (fileName) {
            setFileName(fileName);
        }
        else {
            console.warn("Tried to set file name to invalid value", {fileName, mins, audioStyle});
        }
        setTimeLeft(mins*60);
    }

    useEffect(() => {
        const getSettingsAsync = async () => {
            var settingsFetched = await getSettings();
            console.log("use effect", {settingsFetched});
            if (settingsFetched) {
                settings = settingsFetched;
            } else {
                console.log("Using default settings");
                settings = DEFAULT_SETTINGS;
            }
            if(timeLeft == startTime)
            {
                setTimeLeft(settings.Duration);
            }
            setStartTime(settings.Duration);
            setPageNumber(settings.PageNumber);
            setIsRandom(settings.Random);
        }

        getSettingsAsync();

        if(isRandom) {
            let randomIndex = Math.floor(Math.random() * taoText.length);
            setBodyText(taoText[randomIndex]);
        }
        else {
            setBodyText(taoText[pageNumber]);
        }

    }, [startTime, isRandom]);



    return (
        <>
            <TextBox text={bodyText} />

            <Pressable style={styles.playButton} onPress={playButton}>
                <Text style={styles.buttonText}>{text}</Text>
            </Pressable>

            <Pressable style={styles.settingsButton} onPress={settingsButtonPressed}>
                <Text style={styles.buttonText}>{"Settings"}</Text>
            </Pressable>

            <Timer timeLeft={timeLeft} />

            {   isSettingsHidden ? null 
                : <SettingsBox
                    toggleRandom={toggleRandom} 
                    setAudioFileFromTime={setAudioFileFromTime}
                />
            }
        </>
    )
}

const styles = StyleSheet.create({
    playButton: {
        backgroundColor: '#0252a3',
        position: 'absolute', // halfway down the screen
        left: '50%',
        top: '93%',
        transform: [{translateX: -50}, {translateY: -50}],
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 40
    },
    settingsButton: {
        backgroundColor: 'green',
        position: 'absolute', // halfway down the screen
        left: '90%',
        top: '10%',
        transform: [{translateX: -50}, {translateY: -50}],
        justifyContent: 'center',
        width: 70,
        height: 70,
        borderRadius: 30,
    },
    text: {
        fontSize: 20,
        lineHeight: 23,
        color: "#000",
        textAlign: "center",
        padding: 1,
        margin: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1
    },
    buttonText: {
        fontSize: 16,
        lineHeight: 23,
        color: "#000",
        textAlign: "center",
        padding: 1,
        margin: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1
    }
});

export default App;
