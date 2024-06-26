import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const Flatlist = ({ image, heading, description, price, navigation, productId }) => {
    const navigateToProduct = () => {
        console.log(productId);
        navigation.navigate('Product', {
            productId
        });
    }
    return (
        <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToProduct()}>
            <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.heading}>{heading}</Text>
                <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
                    {description}
                </Text>
                <Text style={styles.price}>{price}</Text>
            </View>
        </TouchableOpacity>
    )
};

export default Flatlist;

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: Dimensions.get('window').width - 32,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    price: {
        fontSize: 16,
        color: '#000',
        marginTop: 5,
    },
});

