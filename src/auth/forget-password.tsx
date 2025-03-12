import axios from 'axios';
import React from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Image, Dimensions } from "react-native";

import { environment } from '../env/environment';
import { decryption } from '../service/decryption';
import { NavigationProp } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const ForgetPassword = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const env = new environment()
    const ACS = new decryption()
    const [email, emailEnter] = React.useState('');
    const [otp, otpEnter] = React.useState('');
    const [password, passwordEnter] = React.useState('');
    const [step, currentStep] = React.useState(0);


    const showToast = (data: string) => {
        ToastAndroid.show(data, ToastAndroid.TOP);
    };

    const forgetPassword_process = async () => {
        email == '' ? showToast('Please enter your email') : await forgetPassword_api(email)
    }

    const enter_otp_process = async () => {
        otp == '' ? showToast('Please enter your otp') : await enter_otp_api(email, otp)
    }

    const enter_new_pass_process = async () => {
        password == '' ? showToast('Please enter your new password') : await enter_new_pass_api(email, password)
    }

    const forgetPassword_api = async (email: string) => {
        return await axios.post(`${env.environment}/otp/send`, { email }).then(async (ele) => {
            const data = await ACS.decrypt(ele.data.response)
            if (data.status) {
                showToast('Password reset link sent to your email');
                currentStep(1)
            }
        })
    }

    const enter_otp_api = async (email: string, otp: string) => {
        return await axios.post(`${env.environment}/otp/verify`, { email, otp }).then(async (ele) => {
            const data = await ACS.decrypt(ele.data.response)
            if (data.status) {
                showToast('otp validated successfully');
                currentStep(2)
            }
        })
    }

    const enter_new_pass_api = async (email: string, password: string) => {
        return await axios.post(`${env.environment}/auth/updatePass`, { email, password }).then(async (ele) => {
            const data = await ACS.decrypt(ele.data.response)
            if (data.status) {
                showToast('password updated successfully');
                navigation.navigate("login")
            }
        })
    }

    return (
        <View style={styles.parent}>
            <Image
                source={require('../../assets/favicon.png')}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.title}>Update Password</Text>
            {
                step == 0 && <View style={styles.container}>
                    <TextInput
                        placeholder="email"
                        style={styles.input}
                        onChangeText={emailEnter}
                    />
                    <View style={styles.parentButton}>
                        <TouchableOpacity style={styles.button} onPress={forgetPassword_process}>
                            <Text style={styles.buttonText}>Send OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }

            {
                step == 1 && <View style={styles.container}>
                    <TextInput
                        placeholder="otp"
                        style={styles.input}
                        onChangeText={otpEnter}
                    />
                    <View style={styles.parentButton}>
                        <TouchableOpacity style={styles.button} onPress={enter_otp_process}>
                            <Text style={styles.buttonText}>Send OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }

            {
                step == 2 && <View style={styles.container}>
                    <TextInput
                        placeholder="password"
                        style={styles.input}
                        onChangeText={passwordEnter}
                    />
                    <View style={styles.parentButton}>
                        <TouchableOpacity style={styles.button} onPress={enter_new_pass_process}>
                            <Text style={styles.buttonText}>Updated password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }


        </View>
    )
}

export default ForgetPassword



const styles = StyleSheet.create({
    title: {
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 10,
        color: '#25684b'
    },
    parent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    parentButton: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    container: {
        width: "80%",
        padding: '1%',
        marginTop: '20%',
        borderWidth: 2,
        borderColor: '#25684b',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: "40%",
        backgroundColor: '#25684b',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: "80%",
        padding: 10,
        borderWidth: 1,
        marginBottom: 10,
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    image: {
        width: width / 1.9,
        height: height / 3.9,
        borderRadius: 10,
    }
});