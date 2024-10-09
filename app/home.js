import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Dimensions, LayoutAnimation, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from "expo-image";
import { Link, Navigator, router, useFocusEffect } from 'expo-router';
import { CustomChat } from "../components/CustomChat";
import { CustomSelector } from "../components/CustomSelector";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, } from 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Reload } from "../components/reload";
import * as ImagePicker from 'expo-image-picker';

const backgroundPath = require('../assets/images/background2.png');
const NGROK_URL = process.env.EXPO_PUBLIC_URL;


function Chats({ navigation }) {

    const [getChatArray, setChatArray] = useState([]);
    const [name, setName] = useState("");
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState("");
    const [getReloadState, setReloadState] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    const intervalRef = useRef(null);  // Ref to store the interval

    const [loaded, error] = useFonts({
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),

    });

    const fetchChatData = async () => {
        const userJson = await AsyncStorage.getItem("user");
        let user = JSON.parse(userJson);
        setUser(user);
        setReloadState(true);

        if (user == null) {
            router.replace("/signin");
        } else {
            setUser(user);
            const response = await fetch(NGROK_URL + "/Vlinx/LoadHomeData?id=" + user.id);

            if (response.ok) {
                const json = await response.json();
                if (json.success) {
                    const user = json.user;
                    const chatArray = json.jsonChatArray;
                    setName(user.first_name);
                    setChatArray(chatArray);
                    setReloadState(false);

                }
            } else {
                setReloadState(false);
                Alert.alert("Error", "Server Error");
            }
        }


    }
    useEffect(() => {
        fetchProfilePic();
    }, [user]);

    useEffect(() => {
        // intervalRef.current = setInterval(() => {
        //     fetchChatData();
        // }, 1000);

        return () => {
            clearInterval(intervalRef.current);
        };

    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        setReloadState(true);
        await fetchChatData();
        setRefreshing(false);
    };

    const translateY1 = useSharedValue(1000);

    const animatedStyle1 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY1.value }],
        };
    });

    function toggleViewUp() {
        translateY1.value = withTiming(0, { duration: 800 });

    };

    function toggleViewDown() {
        translateY1.value = withTiming(1000, { duration: 800 });

    };


    async function fetchProfilePic() {
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
        const chatFocus = navigation.addListener('focus', () => {
            fetchChatData();
            toggleViewUp();

        });

        const chatBlur = navigation.addListener('blur', () => {
            toggleViewDown();
        });

        return () => {
            chatBlur();
            chatFocus();
        };
    }, [navigation]);


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
            <Reload state={getReloadState} />

            <Image source={backgroundPath} style={styles.image1}></Image>

            {/* hEADER */}
            <View style={styles.view2}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                    <Pressable style={styles.view3} onPress={() => {
                        navigation.navigate('Search');
                    }}>
                        <FontAwesome6 name="magnifying-glass" size={20} color={"white"} />
                    </Pressable>
                </View>
                <View style={styles.view4}>
                    <Text style={styles.text1}>Welcome, </Text>
                    <Text style={styles.text2}>{name}</Text>
                    <Image source={require('../assets/icons/peace.svg')} style={styles.image3}></Image>
                </View>
                <View style={{ flex: 1, }}>
                    <Pressable style={styles.view15} onPress={() => {
                        navigation.navigate('Profile');
                    }}>
                        {
                            profile == null ?
                                <Image source={require('../assets/images/profile-default.png')} style={styles.image4}></Image>
                                :
                                <Image source={profile} style={styles.image4}></Image>
                        }
                    </Pressable>
                </View>

            </View>
            {/* hEADER */}

            <Animated.View style={[styles.view14, animatedStyle1]}>
                <View style={[styles.view9, styles.width_full]}></View>
                <FlashList
                    data={getChatArray}
                    renderItem={({ item }) =>
                        <CustomChat
                            chatObject={item}
                            chatStatus={item.chat_status_id}
                            userStatus={item.user_status}
                            profilePath={item.profile_uploaded ? NGROK_URL + "/Vlinx/ProfileImages/" + item.mobile + ".jpg" : require('../assets/images/profile-default.png')}
                            name={item.name}
                            message={item.message}
                            time={item.date_time}
                            user={user}
                            msgHidden={true}
                            dateHidden={true}
                            checkVisible={true}
                            msgCountVisible={true}
                            msgCount={item.un_seen_count}
                            textDark={true}
                            countViewColor={"#F9B608"}

                        />
                    }
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    estimatedItemSize={200}
                />
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
    input2: {
        width: '100%',
        borderWidth: 1,
        backgroundColor: '#ffffff38',
        height: 50,
        borderRadius: 25,
        fontSize: 18,
        color: '#ffffff',
        paddingHorizontal: 60,
        fontFamily: 'Inter-Medium'
    },
    view23: {
        paddingVertical: 50,
        justifyContent: 'center',
        width: 44,
        height: 44,
        marginTop: 30,
    },
    view24: {
        flex: 1,
        marginBottom: 10,
        marginTop: 50,
        marginHorizontal: 20,
        // position: 'absolute',
    },

});

function Calls({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Calls!</Text>
        </View>
    );
}


function Add({ navigation }) {

    const handleLogout = async () => {
        const userJson = await AsyncStorage.getItem("user");
        const user = JSON.parse(userJson);
        const response = await fetch(NGROK_URL + "/Vlinx/Logout?user_id=" + user.id);

        if (response.ok) {

            const json = await response.json();
            if (json.success) {
                await AsyncStorage.removeItem("user");
                router.replace('/signin');
            } else {
                Alert.alert("Message", "Response not Found");
            }

        } else {
            Alert.alert("Server Error");
        }
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="logout" onPress={handleLogout}></Button>
        </View>
    );
}

function Search({ navigation }) {

    const [refreshing, setRefreshing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputWidth, setInputWidth] = useState(50); // Default width
    const [userArray, setUserArray] = useState([]);
    const [user, setUser] = useState("");

    const [loaded, error] = useFonts({
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),

    });
    const ws = new WebSocket(NGROK_URL + "/Vlinx/socketEndPoint");

    useEffect(() => {

        ws.onopen = () => {
            // connection opened
            console.log("Connection opened");
        };

        ws.onmessage = e => {
            // a message was received
        };

        ws.onerror = e => {
            // an error occurred
            console.log("OnError");

        };

        ws.onclose = e => {
            // connection closed
            console.log("OnClose");

        };

    }, [navigation]);


    const expandInput = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setInputWidth(Dimensions.get('window').width);
    };

    const shrinkInput = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setInputWidth(50);
    };


    useEffect(() => {
        async function getUser() {
            const userJson = await AsyncStorage.getItem("user");
            setUser(JSON.parse(userJson));
        }
        getUser();
    }, []);


    useEffect(() => {

        const SearchFocus = navigation.addListener('focus', () => {
            // fetchChatData();
            expandInput();
            toggleViewDown();

        });

        const SearchBlur = navigation.addListener('blur', () => {
            // shrinkInput();
            toggleViewUp();
        });

        return () => {
            SearchFocus();
            SearchBlur();
        };
    }, [navigation]);

    const onRefresh = async () => {
        setRefreshing(true);
        // setReloadState(true);
        // await fetchChatData();
        setRefreshing(false);
    };

    const translateY1 = useSharedValue(-800);

    const animatedStyle1 = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY1.value }],
        };
    });

    function toggleViewUp() {
        translateY1.value = withTiming(-1000, { duration: 800 });

    };

    function toggleViewDown() {
        translateY1.value = withTiming(0, { duration: 800 });

    };





    const handleUserSearch = (text) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                id: user.id,
                name: text,
            }));
            ws.onmessage = e => {
                // a message was received
                const response = JSON.parse(e.data);
                setUserArray(response.otherUserArray);
            };
            // console.log(userArray);
        } else {
            console.log("WebSocket is not open.");
        }
    }

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
            <View style={styles.view23}>

                <View style={{ width: inputWidth, paddingHorizontal: 20, position: 'relative', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }} onFocus={expandInput}
                >
                    <TextInput style={styles.input2} onFocus={(text) => {
                        handleUserSearch("");
                    }} onChangeText={(text) => {
                        handleUserSearch(text);
                    }} />
                    <FontAwesome6 name="magnifying-glass" size={20} color={"white"} style={{ position: 'absolute', right: 50, }} />
                    <Pressable style={{ position: 'absolute', left: 40, top: -10, zIndex: 1, }} onPress={() => {
                        shrinkInput();
                        router.replace('/home');
                        toggleViewUp();
                    }}>
                        <FontAwesome6 name="arrow-left-long" size={20} color={"white"} />

                    </Pressable>
                </View>
            </View>
            {/* hEADER */}

            <Animated.View style={[styles.view24, animatedStyle1]}>
                {/* <View style={[styles.view9, styles.width_full]}></View> */}
                {/* <Text>{search}</Text> */}
                <FlashList
                    data={userArray}
                    renderItem={({ item }) =>
                        <CustomChat
                            chatObject={item}
                            chatStatus={item.chat_status_id}
                            userStatus={item.user_status}
                            profilePath={item.profile_uploaded ? NGROK_URL + "/Vlinx/ProfileImages/" + item.mobile + ".jpg" : require('../assets/images/profile-default.png')}
                            name={item.name}
                            msgDisplay={false}
                            dateDisplay={false}
                            checkVisible={false}
                            msgCountVisible={false}
                            msgCount={item.unseenCount}
                            textDark={false}
                            countViewColor={"#ffffff"}
                            user={user}



                        />
                    }
                    estimatedItemSize={200}
                />
            </Animated.View>
        </View>
    );
}

function Profile({ navigation }) {

    const [user, setUser] = useState(null);
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [profile, setProfile] = useState(null);

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
        if (profile) {
            console.log("Profile image state updated: ", profile);
            updateUser();
        }
    }, []);



    useEffect(() => {
        // fetchProfilePic();
        // toggleViewUp();
        setTimeout(() => {
            slideScaleUp();
        }, 200);
    }, []);

    const handleImagePick = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Ensure we are only picking images
            });

            if (!result.canceled) {
                const selectedImageUri = result.assets[0].uri;
                console.log("Selected image URI: ", selectedImageUri);
                setProfile(selectedImageUri);
            } else {
                console.log("Image selection was canceled");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick image");
        }
    };


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
    function toggleViewDown() {
        translateY1.value = withTiming(1000, { duration: 800 });

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

    const updateUser = async () => {
        const dataForm = new FormData();
        dataForm.append("firstName", fname);
        dataForm.append("lastName", lname);
        dataForm.append("password", password);
        dataForm.append("mobile", mobile);


        if (profile != null) {
            dataForm.append("profileImage", {
                name: "profile",
                type: "image/jpg",
                uri: profile,
            });
        }


        const response = await fetch(NGROK_URL + "/Vlinx/UpdateUser", {
            method: "POST",
            body: dataForm,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.ok) {
            const json = await response.json();
            // console.log(json.message);
            if (json.success) {
                let user = JSON.stringify(json.message);
                await AsyncStorage.removeItem("user");
                await AsyncStorage.setItem("user", user);
                fetchProfilePic();
            }

        } else {
            Alert.alert("Error", "Server Error");
        }

    }

    useEffect(() => {
        const chatFocus = navigation.addListener('focus', () => {
            fetchProfilePic();
            toggleViewUp();
            slideScaleUp();

        });

        const chatBlur = navigation.addListener('blur', () => {
            toggleViewDown();
            slideScaleDown();
        });

        return () => {
            chatBlur();
            chatFocus();
        };
    }, [navigation]);





    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }



    return (
        <View style={styles2.view1}>
            {/* <Reload state={getReloadState} /> */}
            <StatusBar hidden={true} />
            <Image contentFit="cover" source={backgroundPath} style={styles2.image1}></Image>
            {/* hEADER */}
            <View style={styles2.view5}>
                <Pressable style={[styles2.view3, styles2.alignSelf_Start]} onPress={() => {
                    slideScaleDown();
                    setTimeout(() => {
                        router.push('/home');
                    }, 100);
                }}>
                    <FontAwesome6 name="arrow-left-long" size={20} color={"white"} />
                </Pressable>
                <View style={styles2.view6}>
                    <Animated.View style={[profileSlide]}>
                        {
                            profile == null ?
                                <Image source={require('../assets/images/profile-default.png')} style={styles2.image7}></Image>
                                :
                                <Image source={profile} style={[styles2.image7]}></Image>
                        }
                    </Animated.View>
                    <Pressable style={styles2.view7} onPress={handleImagePick}>
                        <FontAwesome6 name="pen" size={15} color={"#000000"} />
                    </Pressable>
                </View>
                <Text style={styles2.text4}>{fname + " " + lname}</Text>
                <View style={styles2.view22}>
                    <Pressable style={[styles2.view3, styles2.translucent_color]} onPress={() => {
                        navigation.navigate('Chats');
                    }}>
                        <FontAwesome6 name="message" size={18} color={"white"} />
                    </Pressable>
                    <View style={[styles2.view3, styles2.translucent_color]}>
                        <FontAwesome6 name="camera" size={18} color={"white"} />
                    </View>
                    <View style={[styles2.view3, styles2.translucent_color]}>
                        <FontAwesome6 name="phone" size={18} color={"white"} />
                    </View>
                    <View style={[styles2.view3, styles2.translucent_color]}>
                        <FontAwesome6 name="ellipsis-vertical" size={18} color={"white"} />
                    </View>
                </View>
            </View>
            {/* hEADER */}
            <Animated.View style={[styles2.view8, animatedStyle1]}>
                <View style={[styles2.view4, styles2.width_small]}></View>
                <ScrollView>
                    <View style={styles2.view2}>
                        <Text style={styles2.text1}>First Name</Text>
                        <TextInput style={styles2.input1} value={fname} inputMode="text" onChangeText={setFname} onEndEditing={updateUser} />
                    </View>
                    <View style={styles2.view2}>
                        <Text style={styles2.text1}>Last Name</Text>
                        <TextInput style={styles2.input1} inputMode="text" value={lname} onChangeText={setLname} onEndEditing={updateUser} />
                    </View>
                    <View style={styles2.view2}>
                        <Text style={styles2.text1}>Phone Number</Text>
                        <TextInput style={styles2.input1} value={mobile} maxLength={10} inputMode="tel" />
                    </View>
                    <View style={styles2.view2}>
                        <Text style={styles2.text1}>Password</Text>
                        <TextInput style={styles2.input1} secureTextEntry={true} value={password} onChangeText={setPassword} onEndEditing={updateUser} />
                    </View>
                </ScrollView>

            </Animated.View>
        </View>
    );
}
const styles2 = StyleSheet.create({
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


const Tab = createBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Messages") {
                        iconName = focused ? "house" : "house";
                    } else if (route.name === "Calls") {
                        iconName = focused ? "phone-volume" : "phone";

                    } else if (route.name === "Add") {
                        return (<Image source={require('../assets/icons/plus-solid.svg')} style={styles.image6}></Image>)

                    } else if (route.name === "Search") {
                        iconName = focused ? "magnifying-glass" : "magnifying-glass";

                    } else if (route.name === "Profile") {
                        iconName = focused ? "user" : "user";

                    }
                    return (<FontAwesome6 name={iconName} size={size} color={color} />)
                },
                header: () => {
                    return (
                        null
                    )
                },
                tabBarActiveTintColor: '#561D1D',
                tabBarInactiveTintColor: '#8A91A8',
                tabBarStyle: {
                    height: 100,
                    paddingBottom: 20,
                    paddingTop: 20,
                    backgroundColor: '#ffffff',
                    borderColor: '#ffffff',

                },
            })
            }>

            <Tab.Screen name="Messages" component={Chats}></Tab.Screen>
            <Tab.Screen name="Calls" component={Calls}></Tab.Screen>
            <Tab.Screen name="Add" component={Add}></Tab.Screen>
            <Tab.Screen name="Search" component={Search} options={{
                tabBarStyle: {
                    display: 'none',
                }
            }}></Tab.Screen>
            <Tab.Screen name="Profile" component={Profile} options={{
                tabBarStyle: {
                    display: 'none',
                }
            }}></Tab.Screen>

        </Tab.Navigator>
    );
}

export default function Home() {
    return (
        <>
            <StatusBar hidden={true} />
            <NavigationContainer independent={true}>
                <Tabs />
            </NavigationContainer>

        </>
    );
}



