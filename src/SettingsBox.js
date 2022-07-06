import React from "react";
import {Text, View, StyleSheet, Button} from "react-native";

// button for set time - from 1 to 30 minutes
// button for set font size - from 12 to 36
// button for set random or not


// don't do button, do pressable maybe or something, blue looks bad
const SettingsBox = (props) => {
    // get props methods
    return (
        <View style={styles.settingsBox}>
            <Text style={styles.text}>Settings</Text>
            <Button title="1 Minutes" onPress={() => props.setAudioFileFromTime(1)}/>
            <Button title="3 Minutes" onPress={() => props.setAudioFileFromTime(3)}/>
            <Button title="5 Minutes" onPress={() => props.setAudioFileFromTime(5)}/>
            <Button title="10 Minutes" onPress={() => props.setAudioFileFromTime(10)}/>
            <Button title="20 Minutes" onPress={() => props.setAudioFileFromTime(20)}/>

            <Button title="Random" onPress={props.toggleRandom}/>
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
        elevation: 1,
        marginTop: 15,
        marginBottom: 15
    }
});

export default SettingsBox;