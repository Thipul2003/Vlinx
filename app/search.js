import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, TextInput, ScrollView, Alert, RefreshControl } from "react-native";
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, } from 'react-native-reanimated';
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

const backgroundPath = require('../assets/images/background2.png');
const NGROK_URL = process.env.EXPO_PUBLIC_URL;

export default function Search() {

    const [loaded, error] = useFonts({
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),

    });

    const translateY1 = useSharedValue(800);
    const opacityIntensity = useSharedValue(0);
    const translateY2 = useSharedValue(-85);
    const translateX2 = useSharedValue(145);
    const scaleX1 = useSharedValue(0.33);
    const scaleY1 = useSharedValue(0.33);

    const animatedStyle1 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY1.value }],
            opacity: opacityIntensity.value,
        };
    });

    const profileSlide = useAnimatedStyle(() => {
        return {
            transform: [{
                translateY: translateY2.value,
            }, {
                translateX: translateX2.value,
            }, {
                scaleX: scaleX1.value,
            }, {
                scaleY: scaleY1.value
            }
            ],
        };
    });

    function toggleViewUp() {
        translateY1.value = withTiming(0, { duration: 800 });
        opacityIntensity.value = withTiming(1, { duration: 1000 });

    };

    function slideScaleUp() {
        translateY2.value = withTiming(0, { duration: 800 });
        translateX2.value = withTiming(0, { duration: 800 });
        scaleX1.value = withTiming(1, { duration: 800 });
        scaleY1.value = withTiming(1, { duration: 800 });

    };

    function slideScaleDown() {
        translateY2.value = withTiming(-85, { duration: 800 });
        translateX2.value = withTiming(145, { duration: 800 });
        scaleX1.value = withTiming(0.33, { duration: 1000 });
        scaleY1.value = withTiming(0.33, { duration: 1000 });

    };


    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }



    return (
        <View style={styles.view1}>
            <Image source={backgroundPath} style={styles.image1}></Image>

            {/* hEADER */}
            <View style={styles.view2}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <TextInput style={styles.view3}>
                        <FontAwesome6 name="magnifying-glass" size={20} color={"white"} />
                    </TextInput>
                </View>
                <View style={styles.view4}>
                    <Text style={styles.text1}>Welcome, </Text>
                    <Text style={styles.text2}>thipul</Text>
                    <Image source={require('../assets/icons/peace.svg')} style={styles.image3}></Image>
                </View>
                <View style={{ flex: 1, }}>
                    <Pressable style={styles.view15} onPress={() => {
                        router.push('/profile');
                    }}>
                        {
                            true == true ?
                                <Image source={require('../assets/images/profile-default.png')} style={styles.image4}></Image>
                                :
                                <Image source={require('../assets/images/profile-default.png')} style={styles.image4}></Image>
                        }
                    </Pressable>
                </View>

            </View>
            {/* hEADER */}

            <Animated.View style={[styles.view14, animatedStyle1]}>
                <View style={[styles.view9, styles.width_full]}></View>
                
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    view1: {
        flex: 1,
        backgroundColor: '#000000',
    },
    image1: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    view2: {
        flexDirection: 'row',
        columnGap: 50,
        marginTop: 15,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    view3: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#ffffff38',
        justifyContent: 'center',
        alignItems: 'center',
        // marginLeft: 25,
    },
    view4: {
        flex: 2,
        flexDirection: 'row',
    },
    image3: {
        width: 20,
        height: 20,
        marginLeft: 10,
        color: 'red',
    },
    image4: {
        width: 44,
        height: 44,
        borderRadius: 22,
        // borderColor: '#FFCB45',
    },
    text1: {
        fontSize: 15,
        color: '#ffffff',
        fontFamily: 'Inter-Light',
    },
    text2: {
        fontSize: 15,
        color: '#ffffff',
        fontFamily: 'Inter-Bold',
    },
    view5: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        columnGap: 30,
        paddingTop: 35,
        paddingBottom: 35,
        justifyContent: 'center',
        bottom: 0,
        width: '100%',
    },

    view6: {
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    image6: {
        width: 39,
        height: 39,
    },
    view8: {
        marginTop: 18,
        paddingBottom: 50,
    },
    view9: {
        backgroundColor: '#E5E6E9',
        borderRadius: 30,
        height: 5,
        position: 'absolute',
        top: 15,
        alignSelf: 'center',

    },
    width_full: {
        width: 109,

    },
    width_small: {
        width: 50,

    },
    view14: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginBottom: -50,
        borderRadius: 50,
        paddingTop: 42,
        paddingBottom: 50,
    },

    view15: {
        borderWidth: 2,
        borderColor: '#FFCB45',
        width: 53,
        height: 53,
        borderRadius: 26.5,
        justifyContent: 'center',
        alignItems: 'center',
        // marginRight: 25,
        right: 0,
    },
    view16: {
        flex: 1,
        backgroundColor: '#ffffff',

    },
    view17: {
        backgroundColor: '#ffffff',

    },
    view18: {
        flex: 1,
        backgroundColor: '#ffffff',

    },
    view19: {
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 15,

    },
    view20: {
        position: 'relative',
    },
    view21: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FFCB45',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 5,
        right: 10,
    },
    image7: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    view22: {
        flexDirection: 'row',
        columnGap: 20,
    },
    text4: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: '#ffffff',
    },

});