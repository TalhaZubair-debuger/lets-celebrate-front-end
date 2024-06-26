import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import CustomButton from "../../components/CutomButton";
import globalStyles from "../../globalStyles";
import { HostName } from "../../utils/consts";

const SignUp = ({ navigation }) => {
  const [email, SetEmail] = useState("");
  const [name, SetName] = useState("");
  const [contact, setContact] = useState(null);
  const [password, SetPassword] = useState("");
  const [confirmPassword, SetConfirmPassword] = useState("");
  const [userType, setUserType] = useState("user"); // Default user type

  const onSubmitHandler = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || password === "" || contact === null || name === "" || confirmPassword === "") {
      Alert.alert("Alert!", "Please fill the form completely.");
    } else {
      try {
        if (!emailRegex.test(email)) {
          Alert.alert('Alert!', 'Entered value is not an email');
          return;
        }
        if (contact.length < 10) {
          Alert.alert('Alert!', 'Contact No. length should be minimum 10 numbers');
          return;
        }
        if (password !== confirmPassword) {
          Alert.alert('Alert!', "Passwords doesn't match");
          return;
        }

        const res = await fetch(`${HostName}users/signup`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            name,
            contact,
            password,
            confirmPassword
          })
        })

        const data = await res.json();
        if (data.message && !data.userId) {
          Alert.alert("Alert!", data.message);
          return;
        }
        if (data.userId) {
          Alert.alert("Alert!", data.message);
          navigation.navigate("Login");
          return;
        }
        console.log(data + " line 81");
      } catch (err) {
        Alert.alert("Error!", err.message);
        return;
      }
    }
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Let's Party!</Text>
      <Text style={globalStyles.subTitle}>Sign Up Here</Text>

      <TextInput
        placeholder="Full Name"
        style={globalStyles.textInput}
        value={name}
        onChangeText={(newValue) => SetName(newValue)}
      />

      <TextInput
        placeholder="Email"
        style={globalStyles.textInput}
        value={email}
        onChangeText={(newValue) => SetEmail(newValue)}
      />

      <TextInput
        placeholder="Contact"
        keyboardType="numeric"
        style={globalStyles.textInput}
        value={contact}
        onChangeText={(newValue) => setContact(newValue)}
      />

      <TextInput
        placeholder="Password"
        style={globalStyles.textInput}
        value={password}
        onChangeText={(newValue) => SetPassword(newValue)}
        secureTextEntry={true} // Make password field secure
      />

      <TextInput
        placeholder="Confirm Password"
        style={globalStyles.textInput}
        value={confirmPassword}
        onChangeText={(newValue) => SetConfirmPassword(newValue)}
        secureTextEntry={true} // Make confirm password field secure
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
        Sign Up
      </CustomButton>

      <Text style={styles.text}>Already have an account?</Text>

      <Pressable style={styles.signInButton} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.signInText}>Sign In Here</Text>
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
  text: {
    marginTop: 20,
  },
  signInButton: {
    marginTop: 10,
  },
  signInText: {
    color: "#f08080", // Light pink
  },
});

export default SignUp;
