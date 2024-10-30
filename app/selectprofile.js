import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as SplashScreen from 'expo-splash-screen';
import { Image, ImageBackground } from "expo-image";
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Reload } from "../components/reload";

const backgroundPath = require('../assets/images/background.png');
const profileDefault = require('../assets/images/profile-default.png');

export default function SelectProfile() {
    const [getImage, setImage] = useState(profileDefault);
    const [getReloadState, setReloadState] = useState(false);
    const NGROK_URL = process.env.EXPO_PUBLIC_URL;

    const user_mobile = useLocalSearchParams().mobile;

    const [loaded, error] = useFonts({
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),

    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const handleImagePick = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({});
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (e) {
            Alert.alert("Error", "Failed to pick image");
        }
    };

    const handleProfileUpload = async () => {
        if (getImage != profileDefault) {
            setReloadState(true);

            const imageData = new FormData();
            imageData.append("mobile", user_mobile);

            if (getImage != profileDefault) {
                imageData.append("ProfileImage",
                    {
                        name: "profile",
                        uri: getImage,
                        type: "image/jpg",


                    });
            }


            const response = await fetch(NGROK_URL + "/Vlinx/ProfileUpload", {
                method: 'POST',
                body: imageData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });


            if (response.ok) {
                router.replace('/signin');
                setReloadState(false);

            } else {
                setReloadState(false);
                Alert.alert("Error", "Network Error");

            }
        } else {
            Alert.alert("Message", "Select an Image to Continue");

        }
    }

    return (
        <View style={styles.view1}>
            <Reload state={getReloadState} />
            <ImageBackground source={backgroundPath} contentFit="cover" style={styles.image1}></ImageBackground>
            <View style={styles.view3}>
                <Text style={styles.text1}>Select Your Profile</Text>
                <View style={styles.view2}>
                    <Image source={getImage} style={styles.image2} contentPosition={"center"}></Image>
                    <Pressable style={styles.pressable1} onPress={handleImagePick}>
                        <Image source={require("../assets/icons/camera.svg")} style={styles.image3}></Image>
                    </Pressable>
                </View>
                <View>
                    <Pressable style={styles.pressable2} onPress={handleProfileUpload}>
                        <Text style={styles.text2}>Continue</Text>
                    </Pressable>

                    <Pressable style={styles.pressable3} onPress={() => {
                        router.replace("/signin");
                    }}>
                        <Text style={styles.text3}>Skip</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    view1: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image1: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    view3: {
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 100,
        marginTop: 30,
    },
    text1: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        color: '#ffffff',
    },
    view2: {
        position: 'relative',
    },
    image2: {
        width: 220,
        height: 220,
        borderRadius: 110,
    },
    pressable1: {
        position: 'absolute',
        width: 50,
        height: 50,
        backgroundColor: '#FFCB45',
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 10,
        right: 20,

    },
    image3: {
        width: 25,
        height: 25,
    },
    pressable2: {
        height: 60,
        backgroundColor: '#ffffff',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 120,
    },
    text2: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold'
    },
    pressable3: {
        marginVertical: 10,
        paddingHorizontal: 120,
        height: 60,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ffffff',//FFCB45
        borderWidth: 1,
        borderRadius: 50,

    },
    text3: {
        fontSize: 20,
        color: '#ffffff',
        fontFamily: 'Poppins-Medium',

    },
});