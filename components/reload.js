import { StyleSheet, Pressable, Text, TextInput, View, Alert, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Reload(props) {

    const [loaded, error] = useFonts({
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),

    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }
    return (
        <View style={[styles.reload, props.state ? styles.start : styles.stop]}>
            <Image source={require('../assets/images/reload.gif')} style={styles.reload_image} />
            <Text style={styles.reload_text}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    reload: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#121212b8',
        zIndex: 1,
        rowGap: 20,
    },
    reload_image: {
        width: 100,
        height: 100,
    },
    reload_text: {
        fontSize: 25,
        fontFamily: 'Poppins-Medium',
        color: 'white',
    },
    start: {
        display: 'flex',
    },
    stop: {
        display: 'none',
    },
});
