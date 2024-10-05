import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from "expo-image";
import { Link, router, useFocusEffect } from 'expo-router';
import { CustomChat } from "../components/CustomChat";
import { CustomSelector } from "../components/CustomSelector";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NGROK_URL } from './Constants';
import { FlashList } from "@shopify/flash-list";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, } from 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Reload } from "../components/reload";

const backgroundPath = require('../assets/images/background2.png');

function Chats({ navigation }) {

    const [getChatArray, setChatArray] = useState([]);
    const [name, setName] = useState("");
    const [profile, setProfile] = useState("");
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

        if (user == null) {
            router.replace("/signin");
        } else {
            setReloadState(true);
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
        // }, 5000);

        return () => {
            clearInterval(intervalRef.current);
        };

    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
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
                <View style={styles.view3}>
                    <FontAwesome6 name="magnifying-glass" size={20} color={"white"} />
                </View>
                <View style={styles.view4}>
                    <Text style={styles.text1}>Welcome, </Text>
                    <Text style={styles.text2}>{name}</Text>
                    <Image source={require('../assets/icons/peace.svg')} style={styles.image3}></Image>
                </View>
                <View style={styles.view15}>
                    {
                        profile == null ?
                            <Image source={require('../assets/images/profile-default.png')} style={styles.image4}></Image>
                            :
                            <Image source={profile} style={styles.image4}></Image>
                    }
                </View>

            </View>
            {/* hEADER */}

            <Animated.View style={[styles.view14, animatedStyle1]}>
                <View style={styles.view9}></View>
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


function Calls({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Calls!</Text>
        </View>
    );
}


function Add({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="logout" onPress={async () => {
                await AsyncStorage.removeItem("user");
                router.replace('/signin');
            }}>Adds!</Button>
        </View>
    );
}



function Search() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Search!</Text>
        </View>
    );
}

function Profile() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Profile!</Text>
        </View>
    );
}
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

            <Tab.Screen name="Messages" component={Chats} options={{ tabBarBadge: 3 }}></Tab.Screen>
            <Tab.Screen name="Calls" component={Calls}></Tab.Screen>
            <Tab.Screen name="Add" component={Add}></Tab.Screen>
            <Tab.Screen name="Search" component={Search}></Tab.Screen>
            <Tab.Screen name="Profile" component={Profile}></Tab.Screen>

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
        width: 109,
        height: 5,
        position: 'absolute',
        top: 15,
        alignSelf: 'center',

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

});