import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5", // Light gray background
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#f08080", // Light pink
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 20,
        color: "#333",
        marginBottom: 20,
    },
    textInput: {
        width: "80%",
        height: 40,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: "#fff", // White
        borderColor: "#ccc", // Light gray border
        borderWidth: 1,
    },
    textInputBorderless: {
        width: "80%",
        height: 40,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: "#fff", // White
        borderColor: "#fff",
        borderWidth: 1,
    },
    headerPink: {
        backgroundColor: "#f08080",
        height: 180,
        flexDirection: "column",
        paddingTop: 50,
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        paddingBottom: 30,
    },
    headerPinkSmall: {
        backgroundColor: "#f08080",
        height: 130,
        flexDirection: "column",
        paddingTop: 50,
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        paddingBottom: 30,
    },
    headerPinkSmallRow: {
        backgroundColor: "#f08080",
        height: 130,
        paddingTop: 50,
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        paddingBottom: 30,
    },
    headerRowOne: {
        paddingVertical: 10,
        width: "90%",
        marginHorizontal: "auto",
    },
    text10: {
        fontSize: 10,
        color: "#000",
    },
    text15: {
        fontSize: 15,
        color: "#000",
    },
    bodyCenterColumn: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    heading1: {
        fontSize: 60,
        color: "#000",
        marginBottom: 50,
    },
    heading2: {
        fontSize: 40,
        color: "#000",
        marginBottom: 50,
    },
    heading3: {
        fontSize: 20,
        color: "#000",
        fontWeight: "600"
    },
    buttonTransparent: {
        backgroundColor: "#fff",
        color: "#000",
    },
    textCenter: {
        textAlign: "center"
    },
    canvasFull: {
        width: "100%",
        borderRadius: 20,
        elevation: 20,
        shadowColor: "#000",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5
    },
    canvasFullM10: {
        width: "100%",
        borderRadius: 20,
        elevation: 20,
        shadowColor: "#000",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -20
    },
    canvasFullBottomFlat: {
        width: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    }
});
export default globalStyles;
