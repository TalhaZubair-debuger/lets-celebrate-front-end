import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import globalStyles from '../../globalStyles'
import CustomButton from '../../components/CutomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Flatlist from "../../utils/Flatlist";
import { HostName } from '../../utils/consts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const UserHome = ({ navigation }) => {
    const [searchTerm, SetSearchTerm] = useState("");
    const [eventPlaces, setEventPlaces] = useState([]);
    const [topServices, setTopServices] = useState([]);
    const [user, setUser] = useState({});

    useFocusEffect(
        useCallback(() => {
            getTopEventPlaces();
            getTopServices();
            getUser();
        }, [])
    )

    const getTopEventPlaces = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}product-services/top-eventplaces`, {
                method: "GET",
                headers: {
                    'Authorization': `${jwtToken}`
                }
            });
            const data = await response.json();
            if (data.eventPlaces) {
                setEventPlaces(data.eventPlaces)
            } else {
                setEventPlaces(data.message);
            }
        } catch (error) {
            Alert.alert("Failed to fetch!", `${error.message}`);
            console.log(error);
        }
    }

    const getTopServices = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}product-services/top-services`, {
                method: "GET",
                headers: {
                    'Authorization': `${jwtToken}`
                }
            });
            const data = await response.json();
            if (data.topServices.length) {
                setTopServices(data.topServices)
            } else {
                console.log(data);
                setTopServices(data.message);
            }
        } catch (error) {
            Alert.alert("Failed to fetch!", `${error.message}`);
            console.log(error);
        }
    }

    const getUser = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}users/get-user`, {
                method: "GET",
                headers: {
                    'Authorization': `${jwtToken}`
                }
            });
            const data = await response.json();
            if (data.user) {
                setUser(data.user)
            }
        } catch (error) {
            Alert.alert("Failed to fetch!", `${error.message}`);
            console.log(error);
        }
    }

    const categoriesData = [
        {
            id: 1,
            name: "castle",
            text: "Event Place"
        },
        {
            id: 2,
            name: "restaurant",
            text: "Catering"
        },
        {
            id: 3,
            name: "celebration",
            text: "Fireworks"
        },
        {
            id: 4,
            name: "spa",
            text: "Flower Decorators"
        },
        {
            id: 5,
            name: "camera",
            text: "Photographer"
        }
    ]

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("jwtToken");
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert("Failed to logout!", `${error.message}`);
            console.log(error);
        }
    };
    return (
        <ScrollView>
            <View style={globalStyles.bodyCenterColumn}>
                {/* Header Section */}
                <View style={globalStyles.headerPink}>
                    <View style={globalStyles.headerRowOne}>
                        <View style={styles.headerRow}>
                            <Text style={globalStyles.heading3}>Hi {user ? user.name : "User"}!</Text>
                            <TouchableOpacity onPress={handleLogout}>
                                <Text style={styles.logoutText}>
                                    <Icon name="logout" size={25} color="#000" />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.width100, styles.bgcWhite]}>
                        <TextInput
                            placeholder="Search event places, service providers..."
                            style={globalStyles.textInputBorderless}
                            value={searchTerm}
                            onChangeText={(newValue) => SetSearchTerm(newValue)}
                        />
                        <CustomButton
                            color="#f08080"// Light pink
                            backgroundColor="#fff"
                            width="20%"
                            height={40}
                            borderRadius={10}
                            onPress={() => { navigation.navigate("Search", { SearchTerm: searchTerm }) }}
                        >
                            <Icon name="send" size={20} color="#f08080" /> {/* Material search icon */}
                        </CustomButton>
                    </View>
                </View>

                {/* Categories Section */}
                <View style={globalStyles.canvasFullM10}>
                    <View>
                        <Text style={[globalStyles.heading3, styles.m10]}>Categories</Text>
                    </View>

                    <View style={styles.container}>
                        {categoriesData.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => navigation.navigate("Search", { Category: item.text })}
                                style={styles.card}
                            >
                                <Text>
                                    <Icon name={`${item.name}`} size={25} color="#f08080" />
                                </Text>
                                <Text style={globalStyles.textCenter}>
                                    {item.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={[globalStyles.canvasFull, {marginHorizontal: 10, width: "95%"}]}>
                    <CustomButton
                        color="#fff"// Light pink
                        backgroundColor="#f08080"
                        width="100%"
                        height={50}
                        borderRadius={10}
                        onPress={() => { navigation.navigate("User Bookings") }}
                    >
                        My Current Bookings
                    </CustomButton>
                </View>

                {/* Top Selling Services */}
                <View style={globalStyles.canvasFull}>
                    <View>
                        <Text style={[globalStyles.heading3, styles.m10]}>Best Event Places</Text>
                    </View>

                    {
                        eventPlaces || eventPlaces.length  || eventPlaces == undefined ?
                            Array.isArray(eventPlaces) && eventPlaces.length !== 0 ?
                                eventPlaces.map((item, index) => (
                                    <Flatlist
                                        image={item.image}
                                        heading={item.title}
                                        description={item.description}
                                        price={item.price}
                                        productId={item._id}
                                        key={index}
                                        navigation={navigation}
                                    />
                                ))
                                :
                                <Text>{eventPlaces}</Text>
                            :
                            null
                    }
                </View>

                {/* Top Selling Services */}
                <View style={globalStyles.canvasFull}>
                    <View>
                        <Text style={[globalStyles.heading3, styles.m10]}>Best Services</Text>
                    </View>

                    {
                        topServices && topServices.length ?
                            Array.isArray(topServices) && topServices.length !== 0 ?
                                topServices.map((item, index) => (
                                    <Flatlist
                                        image={item.image}
                                        heading={item.title}
                                        description={item.description}
                                        productId={item._id}
                                        price={item.price}
                                        key={index}
                                        navigation={navigation}
                                    />
                                ))
                                :
                                <Text>{topServices}</Text>
                            :
                            <Text>{topServices}</Text>
                    }
                </View>
            </View>
        </ScrollView>
    )
}

export default UserHome

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
    },
    m10: {
        margin: 10
    },
    bgcWhite: {
        backgroundColor: "#fff"
    },
    width100: {
        width: "90%",
        marginHorizontal: "auto",
        marginBottom: 10,
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "row",
        borderRadius: 10,
        flex: 1
    },
    grid: {
        // flex: 1,
        justifyContent: "space-evenly",
        alignItems: "flex-end",
        alignContent: "center",
        width: "100%",
        paddingVertical: 10
    },
    card: {
        width: "30%",
        height: 75,
        borderRadius: 10,
        borderColor: "lightgrey",
        borderWidth: 1,
        // padding: 5,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "5px 5px",
        elevation: 5,
        shadowColor: "#000",
        backgroundColor: "white",
        margin: 5
    },
    topSellingContainer: {
        marginTop: 10,
        marginBottom: 10,
        height: 210
    }
})