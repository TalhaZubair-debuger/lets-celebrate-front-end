import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Pressable, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomButton from "../../components/CutomButton";
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import globalStyles from '../../globalStyles';
import { HostName } from '../../utils/consts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = ["Event Place", "Catering", "Fireworks", "Flower Decorations", "Photographer"];

const EditProduct = ({ route, navigation }) => {
    const { productId } = route.params;
    const [image, setImage] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [tags, setTags] = useState('');
    const [price, setPrice] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [paymentKey, setPaymentKey] = useState('');

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
                const product = await response.json();
                console.log("DING DONG", product);
                if (product.eventService) {
                    setImage(product.eventService.image);
                    setTitle(product.eventService.title);
                    setDescription(product.eventService.description);
                    setLocation(product.eventService.location);
                    setCategory(product.eventService.category);
                    setTags(product.eventService.tags);
                    setPrice(product.eventService.price.toString());
                    setContactNumber(product.eventService.contactNumber);
                    setPublicKey(product.eventService.paymentPublicKey);
                    setPaymentKey(product.eventService.paymentPrivateKey);
                }
            } catch (error) {
                Alert.alert("Error!", error.message);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleUpdateProduct = async () => {
        // Perform validation checks
        if (!image || !title || !description || !location || !category || !tags || !price || !contactNumber || !paymentKey || !publicKey) {
            Alert.alert("Alert!", "Please fill all the fields.");
            return;
        }

        if (contactNumber.length < 10) {
            Alert.alert('Alert!', 'Contact No. length should be minimum 10 numbers');
            return;
        }

        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const res = await fetch(`${HostName}product-services/product/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${jwtToken}`
                },
                body: JSON.stringify({
                    image: image.base64,
                    title,
                    description,
                    location,
                    category,
                    tags,
                    price,
                    contactNumber,
                    paymentPrivateKey: paymentKey,
                    paymentPublicKey: publicKey
                })
            });

            const data = await res.json();

            if (data.message && !data.updatedProduct) {
                Alert.alert("Alert!", data.message);
                return;
            }

            if (data.updatedProduct) {
                Alert.alert("Success!", "Event Place/Service updated successfully.");
                navigation.navigate('SellerHome');
                return;
            }
        } catch (err) {
            Alert.alert("Error!", err.message);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const res = await fetch(`${HostName}product-services/product/${productId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `${jwtToken}`
                }
            });

            const data = await res.json();

            if (data.message) {
                Alert.alert("Success!", data.message);
                navigation.navigate('SellerHome');
                return;
            }
        } catch (err) {
            Alert.alert("Error!", err.message);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
            assetId: true,
            base64: true
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={globalStyles.headerPinkSmall}>
                    <View style={globalStyles.headerRowOne}>
                        <Text style={globalStyles.heading3}>Edit Event Place/Service</Text>
                    </View>
                </View>

                <View style={styles.innerContainer}>

                    <View style={[styles.row, styles.mt10]}>
                        <Pressable style={[styles.pick_image, globalStyles.bgcTwo]} onPress={pickImage}>
                            <Icon name="image" size={20} color="#f08080" />
                            <Text style={[styles.center, styles.font15NonBold]}>
                                Pick Image
                            </Text>
                        </Pressable>
                        {image && <Image source={{ uri: image.uri }} style={{ width: 50, height: 50, margin: 10 }} />}
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Location"
                        value={location}
                        onChangeText={setLocation}
                    />
                    <View style={styles.rowContainer}>
                        <View style={styles.halfInputContainer}>
                            <Picker
                                selectedValue={category}
                                style={styles.picker}
                                onValueChange={(itemValue) => setCategory(itemValue)}
                            >
                                {categories.map((cat, index) => (
                                    <Picker.Item label={cat} value={cat} key={index} />
                                ))}
                            </Picker>
                        </View>
                        <TextInput
                            style={styles.halfInput}
                            placeholder="Tags"
                            value={tags}
                            onChangeText={setTags}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Price"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contact Number"
                        value={contactNumber}
                        onChangeText={setContactNumber}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Online Payment Public Key"
                        value={publicKey}
                        onChangeText={setPublicKey}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Online Payment Private Key"
                        value={paymentKey}
                        onChangeText={setPaymentKey}
                    />
                    <CustomButton
                        color="#fff"
                        backgroundColor="#f08080"
                        width="100%"
                        height={50}
                        borderRadius={10}
                        onPress={handleUpdateProduct}
                    >
                        <Text>Update Event Place/Service</Text>
                    </CustomButton>
                    <View style={styles.deleteBtn}>
                        <CustomButton
                            color="#fff"
                            backgroundColor="#ff0000"
                            width="100%"
                            height={50}
                            borderRadius={10}
                            onPress={handleDeleteProduct}
                            style={{ marginTop: 10 }}
                        >
                            <Text>Delete Event Place/Service</Text>
                        </CustomButton>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default EditProduct;

const styles = StyleSheet.create({
    deleteBtn: {
        marginTop: 10
    },
    font15NonBold: {
        fontSize: 15,
    },
    mt10: {
        marginVertical: 5
    },
    row: {
        width: "100%",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexDirection: "row"
    },
    pick_image: {
        width: 150,
        height: 50,
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 5,
        margin: 10
    },
    container: {
        backgroundColor: '#fff',
    },
    innerContainer: {
        marginTop: -20,
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        backgroundColor: "white"
    },
    input: {
        width: '100%',
        height: 50,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInputContainer: {
        width: '48%',
    },
    halfInput: {
        width: '48%',
        height: 50,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 20,
    },
});
