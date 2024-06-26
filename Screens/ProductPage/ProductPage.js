import React, { useCallback, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Flatlist from '../../utils/Flatlist';
import globalStyles from '../../globalStyles';
import CustomButton from '../../components/CutomButton';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HostName } from '../../utils/consts';

const { width: screenWidth } = Dimensions.get('window');

const ProductPage = ({ route, navigation }) => {
    const { productId } = route.params;
    const [product, setProduct] = useState({});
    const [similarProducts, setSimilarProducts] = useState([]);

    useFocusEffect(
        useCallback(() => {
            getEventPlaceOrService();
            getSimilarServices();
        }, [productId])
    )

    const getEventPlaceOrService = async () => {
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
                setProduct(data.eventService)
            } else {
                setProduct(data.message);
            }
        } catch (error) {
            Alert.alert("Failed to fetch!", `${error.message}`);
            console.log(error);
        }
    }

    const getSimilarServices = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const response = await fetch(`${HostName}product-services/similar-services/${product.category}`, {
                method: "GET",
                headers: {
                    'Authorization': `${jwtToken}`
                }
            });
            const data = await response.json();
            if (data.bestServices) {
                setSimilarProducts(data.bestServices)
            } else {
                setSimilarProducts(data.message);
            }
        } catch (error) {
            Alert.alert("Failed to fetch!", `${error.message}`);
            console.log(error);
        }
    }

    return (
        <ScrollView>

            <View style={styles.carouselContainer}>
                <View style={styles.carouselItem}>
                    <Image source={{ uri: `data:image/jpeg;base64,${product.image}` }} style={styles.carouselImage} />
                </View>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{product.title}</Text>
                <View >
                    <Text style={styles.descriptionHeader}>
                        Description
                    </Text>
                    <Text style={styles.description}>
                        {product.description}
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionHeader}>
                        Category
                    </Text>
                    <Text style={styles.description}>
                        {product.category}
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionHeader}>
                        Tags
                    </Text>
                    <Text style={styles.description}>
                        {product.tags?.join(', ')}
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionHeader}>
                        Contact
                    </Text>
                    <Text style={styles.description}>
                        {product.contactNumber}
                    </Text>
                </View>
                <View>
                    <Text style={styles.descriptionHeader}>
                        Location
                    </Text>
                    <Text style={styles.description}>
                        {product.location}
                    </Text>
                </View>
                <Text style={styles.price}>Price: {product.price}{product.category === "Event Place" ? "/person" : " /Rs"}</Text>

                <CustomButton
                    color="#fff"// Light pink
                    backgroundColor="#f08080"
                    width="100%"
                    height={50}
                    borderRadius={10}
                    onPress={() => navigation.navigate("OrderNow", { productId })}
                >
                    Book Now
                </CustomButton>
            </View>

            <View style={styles.similarServicesContainer}>
                <Text style={[globalStyles.heading3, globalStyles.textCenter, styles.m10]}>
                    Similar Services
                </Text>

                <View>
                    {
                        Array.isArray(similarProducts) && similarProducts.length !== 0 ?
                            similarProducts.map((item, index) => (
                                <Flatlist
                                    image={item.image}
                                    productId={item._id}
                                    heading={item.title}
                                    description={item.description}
                                    price={item.price}
                                    key={index}
                                    navigation={navigation}
                                />
                            ))
                            :
                            <Text style={globalStyles.textCenter}>{similarProducts}</Text>
                    }
                </View>
            </View>
        </ScrollView>
    );
}

export default ProductPage;

const styles = StyleSheet.create({
    m10: {
        margin: 10
    },
    similarServicesContainer: {
        width: '100%',
        alignSelf: 'center', // Use alignSelf to center the container
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // padding: 20,
        // marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
    },
    carouselContainer: {
        width: '100%',
        backgroundColor: '#fff',
    },
    carouselItem: {
        width: screenWidth,
        height: 300,
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    detailsContainer: {
        width: '100%',
        alignSelf: 'center', // Use alignSelf to center the container
        backgroundColor: '#fff',
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    descriptionHeader: {
        fontSize: 18,
        color: '#444',
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    category: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    tags: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f08080',
    },
});
