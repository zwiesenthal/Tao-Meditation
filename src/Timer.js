import React from "react";
import {Text, View, StyleSheet, Pressable} from "react-native";

const Timer = (props) => {
    
    const toMins = (time) => {
        return Math.floor(time / 60);
    }

    const toSeconds = (time) => {
        let seconds = time % 60;
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (seconds == 0) {
            seconds = "00";
        }
        return seconds;
    }

    return (
        <View>
            <Text>{toMins(props.timeLeft) + ':' + toSeconds(props.timeLeft)}</Text>
        </ View>
    )
}

export default Timer;