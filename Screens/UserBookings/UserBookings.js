import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import globalStyles from '../../globalStyles';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HostName } from '../../utils/consts';
import { useFocusEffect } from '@react-navigation/native';

const UserBookings = ({ navigation }) => {
    const [bookings, setBookings] = useState([]);

    useFocusEffect(
        useCallback(() => {
            getUserBookings();
        }, [])
    )

    const getUserBookings = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}product-services/get-user-bookings`, {
                method: "GET",
                headers: {
                    'Authorization': `${jwtToken}`
                }
            });
            const data = await response.json();
            if (data.bookings) {
                setBookings(data.bookings)
                console.log(data.bookings)
            } else {
                setBookings(data.message);
            }
        } catch (error) {
            Alert.alert("Failed to fetch!", `${error.message}`);
        }
    }
    const handleCancelBooking = async (bookingId) => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}product-services/bookings/cancel/${bookingId}`, {
                method: "POST",
                headers: {
                    'Authorization': `${jwtToken}`
                }
            });
    
            const data = await response.json();
            const message = typeof data.message === 'object' ? JSON.stringify(data.message) : data.message;
    
            if (message) {
                Alert.alert("Success!", message);
            }
            setBookings(bookings.map(booking => booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking));
        } catch (error) {
            Alert.alert("Error canceling booking!", error.message || error);
        }
    };

    const confirmCancelBooking = (bookingId) => {
        Alert.alert(
            "Cancel Booking",
            "Do you really want to cancel this booking?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => handleCancelBooking(bookingId)
                }
            ]
        );
    }; 

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={globalStyles.headerPinkSmall}>
                    <View style={globalStyles.headerRowOne}>
                        <Text style={globalStyles.heading3}>My Current Bookings</Text>
                    </View>
                </View>
                <View style={styles.innerContainer}>
                    {
                        Array.isArray(bookings) && bookings.length !== 0 ?
                            bookings.map((item, index) => (
                                <View style={styles.itemContainer} key={index}>
                                    <Text style={styles.itemUser}>User: {item.buyerId.name}</Text>
                                    <Text style={styles.itemService}>Service: {item.title}</Text>
                                    <Text style={styles.itemDate}>Date: {item.date}</Text>
                                    <Text style={styles.itemPrice}>Price Paid: {item.pricePaid}</Text>
                                    <Text style={styles.itemContact}>Contact: {item.contact}</Text>
                                    <Text style={styles.itemContact}>Status: {item.status}</Text>
                                    {
                                        item.status !== "completed" && item.status !== "cancelled" ?
                                            <View style={styles.buttonRow}>
                                                <TouchableOpacity
                                                    style={[styles.button, styles.cancelButton]}
                                                    onPress={() => confirmCancelBooking(item._id)}
                                                >
                                                    <Text style={styles.buttonText}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            null
                                    }
                                </View>
                            ))
                            :
                            <Text style={globalStyles.textCenter}>{bookings}</Text>
                    }
                </View>
            </View>
        </ScrollView>
    );
};

export default UserBookings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    innerContainer: {
        marginTop: -20,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 20
    },
    itemContainer: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    itemUser: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemService: {
        fontSize: 14,
        marginBottom: 5,
    },
    itemDate: {
        fontSize: 14,
        marginBottom: 5,
    },
    itemTime: {
        fontSize: 14,
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 14,
        color: '#f08080',
        marginBottom: 5,
    },
    itemContact: {
        fontSize: 14,
        color: '#555',
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 5
    },
    completeButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
