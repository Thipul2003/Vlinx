import { useFonts } from "expo-font";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from "expo-image";
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { FlashList } from "@shopify/flash-list";
import { NGROK_URL } from './Constants';

const backgroundPath = require('../assets/images/background2.png');

export default function Home() {

    const [getChatArray, setChatArray] = useState([]);
    const [profile, setProfile] = useState("");
    const [sendIcon, setSendIcon] = useState("microphone");
    const [message, setMessage] = useState("");

    const flashListRef = useRef(null);  // Create ref for FlashList
    const intervalRef = useRef(null);  // Ref to store the interval

    const local = useLocalSearchParams();
    const other_user_chat = JSON.parse(local.chatObject);
    const logged_user = JSON.parse(local.user);

    const [loaded, error] = useFonts({
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    useEffect(() => {
        async function fetchProfilePic() {
            const imagePath = NGROK_URL + "/Vlinx/ProfileImages/" + other_user_chat.mobile + ".jpg";
            const response = await fetch(imagePath);

            if (response.ok) {
                setProfile(imagePath);
            } else {
                setProfile(null);
            }
        }
        fetchProfilePic();
    }, []);

    const fetchChatData = async () => {
        const response = await fetch(NGROK_URL + "/Vlinx/LoadChat?logged_user_id=" + logged_user.id + "&other_user_id=" + other_user_chat.id);

        if (response.ok) {
            const json = await response.json();

            if (json.empty) {

            } else {
                setChatArray(json.chatArray);

                if (flashListRef.current) {
                    flashListRef.current.scrollToEnd({ animated: true });
                }
            }
        } else {
            Alert.alert("Error", "Server Error");
        }
    };

    useEffect(() => {
        fetchChatData();

        intervalRef.current = setInterval(() => {
            fetchChatData();
        }, 500);

        // Cleanup function to clear interval when component unmounts or navigates away
        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    const handleChatSend = async () => {
        const response = await fetch(NGROK_URL + "/Vlinx/SendChat?logged_user_id=" + logged_user.id + "&other_user_id=" + other_user_chat.id + "&message=" + message);

        if (response.ok) {
            const json = await response.json();
            if (json.message) {
                setMessage("");
                setChatArray([...getChatArray], { message, side: "right", date_time: "now", status: 1 });  // Update chatArray with new message

                // Scroll to the bottom after new message is added
                if (flashListRef.current) {
                    flashListRef.current.scrollToEnd({ animated: true });
                }
            }
        } else {
            Alert.alert("Error", "Server Error");
        }
    };

    const handleBack = () => {
        clearInterval(intervalRef.current);
        router.back();  // Navigate back
    };

    return (
        <View style={styles.view1}>
            <StatusBar hidden={true} />
            <Image source={backgroundPath} style={styles.image1}></Image>

            <View style={styles.view2}>
                <Pressable style={styles.view3} onPress={handleBack}>
                    <FontAwesome6 name="arrow-left" size={20} color={"white"} />
                </Pressable>

                <View style={styles.view4}>
                    <View style={[styles.view15, other_user_chat.user_status == 1 ? null : styles.border]}>
                        {
                            profile == null ?
                                <Image source={require('../assets/images/profile-default.png')} style={styles.image4}></Image>
                                :
                                <Image source={profile} style={styles.image4}></Image>
                        }
                    </View>
                    <View style={styles.view10}>
                        <Text style={styles.text1}>{other_user_chat.name}</Text>
                        <Text style={[styles.text2, other_user_chat.user_status == 1 ? null : styles.light_grey]}>{other_user_chat.user_status == 1 ? "Online" : "Offline"}</Text>
                    </View>
                </View>

                <Pressable style={styles.view3} onPress={() => {
                    Alert.alert("Success", "Options Menu");
                }}>
                    <FontAwesome6 name="ellipsis-vertical" size={20} color={"white"} />
                </Pressable>
            </View>



            <View style={styles.view14}>
                <FlashList
                    ref={flashListRef}  // Attach ref to FlashList
                    data={getChatArray}
                    renderItem={({ item }) =>
                        <View style={styles.view12}>
                            <View style={[styles.view13, item.side == "right" ? styles.from_chat : styles.to_chat]}>
                                <Text style={styles.text4}>{item.message}</Text>
                            </View>
                            <View style={[styles.view16, item.side == "right" ? styles.left : styles.right]}>
                                <Text style={styles.text5}>{item.date_time}</Text>
                                {
                                    item.side == "right" ?
                                        item.status == 1 ?
                                            <Image source={require('../assets/icons/ph_checks-fill.svg')} style={styles.image2}></Image>
                                            :
                                            <Image source={require('../assets/icons/ph_checks-fill-blue.svg')} style={styles.image2}></Image>
                                        :
                                        null
                                }
                            </View>
                        </View>
                    }
                    estimatedItemSize={200}
                />
            </View>





            <View style={styles.view5}>
                <TextInput
                    style={styles.input1}
                    value={message}
                    onChangeText={(text) => {
                        if (text.length === 0) {
                            setSendIcon("microphone");
                        } else {
                            setSendIcon("paper-plane");

                        }
                        setMessage(text);

                    }}
                    placeholderTextColor={"#000000"}
                    placeholder="Type Message"
                />

                <View style={[styles.view11, styles.start]}>
                    <FontAwesome6 name="plus" size={20} color={"#000000"} />
                </View>

                <Pressable style={[styles.view11, styles.end]} onPress={handleChatSend}>
                    <FontAwesome6 name={sendIcon} size={20} color={"#000000"} />
                </Pressable>

                <View style={styles.view9}></View>
            </View>
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
        alignItems: 'center',
        columnGap: 10,
        paddingVertical: 35,
    },
    view3: {
        width: 40,
        paddingHorizontal: 10,

    },
    image4: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    text1: {
        fontSize: 16,
        fontFamily: 'Inter-Bold',
        color: '#ffffff',
    },
    text2: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: '#ffffff',
    },
    view4: {
        flexDirection: 'row',
        flex: 1,
    },
    view5: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        columnGap: 30,
        paddingVertical: 15,
        justifyContent: 'center',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 10,
        position: 'relative',

    },
    input1: {
        width: '100%',
        height: 64,
        borderWidth: 1,
        borderColor: '#E5E6E9',
        borderRadius: 50,
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        color: '#000000',
        position: 'relative',
        paddingHorizontal: 75,
    },
    view11: {
        width: 38,
        height: 38,
        backgroundColor: '#FFCB45',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        borderRadius: 19,
    },
    start: {
        left: 30,
        bottom: '50%',
    },
    end: {
        bottom: '50%',
        right: 30,
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
    view10: {
        justifyContent: 'center',
        marginHorizontal: 15,
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
    // view8: {
    //     marginTop: 18,
    //     paddingBottom: 50,
    // },
    view9: {
        width: 1,
        height: 35,
        backgroundColor: '#E5E6E9',
        position: 'absolute',
        right: 80,
        bottom: '50%',


    },
    view14: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginBottom: -50,
        borderRadius: 50,
        paddingTop: 20,
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
    },
    border: {
        borderWidth: 0,
    },
    view12: {
        paddingHorizontal: 20,
    },

    view16: {
        flexDirection: 'row',
        columnGap: 10,
        marginVertical: 8,
    },
    text4: {
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        color: '#000000',
    },
    text5: {
        fontSize: 12,
        color: '#8A91A8',
        fontFamily: 'Inter-Regular',
    },
    image2: {
        width: 18,
        height: 18,
    },
    view13: {
        paddingVertical: 16,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 25,
    },
    from_chat: {
        backgroundColor: '#ffe1cc',
        alignSelf: 'flex-end',

    },
    to_chat: {
        backgroundColor: '#fef0bf',
        alignSelf: 'flex-start',
    },
    right: {
        alignSelf: 'flex-start',
    },
    left: {
        alignSelf: 'flex-end',
    },
    light_grey: {
        color: '#d9d9d98a',
    }

});