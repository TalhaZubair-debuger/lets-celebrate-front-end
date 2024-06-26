import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/CutomButton";
import globalStyles from "../../globalStyles";
import { HostName } from "../../utils/consts";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user");

  const onSubmitHandler = async (event) => {
    if (!email || !password) {
      Alert.alert("Alert!", "Fill all fields.");
      return;
    }
    try {
      const res = await fetch(`${HostName}users/login-user`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status === 200) {
        const data = await res.json();
        const token = data.token;
        await AsyncStorage.setItem('jwtToken', `Bearer ${token}`);
        setEmail("");
        setPassword("");
        if (userType === "seller") {
          navigation.navigate("SellerHome");
          return;
        }
        if (userType === "user") {
          navigation.navigate("Home");
        }
      }
      else {
        Alert.alert("Login failed", "Please check your credentials.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Let's Celebrate!</Text>
      <Text style={globalStyles.subTitle}>Sign In Here</Text>

      <TextInput
        placeholder="Email"
        style={globalStyles.textInput}
        value={email}
        onChangeText={(newValue) => setEmail(newValue)}
      />

      <TextInput
        placeholder="Password"
        style={globalStyles.textInput}
        value={password}
        onChangeText={(newValue) => setPassword(newValue)}
        secureTextEntry={true} // Make password field secure
      />

      <View style={styles.userTypeContainer}>
        <Text style={styles.userTypeLabel}>User Type:</Text>
        <Pressable style={styles.toggleButton} onPress={() => setUserType(userType === 'user' ? 'seller' : 'user')}>
          <Text style={styles.toggleButtonText}>{userType === 'user' ? 'User' : 'Seller'}</Text>
        </Pressable>
      </View>

      <CustomButton
        color="white"
        backgroundColor="#f08080" // Light pink
        width="80%"
        height={50}
        borderRadius={10}
        onPress={() => onSubmitHandler()}
      >
        Sign In
      </CustomButton>

      <Text style={styles.text}>No account yet?</Text>

      <Pressable style={styles.signUpButton} onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Sign Up Here</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  userTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userTypeLabel: {
    marginRight: 10,
  },
  toggleButton: {
    backgroundColor: "#f08080", // Light pink
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: "white",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  text: {
    marginTop: 20,
  },
  signUpButton: {
    marginTop: 10,
  },
  signUpText: {
    color: "#f08080", // Light pink
  },
});

export default Login;
