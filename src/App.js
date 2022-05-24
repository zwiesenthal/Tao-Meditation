import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import React,  { useEffect, useState } from 'react';
import {Text, View, StyleSheet, Pressable, LogBox} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Sound from 'react-native-sound';
import Timer from './Timer';
import taoText from './tao_text';
import TextBox from './TextBox';

LogBox.ignoreLogs(['new NativeEventEmitter']);

const FileNames = {
    "Silent-10": "10MinMedBellLouder.mp3",
}

const STATES = {
    PLAYING: "Pause",
    PAUSED: "Resume",
    NOT_STARTED: "Play"
}

const App = () => {
    const [text, setText] = useState(STATES.NOT_STARTED);
    const [startTime, setStartTime] = useState(600);
    const [timeLeft, setTimeLeft] = useState(startTime);
    const [bodyText, setBodyText] = useState(taoText[0]);
    const [isRandom, setIsRandom] = useState(true);
    const [currTaoNumber, setCurrTaoNumber] = useState(0); // read from local files
    const [intervalId, setIntervalId] = useState(null);
    const [changeText, setChangeText] = useState(0);

    var basicTime = timeLeft;
    useKeepAwake();

    const playTimer = () => {
        console.log("play timer");
        basicTime = timeLeft;
        // interval that counts down timeLeft, when timeLeft reaches 0, it stops the timer
        const intervalID = BackgroundTimer.setInterval(() => {
            if (basicTime > 0) {
                basicTime --;
                setTimeLeft(basicTime);
            } else {
                BackgroundTimer.clearInterval(intervalID);
                setTimeLeft(startTime);
                setText(STATES.NOT_STARTED);
                playEndSound();
                //SoundPlayer.playSoundFile('bell', 'mp3'); // hello works but not bell, wack
            }
        }, 1000);
        //SoundPlayer.loadSoundFile('bell', 'mp3');

        setIntervalId(intervalID);
    }

    const pauseTimer = () => {
        console.log("pause timer");
        BackgroundTimer.clearInterval(intervalId);
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

        // add event listener for when sound is finished
    }

    const settingsButton = () => {
        //var content = await RNFS.readFile(TAO_TEXT_FILE, 'utf8');
        console.log("settings button pressed");
        //splayEndSound();
    }

    const swapText = () => {
        setChangeText(prevText => prevText + 1);
    }

    const playEndSound = () => {
        Sound.setCategory('Playback');
        // raise volume
        var sound = new Sound('medbell_louder.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else { // loaded successfully
                sound.setVolume(2);
                sound.play(() => {
                    console.log('successfully finished playing');
                });
            }
        });
    }

    useEffect(() => {
        if(isRandom) {
            let randomIndex = Math.floor(Math.random() * taoText.length);
            setBodyText(taoText[randomIndex]);
        }
        else {
            setBodyText(taoText[currTaoNumber]);
        }


        //SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
        //    console.log('finished playing', success);
        //  });

    }, [startTime, changeText]);

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
