import React, { startTransition, useState } from "react";
import {Text, View, StyleSheet, Button, TouchableHighlight} from "react-native";

// button for set time - from 1 to 30 minutes
// button for set font size - from 12 to 36
// button for set random or not

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
        <View style={styles.settingsBox}>
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
                style={[styles.button, styles.right]}
                onPress={props.toggleRandom}
            >
                <Text style={styles.text}>
                    {props.isRandom ? "Random" : "Sequential"}
                </Text>
            </TouchableHighlight>
        </View>            
    )
}

const styles = StyleSheet.create({
    settingsBox: {
        backgroundColor: 'gray',
        position: 'absolute', // halfway down the screen
        left: '5%',
        top: '15%',
        width: '90%',
        height: '82%',
        borderRadius: 10
    },
    text: {
        fontSize: 18,
        lineHeight: 18,
        color: "white",
        textAlign: "center",
        padding: 1,
        margin: 2,
        elevation: 1,
        marginTop: 10,
        marginBottom: 10
    },
    button: {
        opacity: 0.55,
        backgroundColor: '#050505',
        width: '35%',
        left: '5%',
        borderRadius: 10,
        marginTop: 10
    },
    active: {
        opacity: 1
    },
    right: {
        position: 'absolute', 
        marginTop: 10,
        left: '60%',
        backgroundColor: '#2b72e3',
        opacity: 1
    }
});

export default SettingsBox;