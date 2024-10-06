import { StyleSheet, Pressable, Text, TextInput, View, Alert, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Reload } from '../components/reload';

SplashScreen.preventAutoHideAsync();

export default function SignUp() {

    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nameMsg, setNameMsg] = useState("");
    const [mobileMsg, setMobileMsg] = useState("");
    const [passwordMsg, setPasswordMsg] = useState("");
    const [confirmPasswordMsg, setConfirmPasswordMsg] = useState("");
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

    const verifyPassword = () => {
        if (password.match(confirmPassword)) {
            setConfirmPasswordMsg("");

        } else {
            setConfirmPasswordMsg("Password does't match");
        }
    }

    const handleServerErrors = (msg) => {
        setNameMsg("");
        setMobileMsg("");
        setPasswordMsg("");
        setConfirmPasswordMsg("");

        switch (msg) {
            case "User Already found":
                Alert.alert("Error", msg);
                break;
            case "Please Enter your Full Name":
            case "Please Enter your Last Name":
                setNameMsg(msg);
                break;
            case "Please Enter your Mobile":
                setMobileMsg(msg);
                break;
            case "Invalid Mobile Number":
                setMobileMsg(msg);
                break;
            case "Please Enter your Password":
                setPasswordMsg(msg);
                break;
            case "Minimum eight characters,\nat least one uppercase letter, \none lowercase letter, \none number \nand one special character":
                Alert.alert("Invalid", msg);
                break;
            case "Please Enter your Confirm Password":
                setConfirmPasswordMsg(msg);
                break;
            case "Password doesn't match":
                setConfirmPasswordMsg(msg);
                break;
            default:
                Alert.alert("Unknown Error", msg);
                break;
        }
    };



    const handleSignUp = async () => {
        setReloadState(true);
        const userData = {
            name,
            mobile,
            password,
            confirmPassword,
        };

        try {
            const response = await fetch(NGROK_URL + "/Vlinx/SignUp",
                {
                    method: 'POST',
                    body: JSON.stringify(userData),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );


            if (response.ok) {
                const json = await response.json();

                if (json.success) {
                    // Registration successful
                    setReloadState(false);
                    router.replace("/selectprofile?mobile=" + json.mobile);
                } else {
                    // Registration failed
                    let msg = json.message;
                    setReloadState(false);
                    handleServerErrors(msg);
                }

            } else {
                Alert.alert("Error", "Server responded with an error.");
            }
        } catch (e) {
            Alert.alert("Error", "Network Error");
            console.log(e);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Reload state={getReloadState} />

            <View style={styles.view3}>
                <Pressable style={styles.backBtn} onPress={() => {
                    router.back('/index');
                }}>
                    <FontAwesome6 name='arrow-left-long' size={18} color={"black"} />
                </Pressable>
            </View>

            <ScrollView>
                <View style={styles.view1}>
                    <Text style={styles.text1}>Sign up with Mobile</Text>
                    <View>
                        <Text style={styles.text2}>Get chatting with friends and family today by signing up for our chat app!</Text>
                    </View>
                    <View style={styles.view5}>
                        <Text style={styles.text4}>Your Name</Text>
                        <TextInput onChangeText={setName} inputMode='text' style={styles.input1} />
                        <Text style={styles.msg}>{nameMsg}</Text>
                    </View>
                    <View style={styles.view5}>
                        <Text style={styles.text4}>Your mobile</Text>
                        <TextInput maxLength={10} style={styles.input1} onChangeText={setMobile} keyboardType='phone-pad' inputMode='tel' />
                        <Text style={styles.msg}>{mobileMsg}</Text>
                    </View>
                    <View style={styles.view5}>
                        <Text style={styles.text4}>Password</Text>
                        <TextInput maxLength={12} secureTextEntry={true} style={styles.input1} onChangeText={setPassword} />
                        <Text style={styles.msg}>{passwordMsg}</Text>
                    </View>
                    <View style={styles.view5}>
                        <Text style={styles.text4}>Confirm Password</Text>
                        <TextInput maxLength={12} style={styles.input1} secureTextEntry={true} onChangeText={setConfirmPassword} onEndEditing={verifyPassword} />
                        <Text style={styles.msg}>{confirmPasswordMsg}</Text>
                    </View>
                    <View style={styles.view6}>
                        <Pressable style={styles.pressable1} onPress={handleSignUp}>
                            <Text style={styles.text5}>Create an account</Text>
                        </Pressable>
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
        paddingTop: 10,
        rowGap: 20,
    },
    view2: {
        flex: 1,
        width: '100%',

    },
    view3: {
        marginVertical: 10,
        marginHorizontal: 30
    },
    backBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
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
        borderBottomWidth: 1,
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
    },
    pressable1: {
        width: '100%',
        borderRadius: 30,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        marginTop: 40,
    },
    pressable2: {

    },
    text5: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: '#fff',
    },

});
