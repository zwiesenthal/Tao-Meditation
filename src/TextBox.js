import React from "react";
import {Text, ScrollView, StyleSheet} from "react-native";

const TextBox = (props) => {
    const text = props.text;
    // find 2nd new line
    const newLine = text.indexOf("\n");
    const firstLine = text.substring(0, newLine);
    const secondLine = text.substring(newLine + 2);
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.text}>{secondLine}</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fdad5c',
        position: 'absolute', // halfway down the screen
        left: '5%',
        top: '15%',
        width: '90%',
        height: '70%',
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

export default TextBox;