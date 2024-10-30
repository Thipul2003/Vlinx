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
    const { profileClick } = props;

    const handleProfileClick = () => {
        if (profileClick) {
            profileClick(props.profilePath);
        }
    };

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

            <Pressable style={styles.view10} onPress={handleProfileClick}>
                <Image source={props.profilePath} style={styles.image7}></Image>
                <View style={[styles.view13, props.userStatus == 1 ? styles.display_flex : styles.display_none]}></View>
            </Pressable>
            <View style={styles.view11}>
                <Text style={[styles.text4, props.textDark ? styles.text_dark : styles.text_white]} numberOfLines={1}>{props.name}</Text>
                {
                    props.msgHidden ?
                        <Text style={styles.text5} numberOfLines={1}>{props.message}</Text>
                        : null
                }
            </View>
            <View style={styles.view12}>

                <Text style={[styles.text6, props.dateHidden ? styles.display_flex : styles.display_none]}>{props.time}</Text>
                <View style={{ flexDirection: 'row', columnGap: 10, }}>
                    {
                        props.msgCount != 0 ?
                            <View style={[styles.view1, props.countViewColor == "#ffffff" ? styles.background_white : styles.background_green]}>
                                <Text style={[styles.text1, props.countViewColor == "#ffffff" ? styles.text_dark : styles.text_white]}>{props.msgCount}</Text>
                            </View>
                            : null
                    }

                    {
                        props.chatStatus == 1 ?
                            <Image source={require('../assets/icons/ph_checks-fill.svg')} style={[styles.image8, props.checkVisible ? styles.display_flex : styles.display_none]}></Image>
                            :
                            <Image source={require('../assets/icons/ph_checks-fill-blue.svg')} style={[styles.image8, props.checkVisible ? styles.display_flex : styles.display_none]}></Image>
                    }
                </View>
                {/* <Image source={require('../assets/icons/ph_checks-fill.svg')} style={styles.image8}></Image> */}
            </View>
        </Pressable>
    );

}

const styles = StyleSheet.create({
    view1: {
        width: 23,
        height: 23,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background_white: {
        backgroundColor: '#ffffff',
    },
    background_green: {
        backgroundColor: '#F9B608',
    },
    text1: {
        fontSize: 12,
    },
    text_white: {
        color: '#ffffff',
        fontFamily: 'Inter-Bold',
        fontSize: 13,
    },
    text_dark: {
        color: '#000000',
        fontFamily: 'Inter-Bold',
    },
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