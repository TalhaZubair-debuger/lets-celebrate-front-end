import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Button, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import globalStyles from '../../globalStyles';
import CustomButton from "../../components/CutomButton.js";
import { HostName } from '../../utils/consts.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: screenWidth } = Dimensions.get('window');

const SellerHomePage = ({ navigation }) => {
    const [eventPlaces, setEventPlaces] = useState([]);
    const [services, setServices] = useState([])
    const [user, setUser] = useState([])

    useFocusEffect(
        useCallback(() => {
            getMyPlaces();
            getMyServices()
            getUser()
        }, [])
    )

    const getMyPlaces = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}product-services/my-eventplaces`, {
                method: "GET",
                headers: {
                    'Authorization': `${jwtToken}`
                }
            });
            const data = await response.json();
            if (data.eventService) {
                setEventPlaces(data.eventService)
            } else {
                setEventPlaces(data.message);
            }
        } catch (error) {
            Alert.alert("Failed to fetch!", `${error.message}`);
            console.log(error);
        }
    }

    const getMyServices = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}product-services/my-services`, {
                method: "GET",
                headers: {
                    'Authorization': `${jwtToken}`
                }
            });
            console.log(response);
            const data = await response.json();
            if (data.services) {
                setServices(data.services)
            } else {
                setServices(data.message);
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

    const handleAddNew = () => {
        // Implement navigation to the add new event place/service screen
        navigation.navigate('Add Product');
    };

    const handleShowBookings = () => {
        // Implement navigation to the current bookings screen
        navigation.navigate('Current Bookings');
    };

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
            <View style={styles.container}>
                <View style={globalStyles.headerPinkSmall}>
                    <View style={styles.headerRow}>
                        <Text style={globalStyles.heading3}>Hi {user ? user.name : "Owner"}!</Text>
                        <TouchableOpacity onPress={handleLogout}>
                            <Text style={styles.logoutText}>
                                <Icon name="logout" size={25} color="#000" />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Image
                    source={{ uri: 'https://t4.ftcdn.net/jpg/02/16/94/65/360_F_216946587_rmug8FCNgpDCPQlstiCJ0CAXJ2sqPRU7.jpg' }}
                    style={styles.image}
                />

                <View style={styles.buttonContainer}>

                    <CustomButton
                        color="#fff"
                        backgroundColor="#f08080"
                        width="100%"
                        height={50}
                        borderRadius={10}
                        onPress={handleAddNew}
                    >
                        <Text>Add New Event Place/Service</Text>
                    </CustomButton>
                    <CustomButton
                        color="#fff"
                        backgroundColor="#f08080"
                        width="100%"
                        height={50}
                        borderRadius={10}
                        onPress={handleShowBookings}
                    >
                        <Text>Show Current Bookings</Text>
                    </CustomButton>
                </View>

                <Text style={styles.sectionTitle}>Your Event Places</Text>
                {
                    Array.isArray(eventPlaces) ?
                        eventPlaces.map((item, index) => (
                            <View style={styles.itemContainer} key={index}>
                                <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={styles.itemImage} />
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                    <Text style={styles.itemPrice}>Price: {item.price}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => navigation.navigate('Edit Product', { productId: item._id })}
                                >
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                        :
                        <Text style={globalStyles.textCenter}>{eventPlaces}</Text>
                }

                <Text style={styles.sectionTitle}>Your Services</Text>
                {
                    Array.isArray(services) ?
                        services.map((item, index) => (
                            <View style={styles.itemContainer} key={index}>
                                <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={styles.itemImage} />
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDescription}>{item.description}</Text>
                                    <Text style={styles.itemPrice}>Price: {item.price}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => navigation.navigate('Edit Product', { productId: item._id })}
                                >
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                        :
                        <Text style={globalStyles.textCenter}>{services}</Text>
                }
            </View>
        </ScrollView>
    );
};

export default SellerHomePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    header: {
        width: '100%',
        padding: 20,
        backgroundColor: '#f08080',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    image: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "stretch",
        marginBottom: 20,
        height: 130,
        padding: 10
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: "center",
        margin: 10
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
    },
    itemPrice: {
        fontSize: 14,
        color: '#f08080',
    },
    editButton: {
        backgroundColor: '#f08080',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
