import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native';
import globalStyles from '../../globalStyles';
import CustomButton from '../../components/CutomButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Flatlist from '../../utils/Flatlist';
import { HostName } from '../../utils/consts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const SearchPage = ({ navigation, route }) => {
    const { SearchTerm = "Default", Category = "Default" } = route.params || {};
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showAdvanced, setShowAdvanced] = useState(false);

    useFocusEffect(
        useCallback(() => {
            handleSearch()
        }, [Category, SearchTerm])
    )

    const handleSearch = async () => {
        // No Props Passed
        console.log(SearchTerm, searchTerm, Category, category, location, price);
        if (SearchTerm === 'Default' && searchTerm === '' && Category === 'Default' && location === "" && price === "" && category === "") {
            try {
                const jwtToken = await AsyncStorage.getItem("jwtToken");
                const response = await fetch(`${HostName}product-services/all`, {
                    method: "GET",
                    headers: {
                        'Authorization': `${jwtToken}`
                    }
                });
                const data = await response.json();
                if (data.eventServices) {
                    setSearchResults(data.eventServices);
                }
                else if (data.message) {
                    setSearchResults(data.message);
                }
            } catch (error) {
                Alert.alert("Failed to fetch!", `${error.message}`);
                console.log(error);
            }
        } else if (SearchTerm !== 'Default' || searchTerm !== '' || location !== "" || price !== "" || category !== "") {
            try {
                const jwtToken = await AsyncStorage.getItem("jwtToken");
                const response = await fetch(`${HostName}product-services/search?q=${searchTerm || SearchTerm}&location=${location}&category=${category}&price=${price}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `${jwtToken}`
                    }
                });
                const data = await response.json();
                if (data.eventServices) {
                    setSearchResults(data.eventServices);
                }
                else if (data.message) {
                    setSearchResults(data.message);
                }
            } catch (error) {
                Alert.alert("Failed to fetch!", `${error.message}`);
                console.log(error);
            }
        } else if (Category !== "Default") {
            console.log(Category);
            try {
                const jwtToken = await AsyncStorage.getItem("jwtToken");
                const response = await fetch(`${HostName}product-services/search-by-category`, {
                    method: "POST",
                    headers: {
                        'Authorization': `${jwtToken}`
                    },
                    body: {
                        category: Category
                    }
                });
                const data = await response.json();
                if (data.services) {
                    setSearchResults(data.services);
                }
                else if (data.message) {
                    setSearchResults(data.message);
                }
            } catch (error) {
                Alert.alert("Failed to fetch!", `${error.message}`);
                console.log(error);
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={globalStyles.headerPink}>
                <View style={globalStyles.headerRowOne}>
                    <Text style={globalStyles.heading3}>Search</Text>
                </View>
            </View>
            <View style={styles.searchContainer}>
                <View style={styles.flexRow}>
                    <TextInput
                        placeholder="Search term..."
                        style={globalStyles.textInput}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    <CustomButton
                        color="#fff"
                        backgroundColor="#f08080"
                        width="15%"
                        height={40}
                        borderRadius={5}
                        onPress={handleSearch}
                    >
                        <Icon name="search" size={20} color="#fff" />
                    </CustomButton>
                </View>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowAdvanced(!showAdvanced)}
                >
                    <Text style={styles.dropdownButtonText}>
                        {showAdvanced ? 'Hide Advanced Search' : 'Show Advanced Search'}
                    </Text>
                    <Icon name={showAdvanced ? "expand-less" : "expand-more"} size={20} color="#f08080" />
                </TouchableOpacity>
                {showAdvanced && (
                    <>
                        <TextInput
                            placeholder="Location..."
                            style={globalStyles.textInput}
                            value={location}
                            onChangeText={setLocation}
                        />
                        <TextInput
                            placeholder="Category..."
                            style={globalStyles.textInput}
                            value={category}
                            onChangeText={setCategory}
                        />
                        <TextInput
                            placeholder="Price..."
                            style={globalStyles.textInput}
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                        />
                    </>
                )}
            </View>
            <View>
            {
                    Array.isArray(searchResults) && searchResults.length > 0 ? (
                        searchResults.map((item, index) => (
                            <Flatlist
                                image={item.image}
                                heading={item.title}
                                description={item.description}
                                price={item.price}
                                key={index}
                                navigation={navigation}
                                productId={item._id}
                            />
                        ))
                    ) : (
                        <Text style={globalStyles.textCenter}>No search results found.</Text>
                    )
                }
            </View>
        </ScrollView>
    );
};

export default SearchPage;

const styles = StyleSheet.create({
    flexRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        marginTop: -20,
        marginBottom: 20,
    },
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    dropdownButtonText: {
        color: '#f08080',
        fontSize: 16,
        marginRight: 10,
    },
    m10: {
        margin: 10,
    },
});
