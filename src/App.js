import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import React,  { useEffect, useState } from 'react';
import {Text, View, StyleSheet, Pressable, LogBox} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Sound from 'react-native-sound';
import Timer from './Timer';
import taoText from './tao_text';
import TextBox from './TextBox';
import {getSettings, setSettings } from './Util';

LogBox.ignoreLogs(['new NativeEventEmitter']);

const FileNames = {
    "silent-10": "silent_10.mp3",
    "louder": "medbell_louder.mp3",
}

const STATES = {
    PLAYING: "Pause",
    PAUSED: "Resume",
    NOT_STARTED: "Play"
}

const DEFAULT_SETTINGS = {
    "Duration": 600,
    "Random": true,
    "PageNumber": 0,
    "Guided": false,
    "FontSize": 24,
}

var sound = null;

const App = () => {
    var settings;
    const [text, setText] = useState(STATES.NOT_STARTED);
    const [startTime, setStartTime] = useState(600);
    const [timeLeft, setTimeLeft] = useState(startTime);
    const [currTaoNumber, setCurrTaoNumber] = useState(0); // read from local files
    const [bodyText, setBodyText] = useState(taoText[currTaoNumber]);
    const [isRandom, setIsRandom] = useState(true);
    const [intervalId, setIntervalId] = useState(null);
    const [changeText, setChangeText] = useState(0);
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

    const settingsButton = () => {
        console.log("settings button pressed");
    }

    // async in place, next need to use sequential and save the page number
    const swapText = async () => {
        DEFAULT_SETTINGS.Duration = DEFAULT_SETTINGS.Duration + 1;
        await setSettings(DEFAULT_SETTINGS);
        var fetchedSettings = await getSettings();
        console.log({fetchedSettings, settings});
        setStartTime(fetchedSettings.Duration);
        setChangeText(prevText => prevText + 1);
    }

    const playEndSound = () => {
        Sound.setCategory('Playback');
        sound = new Sound(FileNames['silent-10'], Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else {
                sound.play(resetTimer);
                
                var interval = setInterval(() => {
                    var duration = sound.getDuration();
                    
                    sound.getCurrentTime((seconds) => {
                        if (seconds >= duration) {
                            sound.stop();
                            sound.release();
                            sound = null;
                            clearInterval(interval);
                            console.log("sound at end");
                        }
                        setTimeLeft(Math.round(duration - seconds));
                    }, 1000);
                });

            }
        });
    }

    const resetTimer = () => {
        setText(STATES.NOT_STARTED);
    }

    useEffect(() => {

        const getSettingsAsync = async () => {
            var settingsFetched = await getSettings();
            console.log("use effect", {settingsFetched});
            if (settingsFetched) {
                settings = settingsFetched;
            } else {
                settings = DEFAULT_SETTINGS;
            }
            if(timeLeft == startTime)
            {
                setTimeLeft(settings.Duration);
            }
            setStartTime(settings.Duration);
            setCurrTaoNumber(settings.PageNumber);
            setIsRandom(settings.Random);
        }

        getSettingsAsync();

        if(isRandom) {
            let randomIndex = Math.floor(Math.random() * taoText.length);
            setBodyText(taoText[randomIndex]);
        }
        else {
            setBodyText(taoText[currTaoNumber]);
        }

    }, [startTime, changeText, isRandom]);

    /* add later
    <Pressable style={styles.settingsButton} onPress={settingsButton}>
        <Text style={styles.buttonText}>{"Settings"}</Text>
    </Pressable>*/


    return (
        <>
            <TextBox text={bodyText} />

            <Pressable style={styles.playButton} onPress={playButton}>
                <Text style={styles.buttonText}>{text}</Text>
            </Pressable>

            <Pressable style={styles.settingsButton} onPress={swapText}>
                <Text style={styles.buttonText}>{"Swap"}</Text>
            </Pressable>

            <Timer timeLeft={timeLeft} />

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
        width: 60,
        height: 60,
        borderRadius: 30
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
