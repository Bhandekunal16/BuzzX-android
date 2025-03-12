import React from 'react'
import { Dimensions, ToastAndroid, StyleSheet, Image, View, TextInput, TouchableOpacity } from 'react-native'
import { Layout, Text  } from '@ui-kitten/components'
import { environment } from '../env/environment';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const Login = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [username, usernameEnter] = React.useState("username");
    const [password, passwordEnter] = React.useState("password");


    const showToast = (data: string) => {
        ToastAndroid.show(data, ToastAndroid.TOP);
    };

    const loginProcess = () => {
        if (username == "username" || password == "password") {
            showToast("Enter the valid username & password!");
        } else {
            login_api_call(username, password);
        }
    };

    const login_api_call = (username: any, password: any) => {
        axios
            .post(`${new environment().environment}/auth/login`, {
                username,
                password,
            })
            .then(async (ele) => {
                if (ele.data.status) {
                    await Promise.all([
                        AsyncStorage.setItem("user", ele.data.data.username),
                        AsyncStorage.setItem("id", ele.data.data._id),
                        AsyncStorage.setItem("status", ele.data.data.status.toString()),
                        AsyncStorage.setItem("appLock", ele.data.data.appLock),
                    ]);
                    navigation.navigate("Dashboard")
                } else {
                    showToast("please check username & password or register your self!");
                }
            });
    };
    return (
        <Layout style={styles.parent}>
            <Image
                source={require('../../assets/favicon.png')}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.title}>BuzzX</Text>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={usernameEnter}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={passwordEnter}
                />

                <View style={styles.parentButton}>
                    <TouchableOpacity style={styles.button} onPress={loginProcess}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("register")}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>

                <Text onPress={() => navigation.navigate("forgetPassword")}>
                    Forgot password?
                </Text>
            </View>
        </Layout>
    )
}

export default Login

const styles = StyleSheet.create({
    title: {
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#25684b",
    },
    parent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    parentButton: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        marginTop: 20,
    },
    container: {
        width: "80%",
        padding: "1%",
        marginTop: "20%",
        borderWidth: 2,
        borderColor: "#25684b",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        width: "40%",
        backgroundColor: "#25684b",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        width: "80%",
        padding: 10,
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5,
        borderColor: '#25684b',
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },
    image: {
        width: width / 1.9,
        height: height / 3.9,
        borderRadius: 10,
    }
});