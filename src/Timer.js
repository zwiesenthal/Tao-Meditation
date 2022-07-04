import React from "react";
import {Text, View, StyleSheet, Pressable} from "react-native";

const Timer = (props) => {

    const toMins = (time) => {
        if(time < 0) return 0;
        
        return Math.floor(time / 60);
    }

    const toSeconds = (time) => {
        if (time < 0) return "00";

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
        <View style={styles.container}>
            <Text style={styles.text}>{toMins(props.timeLeft) + ':' + toSeconds(props.timeLeft)}</Text>
        </ View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'cyan',
        position: 'absolute', // halfway down the screen
        left: '65%',
        top: '89%',
        justifyContent: 'center',
        minWidth: 90,
        height: 50,
        padding: 8,
        borderRadius: 10
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
    }
});

export default Timer;