import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Pressable, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomButton from "../../components/CutomButton.js";
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import globalStyles from '../../globalStyles';
import { HostName } from '../../utils/consts.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categories = ["Event Place", "Catering", "Fireworks", "Flower Decorations"];

const AddProduct = ({ navigation }) => {
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

    const handleAddProduct = async () => {
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
            // Make the API call to add a new product
            const jwtToken = await AsyncStorage.getItem("jwtToken");
            const res = await fetch(`${HostName}product-services/add-product`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `${jwtToken}`  // Assuming jwtToken is available in your context
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

            if (data.message && !data.productId) {
                Alert.alert("Alert!", data.message);
                return;
            }

            if (data.productId) {
                Alert.alert("Success!", "Event Place/Service added successfully.");
                setImage('');
                setTitle('');
                setDescription('');
                setLocation('');
                setCategory(categories[0]);
                setTags('');
                setPrice('');
                setContactNumber('');
                setPaymentKey('');
                setPublicKey('');
                // Navigate to SellerHome
                navigation.navigate('Home');
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
                        <Text style={globalStyles.heading3}>Add Event Place/Service</Text>
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
                        onPress={handleAddProduct}
                    >
                        <Text>Add Event Place/Service</Text>
                    </CustomButton>
                </View>
            </View>
        </ScrollView>
    );
};

export default AddProduct;

const styles = StyleSheet.create({
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
