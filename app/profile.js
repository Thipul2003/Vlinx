import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View, TextInput, ScrollView, Alert } from "react-native";
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, } from 'react-native-reanimated';
import { Reload } from "../components/reload";
import { router } from "expo-router";

const backgroundPath = require('../assets/images/background2.png');
const NGROK_URL = process.env.EXPO_PUBLIC_URL;

export default function Profile() {

    const [user, setUser] = useState(null);
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [profile, setProfile] = useState("");

    const [loaded, error] = useFonts({
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),

    });

    async function fetchProfilePic() {
        const userJson = await AsyncStorage.getItem("user");
        let user = JSON.parse(userJson);
        setUser(user);
        setFname(user.first_name);
        setLname(user.last_name);
        setMobile(user.mobile);
        setPassword(user.password);

        if (user && user.mobile) {
            const imagePath = NGROK_URL + "/Vlinx/ProfileImages/" + user.mobile + ".jpg";
            const response = await fetch(imagePath);

            if (response.ok) {
                setProfile(imagePath);
            } else {
                setProfile(null);
            }
        }
    }

    useEffect(() => {
        fetchProfilePic();
        toggleViewUp();
        setTimeout(() => {
            slideScaleUp();
        }, 200);
    }, []);

    const handleImagePick = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({});
            if (!result.canceled) {
                setProfile(result.assets[0].uri);
                updateUser();
            }
        } catch (e) {
            Alert.alert("Error", "Failed to pick image");
        }
    };


    const translateY1 = useSharedValue(800);
    const opacityIntensity = useSharedValue(0);
    const translateY2 = useSharedValue(-90);
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
        translateY2.value = withTiming(-90, { duration: 800 });
        translateX2.value = withTiming(145, { duration: 800 });
        scaleX1.value = withTiming(0.33, { duration: 1000 });
        scaleY1.value = withTiming(0.33, { duration: 1000 });

    };



    const updateUser = async () => {
        console.log(fname);
        console.log(lname);
        console.log(password);
        console.log(profile);

        const dataForm = new FormData();
        dataForm.append("firstName", fname);
        dataForm.append("lastName", lname);
        dataForm.append("password", password);
        dataForm.append("mobile", mobile);


        if (profile != null) {
            dataForm.append("profileImage", {
                name: "profileImage",
                type: "image/jpg",
                uri: profile,
            });
        }


        const response = await fetch(NGROK_URL + "/Vlinx/UpdateUser", {
            method: "POST",
            body: dataForm,
        });

        if (response.ok) {

        } else {
            Alert.alert("Error", "Server Error");
        }

    }

    // useEffect(() => {
    //     const profileFocus = navigation.addListener('focus', () => {
    //         toggleViewUp();

    //     });

    //     const profileBlur = navigation.addListener('blur', () => {
    //         toggleViewDown();
    //     });

    //     return () => {
    //         profileBlur();
    //         profileFocus();
    //     };
    // }, []);


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
            {/* <Reload state={getReloadState} /> */}
            <StatusBar hidden={true} />
            <Image contentFit="cover" source={backgroundPath} style={styles.image1}></Image>
            {/* hEADER */}
            <View style={styles.view5}>
                <Pressable style={[styles.view3, styles.alignSelf_Start]} onPress={() => {
                    slideScaleDown();
                    setTimeout(() => {
                        router.push('/home');
                    }, 100);
                }}>
                    <FontAwesome6 name="arrow-left-long" size={20} color={"white"} />
                </Pressable>
                <View style={styles.view6}>
                    <Animated.View style={[profileSlide]}>
                        {
                            profile == null ?
                                <Image source={require('../assets/images/profile-default.png')} style={styles.image7}></Image>
                                :
                                <Image source={profile} style={[styles.image7]}></Image>
                        }
                    </Animated.View>
                    <Pressable style={styles.view7} onPress={handleImagePick}>
                        <FontAwesome6 name="pen" size={15} color={"#000000"} />
                    </Pressable>
                </View>
                <Text style={styles.text4}>{fname + " " + lname}</Text>
                <View style={styles.view22}>
                    <View style={[styles.view3, styles.translucent_color]}>
                        <FontAwesome6 name="message" size={18} color={"white"} />
                    </View>
                    <View style={[styles.view3, styles.translucent_color]}>
                        <FontAwesome6 name="camera" size={18} color={"white"} />
                    </View>
                    <View style={[styles.view3, styles.translucent_color]}>
                        <FontAwesome6 name="phone" size={18} color={"white"} />
                    </View>
                    <View style={[styles.view3, styles.translucent_color]}>
                        <FontAwesome6 name="ellipsis-vertical" size={18} color={"white"} />
                    </View>
                </View>
            </View>
            {/* hEADER */}
            <Animated.View style={[styles.view8, animatedStyle1]}>
                <View style={[styles.view4, styles.width_small]}></View>
                <ScrollView>
                    <View style={styles.view2}>
                        <Text style={styles.text1}>First Name</Text>
                        <TextInput style={styles.input1} value={fname} inputMode="text" onChangeText={setFname} onEndEditing={updateUser} />
                    </View>
                    <View style={styles.view2}>
                        <Text style={styles.text1}>Last Name</Text>
                        <TextInput style={styles.input1} inputMode="text" value={lname} onChangeText={setLname} onEndEditing={updateUser} />
                    </View>
                    <View style={styles.view2}>
                        <Text style={styles.text1}>Phone Number</Text>
                        <TextInput style={styles.input1} value={mobile} maxLength={10} inputMode="tel" />
                    </View>
                    <View style={styles.view2}>
                        <Text style={styles.text1}>Password</Text>
                        <TextInput style={styles.input1} secureTextEntry={true} value={password} onChangeText={setPassword} onEndEditing={updateUser} />
                    </View>
                </ScrollView>

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
        marginHorizontal: 20,
        marginVertical: 10,
    },
    text1: {
        fontFamily: 'Inter-Regular',//regular
        fontSize: 15,//14
        color: '#797C7B',
    },
    input1: {
        width: '100%',
        height: 45,
        fontSize: 18,
        fontFamily: 'Inter-Medium',
        borderRadius: 10,
    },
    view3: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    translucent_color: {
        backgroundColor: '#ffffff38',

    },
    alignSelf_Start: {
        position: 'absolute',
        left: 10,
        top: 50,
        // marginLeft: 20,
        zIndex: 1,
    },
    view4: {
        backgroundColor: '#E5E6E9',
        borderRadius: 30,
        height: 5,
        position: 'absolute',
        top: 15,
        alignSelf: 'center',

    },
    width_small: {
        width: 50,
    },
    view5: {
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 15,

    },
    view6: {
        width: '100%',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    view7: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FFCB45',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 130,
    },
    image7: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    view22: {
        flexDirection: 'row',
        columnGap: 40,
    },
    text4: {
        fontFamily: 'Inter-Bold',
        fontSize: 20,
        color: '#ffffff',
    },
    view8: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginBottom: -50,
        borderRadius: 50,
        paddingTop: 42,
        paddingBottom: 50,
    },

});