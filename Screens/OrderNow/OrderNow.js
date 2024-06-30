import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import CustomButton from '../../components/CutomButton';
import globalStyles from '../../globalStyles';
import { HostName } from '../../utils/consts'; // Import your HostName constant
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const OrderNowPage = ({ navigation, route }) => {
    const { productId, setStripeKey } = route.params;
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    useEffect(() => {

        const fetchProduct = async () => {
            try {
                const jwtToken = await AsyncStorage.getItem("jwtToken");
                const response = await fetch(`${HostName}product-services/product/${productId}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `${jwtToken}`
                    }
                });
                const data = await response.json();
                if (data.eventService) {
                    setProduct(data.eventService);
                    setStripeKey(data.eventService.paymentPublicKey)
                } else {
                    Alert.alert("Failed to fetch product details!");
                }
            } catch (error) {
                Alert.alert("Failed to fetch!", `${error.message}`);
                console.log(error);
            }
        };

        fetchProduct();
    }, [productId]);

    // const handlePayment = async () => {

    //     if (!product || !date || !quantity) {
    //         Alert.alert("Alert!", "Date field is required");
    //         return;
    //     }
    //     try {
    //         const jwtToken = await AsyncStorage.getItem("jwtToken");
    //         const response = await fetch(`${HostName}product-services/make-payment/${productId}`, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `${jwtToken}`
    //             },
    //             method: "POST",
    //             body: JSON.stringify({
    //                 amount: product.price * quantity,
    //                 date: date.toISOString(),
    //                 quantity: quantity
    //             })
    //         });
    //         const data = await response.json();
    //         if (data.message) {
    //             Alert.alert("Alert!", data.message);
    //             return;
    //         }

    //         const initResponse = await initPaymentSheet({
    //             merchantDisplayName: "Lets Celebrate",
    //             paymentIntentClientSecret: data.paymentIntent
    //         })
    //         if (initResponse.error) {
    //             console.log(initResponse.error)
    //             Alert.alert("Something went wrong!");
    //             return;
    //         }
    //         const paymentReponse = await presentPaymentSheet();
    //         if (paymentReponse.error) {
    //             Alert.alert(`Error code: ${paymentReponse.error.code}`, paymentReponse.error.message);
    //             return;
    //         }
    //         else {
    //             Alert("Alert!", `Your Event Place/Service has been booked for ${product.price * quantity} on ${date}`)
    //         }
    //     } catch (error) {
    //         console.log("The error log", error);
    //         Alert.alert('Payment failed!', "Some unknown error occured");
    //     }
    // };
    
    const handlePayment = async () => {
        if (!product || !date || !quantity) {
            Alert.alert("Alert!", "Date field is required");
            return;
        }
    
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}product-services/make-payment/${productId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwtToken}`
                },
                method: "POST",
                body: JSON.stringify({
                    amount: product.price * quantity,
                    date: date.toISOString(),
                    quantity: quantity
                })
            });
            const data = await response.json();
            if (data.message) {
                Alert.alert("Alert!", data.message);
                return;
            }
    
            const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: data.paymentIntent,
                merchantDisplayName: "Lets Celebrate",
            });
            if (initError) {
                console.log(initError);
                Alert.alert("Something went wrong initializing payment sheet!");
                return;
            }
    
            const { error: presentError } = await presentPaymentSheet();
            if (presentError) {
                Alert.alert(`Error code: ${presentError.code}`, presentError.message);
                return;
            }
            else {
                const response = await fetch(`${HostName}product-services/book-service/${productId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${jwtToken}`
                    },
                    method: "POST",
                    body: JSON.stringify({
                        amount: product.price * quantity,
                        date: date.toISOString(),
                        quantity: quantity
                    })
                });
                const data = await response.json();
                if (data.message) {
                    Alert.alert("Success!", `Your Event Place/Service has been booked for ${product.price * quantity} on ${date}`);
                    navigation.navigate("Home");
                    return;
                } else {
                    Alert.alert("Error occured!", "Some unknown error occcured");
                }
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Payment failed!', "Some unknown error occurred");
        }
    };
    
    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleQuantityChange = (value) => {
        const intValue = parseInt(value, 10);
        if (!isNaN(intValue) && intValue > 0) {
            setQuantity(intValue);
        } else {
            setQuantity(1);
        }
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    const onChangeTime = (event, selectedTime) => {
        const currentTime = selectedTime || date;
        setShowTimePicker(false);
        setDate(currentTime);
    };

    return (
        <View style={styles.container}>
            <View style={globalStyles.headerPinkSmall}>
                <View style={globalStyles.headerRowOne}>
                    <Text style={globalStyles.heading3}>Order</Text>
                </View>
            </View>
            {product ? (
                <View style={styles.cartContainer}>
                    <View style={styles.itemContainer}>
                        <Image source={{ uri: `data:image/jpeg;base64,${product.image}` }} style={styles.image} />
                        <View style={styles.detailsContainer}>
                            <Text style={styles.heading}>{product.title}</Text>
                            <Text style={styles.description}>{product.description}</Text>
                            <Text style={styles.price}>Price: {product.price}</Text>
                        </View>
                    </View>
                    {
                        product.category === "Event Place" &&
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity style={styles.btnQuantity} onPress={decreaseQuantity}>
                                <Text>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.quantityInput}
                                value={quantity.toString()}
                                onChangeText={handleQuantityChange}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={styles.btnQuantity} onPress={increaseQuantity}>
                                <Text>+</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    <View>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimePicker}>
                            <Text>Select Date: {date.toDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}
                        {/* <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimePicker}>
                            <Text>Select Time: {date.toLocaleTimeString()}</Text>
                        </TouchableOpacity>
                        {showTimePicker && (
                            <DateTimePicker
                                value={date}
                                mode="time"
                                display="default"
                                onChange={onChangeTime}
                            />
                        )} */}
                    </View>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total: {product.price * quantity} /Rs.</Text>
                    </View>
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
            <CustomButton
                color="#fff"
                backgroundColor="#f08080"
                width="100%"
                height={50}
                borderRadius={10}
                onPress={handlePayment}
            >
                <Text>Proceed to Pay</Text>
            </CustomButton>
        </View>
    );
};

const styles = StyleSheet.create({
    btnQuantity: {
        backgroundColor: "#f08080",
        width: 50,
        height: 40,
        borderRadius: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    cartContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        marginTop: -20,
        marginBottom: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 10,
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    price: {
        fontSize: 14,
        color: '#f08080',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
    },
    cardContainer: {
        height: 50,
        marginVertical: 30,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    quantityInput: {
        width: 80,
        height: 40,
        borderColor: '#ccc',
        borderRadius: 10,
        borderWidth: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateTimePicker: {
        marginVertical: 10,
        padding: 10,
        borderColor: '#ccc',
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center'
    }
});

export default OrderNowPage;
