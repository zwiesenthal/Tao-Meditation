// main react native boilerplate
import React,  { useEffect, useState } from 'react';
import SoundPlayer from 'react-native-sound-player';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import Timer from './Timer';
import { LogBox } from 'react-native';
import taoText from './tao_text';
import TextBox from './TextBox';

LogBox.ignoreLogs(['new NativeEventEmitter']);

const STATES = {
    PLAYING: "Pause",
    PAUSED: "Resume",
    NOT_STARTED: "Play"
}

const App = () => {
    const [text, setText] = useState(STATES.NOT_STARTED);
    const [startTime, setStartTime] = useState(5);
    const [timeLeft, setTimeLeft] = useState(startTime);
    const [bodyText, setBodyText] = useState(taoText[0]);
    const [isRandom, setIsRandom] = useState(true);
    const [currTaoNumber, setCurrTaoNumber] = useState(0); // read from local files
    const [intervalId, setIntervalId] = useState(null);

    var basicTime = timeLeft;

    const playTimer = () => {
        console.log("play timer");
        basicTime = timeLeft;
        // interval that counts down timeLeft, when timeLeft reaches 0, it stops the timer
        const intervalAI = setInterval(() => {
            if (basicTime > 0) {
                basicTime --;
                setTimeLeft(basicTime);
            } else {
                clearInterval(intervalAI);
                setTimeLeft(startTime);
                setText(STATES.NOT_STARTED);
                SoundPlayer.playSoundFile('hello', 'mp3'); // hello works but not bell, wack
            }
        }, 1000);
        // SoundPlayer.loadSoundFile('bell', 'mp3');

        setIntervalId(intervalAI);
    }

    const pauseTimer = () => {
        console.log("pause timer");
        clearInterval(intervalId);
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

    const readText = async () => {
        //var content = await RNFS.readFile(TAO_TEXT_FILE, 'utf8');
        console.log("read text");
    }

    useEffect(() => {
        if(isRandom) {
            let randomIndex = Math.floor(Math.random() * taoText.length);
            setBodyText(taoText[randomIndex]);
        }
        else {
            setBodyText(taoText[currTaoNumber]);
        }


        SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
            console.log('finished playing', success);
            //setText(STATES.NOT_STARTED);
            //setTimeLeft(startTime);
            //pauseTimer();
          });
    }, [startTime]);

    return (
        <>
            <TextBox text={bodyText} />

            <Pressable style={styles.playButton} onPress={playButton}>
                <Text style={styles.text}>{text}</Text>
            </Pressable>

            <Pressable style={styles.settingsButton} onPress={readText}>
                <Text style={styles.text}>{"Settings"}</Text>
            </Pressable>

            <Timer timeLeft={timeLeft} />

        </>
    )
}

const styles = StyleSheet.create({
    playButton: {
        backgroundColor: 'blue',
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
        borderRadius: 35
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      color: 'white',
      textAlign: 'center',
    },
});

export default App;
