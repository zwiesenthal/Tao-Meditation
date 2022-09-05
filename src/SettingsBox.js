import React, { useState } from "react";
import {Text, StyleSheet, TouchableHighlight, SafeAreaView} from "react-native";
import { colors } from './Colors';
// button for set font size - from 12 to 36

const durations = [1, 3, 5, 10, 20];

// don't do button, do pressable maybe or something, blue looks bad
const SettingsBox = (props) => {

    const convertStartTime = (startTime) => {
        const mins = Math.round(startTime / 60);
        var closestDurationIdx = 0;
        var closestDuration = durations[0];
        for (var i = 0; i < durations.length; i++) {
            if (Math.abs(durations[i] - mins) < Math.abs(closestDuration - mins)) {
                closestDurationIdx = i;
                closestDuration = durations[i];
            }
        }
        return closestDurationIdx;
    }

    const [activeDuration, setActiveDuration] = useState(durations[convertStartTime(props.startTime)]);

    const clickedTime = (duration) => {
        setActiveDuration(duration);
        props.setAudioFileFromTime(duration);
    }
    
    // get props methods
    return (
        <SafeAreaView style={styles.settingsBox}>
            <SafeAreaView style={styles.settingsLower}>
                {durations.map(duration => (
                    <TouchableHighlight
                        style={[styles.button, (activeDuration===duration)?styles.active:null]}
                        key={duration}
                        onPress={() => clickedTime(duration)}
                    >
                        <Text style={styles.text}>
                            {duration + " minute" + (duration === 1 ? "" : "s")}
                        </Text>
                    </TouchableHighlight>
                ))}

                <TouchableHighlight
                    style={[styles.button, styles.right, props.isRandom ? styles.random : null]}
                    onPress={props.toggleRandom}
                >
                    <Text style={styles.text}>
                        {props.isRandom ? "Random" : "Sequential"}
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={[styles.button, styles.right, styles.clearTimerButton]}
                    onPress={props.clearTimer}
                >
                    <Text style={styles.text}>
                        Reset
                    </Text>
                </TouchableHighlight>
            </SafeAreaView>            
        </SafeAreaView>            
    )
}

const styles = StyleSheet.create({
    settingsBox: {
        backgroundColor: colors.BACKGROUND_COLOR,
        opacity: 1,
        position: 'absolute',
        left: '5%',
        top: '15%',
        width: '90%',
        height: '84%',
        borderRadius: 10
    },
    settingsLower: {
        top: '15%',
    },
    text: {
        fontSize: 20,
        lineHeight: 18,
        color: colors.BLACK,
        textAlign: "center",
        padding: 1,
        margin: 2,
        elevation: 1,
        marginTop: 10,
        marginBottom: 10
    },
    button: {
        opacity: 0.55,
        backgroundColor: colors.BROWN,
        width: '35%',
        left: '5%',
        borderRadius: 10,
        marginTop: 15
    },
    clearTimerButton: {
        top: '20%'
    },
    active: {
        opacity: 1
    },
    right: {
        position: 'absolute',
        width: '35%',
        marginTop: 15,
        left: '60%',
        backgroundColor: colors.CREAM_GREEN,
        opacity: 1
    },
    random: {
        backgroundColor: colors.MAGENTA
    }
});

export default SettingsBox;