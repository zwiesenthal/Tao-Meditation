import React from "react";
import {Text, ScrollView, StyleSheet} from "react-native";
import { colors } from './Colors';

const TextBox = (props) => {
    const text = props.text;
    // find 2nd new line
    // const newLine = text.indexOf("\n");
    // const firstLine = text.substring(0, newLine);
    const secondLine = text; // text.substring(newLine + 2);
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.text}>{secondLine}</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute', // halfway down the screen
        //left: '5%',
        top: '12%',
        width: '100%',
        height: '73%',
        borderRadius: 10
    },
    text: {
        fontSize: 24,
        color: colors.TEXT_WHITE,
        textAlign: "center",
        padding: 30,
    }
});

export default TextBox;