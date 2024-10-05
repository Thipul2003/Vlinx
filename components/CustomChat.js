import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { Image } from "expo-image";
import { router } from "expo-router";

export function CustomChat(props) {
    const [loaded, error] = useFonts({
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),

    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const navigateToChat = () => {
        router.push({
            pathname: '/chat',
            params: {
                chatObject: JSON.stringify(props.chatObject),
                user: JSON.stringify(props.user),
            }
        });

    }


    return (
        <Pressable style={styles.view9} onPress={navigateToChat}>
            <View style={styles.view10}>
                <Image source={props.profilePath} style={styles.image7}></Image>
                <View style={[styles.view13, props.userStatus == 1 ? styles.display_flex : styles.display_none]}></View>
            </View>
            <View style={styles.view11}>
                <Text style={styles.text4} numberOfLines={1}>{props.name}</Text>
                <Text style={styles.text5} numberOfLines={1}>{props.message}</Text>
            </View>
            <View style={styles.view12}>
                <Text style={styles.text6}>{props.time}</Text>
                {
                    props.chatStatus == 1 ?
                        <Image source={require('../assets/icons/ph_checks-fill.svg')} style={styles.image8}></Image>
                        :
                        <Image source={require('../assets/icons/ph_checks-fill-blue.svg')} style={styles.image8}></Image>

                }
                {/* <Image source={require('../assets/icons/ph_checks-fill.svg')} style={styles.image8}></Image> */}
            </View>
        </Pressable>
    );

}

const styles = StyleSheet.create({

    view10: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    view13: {
        width: 15,
        height: 15,
        position: 'absolute',
        backgroundColor: '#FFCB45',
        borderRadius: 7.5,
        right: 5,
        bottom: 1,
        display: 'flex',
    },
    image7: {
        width: 59,
        height: 59,
        borderRadius: 29.5,
    },
    view11: {
        flex: 3,
        rowGap: 8,
    },
    image8: {
        width: 22,
        height: 22,
    },
    view9: {
        flexDirection: 'row',
        columnGap: 20,
        paddingVertical: 15,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EFF0F1',
        borderStyle: 'solid',
    },
    view12: {
        flex: 1,
        alignItems: 'flex-end',
        rowGap: 10,
    },
    text4: {
        fontSize: 15,
        fontFamily: 'Inter-Bold',
        color: '#000000',
    },
    text5: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        color: '#8A91A8',
    },
    text6: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        color: '#8A91A8',
    },
    display_none: {
        display: 'none',
    },
    display_flex: {
        display: 'flex',
    },
});