import { StyleSheet, Pressable, Text, TextInput, View, Alert, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reload } from '../components/reload';


SplashScreen.preventAutoHideAsync();

export default function SignIn() {

    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [mobileMsg, setMobileMsg] = useState("");
    const [passwordMsg, setPasswordMsg] = useState("");
    const [getReloadState, setReloadState] = useState(false);
    const NGROK_URL = process.env.EXPO_PUBLIC_URL;



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


    const handleServerErrors = (msg) => {

        setMobileMsg("");
        setPasswordMsg("");

        switch (msg) {
            case "Invalid credentials":
                Alert.alert("Error", msg);
                break;
            case "Please Fill Your Mobile Number":
                setMobileMsg(msg);
                break;
            case "Invalid Mobile Number":
                setMobile(msg);
                break;
            case "Please Fill Your Password":
                setPassword(msg);
                break;
            case "Minimum eight characters,\n"
                + "at least one uppercase letter, \n"
                + "one lowercase letter, \n"
                + "one number \n"
                + "and one special character":
                Alert.alert("Invalid Password", msg);
                break;
            default:
                Alert.alert("Error", msg);
                break;
        }

    }
    const handleLogin = async () => {
        setReloadState(true);
        const loginData = {
            mobile,
            password,
        }
        try {
            const response = await fetch(NGROK_URL + "/Vlinx/SignIn", {
                method: 'POST',
                body: JSON.stringify(loginData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const json = await response.json();
                if (json.success) {
                    setReloadState(false);
                    let user = json.user;
                    AsyncStorage.setItem("user", JSON.stringify(user));
                    router.replace("/home");

                } else {
                    setReloadState(false);

                    let msg = json.message;

                    handleServerErrors(msg);
                }

            } else {
                Alert.alert("Error", "Server Error");
            }
        } catch (e) {
            Alert.alert("Error", "Network Issue");
            console.log(e);
        } finally {
            setReloadState(false);
        }
    }

    return (

        <SafeAreaView style={{ flex: 1, }}>
            <Reload state={getReloadState} />
            <View style={styles.view2}>
                <Link push href="/index">
                    <Pressable style={styles.backBtn}>
                        <FontAwesome6 name='arrow-left-long' size={18} color={"black"} />
                    </Pressable>
                </Link>
            </View>

            <ScrollView style={styles.scrollview1}>
                <View style={styles.view1}>
                    <Text style={styles.text1}>Log in to Vlinx</Text>
                    <View>
                        <Text style={styles.text2}>Welcome back! Sign in using your social account or email to continue us</Text>
                    </View>

                    <View style={styles.view3}>
                        <Pressable style={styles.backBtn} onPress={() => {
                            Alert.alert("Success", "Facebook");
                        }}>
                            <FontAwesome6 name='facebook' size={25} color={"#1877F2"} />
                        </Pressable>
                        <Pressable style={styles.backBtn} onPress={() => {
                            Alert.alert("Success", "Gmail");
                        }}>
                            <Image style={styles.image1} source={require('../assets/icons/google.svg')} contentFit='contain' />
                        </Pressable>
                        <Pressable style={styles.backBtn} onPress={() => {
                            Alert.alert("Success", "Apple");
                        }}>
                            <FontAwesome name='apple' size={25} color={"black"} />
                        </Pressable>
                    </View>

                    <View style={styles.line1}>
                        <View style={styles.view4}>
                            <Text style={styles.text3}>OR</Text>
                        </View>
                    </View>

                    <View style={styles.view5}>
                        <Text style={styles.text4}>Your mobile</Text>
                        <TextInput maxLength={10} keyboardType='phone-pad' onChangeText={setMobile} inputMode='tel' style={styles.input1} />
                        <Text style={styles.msg}>{mobileMsg}</Text>
                    </View>

                    <View style={styles.view5}>
                        <Text style={styles.text4}>Password</Text>
                        <TextInput maxLength={12} style={styles.input1} secureTextEntry={true} onChangeText={setPassword} />
                        <Text style={styles.msg}>{passwordMsg}</Text>

                    </View>

                    <View style={styles.view6}>
                        <Pressable style={styles.pressable1} onPress={handleLogin}>
                            <Text style={styles.text5}>Login</Text>
                        </Pressable>
                        <Link href={"./signup"} asChild>
                            <Pressable style={styles.pressable2}>
                                <Text style={styles.text4}>New User? Create Account</Text>
                            </Pressable>
                        </Link>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    view1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 25,
        rowGap: 20,

    },
    scrollview1: {
        marginTop: 20,
    },
    view2: {
        marginVertical: 10,
        marginHorizontal: 30,

    },
    backBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    text1: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#3D4A7A'
    },
    text2: {
        color: 'grey',
        fontFamily: 'Poppins-Light',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20
    },
    image1: {
        width: '60%',
        flex: 1,
    },
    view3: {
        flexDirection: 'row',
        columnGap: 20,
    },
    line1: {
        borderBottomWidth: 1,
        width: '100%',
        borderColor: '#CDD1D0',
        alignItems: 'center',
        marginBottom: 20,

    },
    text3: {
        fontFamily: 'Poppins-Black',
        fontSize: 14,
        color: '#797C7B',
    },
    view4: {
        position: 'absolute',
        alignItems: 'center',
        top: -10,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
    },
    view5: {
        alignSelf: 'flex-start',
        width: '100%',

    },
    text4: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#3D4A7A',
    },
    input1: {
        height: 40,
        borderBottomWidth: 1.5,
        fontFamily: 'Poppins-Regular',
        borderColor: '#CDD1D0',
        outlineColor: '#fff',
        paddingHorizontal: 5,
        fontSize: 16,
    },
    msg: {
        color: 'red',
        fontFamily: 'Poppins-Light',
        fontSize: 12,
        alignSelf: 'flex-end'
    },
    view6: {
        width: '100%',
        alignItems: 'center',
        rowGap: 20,
        marginTop: 80,
    },
    pressable1: {
        width: '100%',
        borderRadius: 30,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,

    },
    pressable2: {

    },
    text5: {
        fontSize: 18,
        fontFamily: 'Inter-Bold',
        color: '#fff',
        letterSpacing: 0.1,
    },

});
