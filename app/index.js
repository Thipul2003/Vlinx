import { Image, ImageBackground } from "expo-image";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { Link, router } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";


SplashScreen.preventAutoHideAsync();

const background = require('../assets/images/background.png');
export default function GetStarted() {


    const [loaded, error] = useFonts({
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    });

    useEffect(() => {
        async function checkUserAsync() {
            let userJson = await AsyncStorage.getItem("user");
            try {
                if (userJson != null) {
                    router.replace("/home");
                }
            } catch (e) {
                console.log(e);
            }
        }
        checkUserAsync();
    }, []
    );

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }



    return (
        <SafeAreaView style={{ flex: 1, }}>
            <StatusBar hidden={true} />
            <Image source={background} contentFit="cover" style={styles.view1}>
            </Image>
            <View style={styles.view2}>
                <Image source={require('../assets/icons/Logo.svg')} contentFit="cover" style={styles.image1}></Image>
                <Image source={require('../assets/icons/conversation.svg')} contentFit="contain" style={styles.image2}></Image>

                <Text style={styles.text1}>
                    Stay connected with your friends and family
                </Text>

                <View style={styles.view3}>
                    <Image source={require('../assets/icons/shield-check.svg')} style={styles.image3}></Image>
                    <Text style={styles.text2}>Secure, private messaging</Text>
                </View>


                <Pressable style={styles.pressable1} onPress={() => {
                    router.push("/signin");
                }}>
                    <Text style={styles.text3}>Get Started</Text>
                </Pressable>


            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    view1: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
    },
    view2: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        rowGap: 20,
    },
    image1: {
        width: 100,
        height: 80,
    },
    image2: {
        width: 250,
        height: 250,
    },
    text1: {
        fontSize: 36,
        fontFamily: 'Inter-Bold',
        color: '#ffffff',
        alignSelf: 'flex-start',
    },
    view3: {
        flexDirection: 'row',
        columnGap: 10,
        alignSelf: 'flex-start',
    },
    image3: {
        width: 20,
        height: 20,
    },
    text2: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#ffffff'
    },
    pressable1: {
        backgroundColor: '#ffffff',
        borderRadius: 50,
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    text3: {
        fontSize: 16,
        fontFamily: 'Inter-Bold',
    },
});