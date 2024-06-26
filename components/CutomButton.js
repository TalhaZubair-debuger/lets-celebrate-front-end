import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({
    onPress,
    color = 'black',
    backgroundColor = 'white',
    fontSize = 16,
    borderColor = 'transparent',
    borderRadius = 5,
    borderWidth,
    width,
    height,
    children,
}) => {
    const styles = StyleSheet.create({
        button: {
            backgroundColor,
            borderRadius,
            borderColor,
            borderWidth: borderColor !== 'transparent' ? borderWidth : 0, // Handle border width for transparency
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
            width,
            height,
        },
        buttonText: {
            color,
            fontSize,
        },
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>{children}</Text>
        </TouchableOpacity>
    );
};

export default CustomButton;
