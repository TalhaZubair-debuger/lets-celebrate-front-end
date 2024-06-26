import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import globalStyles from '../../globalStyles';
import CustomButton from '../../components/CutomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Cart = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([
        {
            id: '1',
            image: 'https://shadiyana-vendor-images.s3.ap-south-1.amazonaws.com/venues/lahore/QasareNoor/241174895_4312816498811267_5835051342209719409_n.webp',
            heading: 'Qaisr e Noor',
            description: 'This is a description for item 1',
            price: '120,000',
        },
        {
            id: '2',
            image: 'https://shaadinama.pk/wp-content/uploads/listing-uploads/gallery/2023/01/274665946_714733276576776_3564763885276933799_n.jpg',
            heading: 'Bel Avenir',
            description: 'This is a description for item 2',
            price: '4200',
        },
    ]);

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const proceedToOrder = () => {
        // Navigate to order page
        navigation.navigate('OrderNow');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={globalStyles.headerPinkSmall}>
                <View style={globalStyles.headerRowOne}>
                    <Text style={globalStyles.heading3}>My Cart</Text>
                </View>
            </View>

            <View style={styles.cartContainer}>
                {
                    cartItems?.length ?
                        cartItems.map((item, index) => (
                            <View style={styles.cartItem} key={index}>
                                <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                                <View style={styles.cartItemDetails}>
                                    <Text style={styles.cartItemHeading}>{item.heading}</Text>
                                    <Text style={styles.cartItemDescription}>{item.description}</Text>
                                    <Text style={styles.cartItemPrice}>Price: {item.price}</Text>
                                </View>
                                <TouchableOpacity onPress={() => removeItem(item.id)}>
                                    <Icon name="delete" size={30} color="#f08080" />
                                </TouchableOpacity>
                            </View>
                        ))
                        :
                        <Text style={globalStyles.textCenter}>Nothing in cart</Text>
                }
            </View>

            <View style={styles.proceedButtonContainer}>
                <CustomButton
                    color="#fff"
                    backgroundColor="#f08080"
                    width="100%"
                    height={50}
                    borderRadius={10}
                    onPress={proceedToOrder}
                >
                    <Text>Proceed to Order</Text>
                </CustomButton>
            </View>
        </ScrollView>
    );
};

export default Cart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
    },
    cartItemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    cartItemDetails: {
        flex: 1,
        marginLeft: 10,
    },
    cartItemHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    cartItemDescription: {
        fontSize: 14,
        color: '#666',
    },
    cartItemPrice: {
        fontSize: 14,
        color: '#f08080',
        marginTop: 5,
    },
    proceedButtonContainer: {
        padding: 20,
    },
});
