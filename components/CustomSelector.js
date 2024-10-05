import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { Image } from "expo-image";

export function CustomSelector(props) {
    const [loaded, error] = useFonts({
        'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const changeInterface = () => {
        if (props.name == "Messages") {

        } else if (props.name = "Calls") {

        } else if (props.name == "Search") {

        } else if (props.name == "Profile") {

        }
    }

    return (
        <Pressable style={styles.view7} onPress={props.onPress}>
            <Image source={props.lpath} style={styles.image5}></Image>
            <Text style={styles.text3}>{props.name}</Text>
        </Pressable>
    );

}

const styles = StyleSheet.create({
    view7: {
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 5,
    },
    image5: {
        width: 24,
        height: 24
    },
    text3: {
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: '#561D1D',
    },
});