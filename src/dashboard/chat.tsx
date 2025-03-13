import AsyncStorage from '@react-native-async-storage/async-storage'
import { Layout, Text } from '@ui-kitten/components'
import axios from 'axios'
import React from 'react'
import { ToastAndroid, StyleSheet } from 'react-native'
import { environment } from '../env/environment'
import { decryption } from '../service/decryption'
import { NavigationProp } from '@react-navigation/native'

const Chat = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const env = new environment()
    const ACS = new decryption()

    const [loading, setLoading] = React.useState(true)
    const [group, setGroup]: any = React.useState([])

    const onClickChat = async (data: any) => {
        const GroupData = JSON.stringify(data)
        await AsyncStorage.setItem('group', GroupData)
        navigation.navigate('ChatScreen')
    }


    const Groups = ({ group }: { group: any[] }) => {
        return (
            <Layout style={styles.container} level='2'>
                {group.map((item, index) => (
                    <Layout key={index} style={styles.item} level='1' >
                        <Text style={{
                            backgroundColor: getRandomHexColor(),
                            color: '#fff',
                            fontSize: 24,
                            height: 40,
                            width: 40,
                            borderColor: '#fff',
                            borderWidth: 1,
                            borderRadius: 100,
                            textAlign: 'center'
                        }}>{item.icon}</Text>
                        <Text style={styles.title} onPress={() => onClickChat(item)}> {item.groupName}</Text>
                    </Layout>
                ))}
            </Layout>
        );
    };

    const getRandomHexColor = () => {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    };

    React.useEffect(() => {
        getAllGroupsProcess()
        welcome()
    }, [])

    const welcome = async () => {
        const user = await AsyncStorage.getItem('user')
        showToast(`Hello ${user} welcome to BuzzX` || '')
    }

    const showToast = (data: string) => {
        ToastAndroid.show(data, ToastAndroid.TOP);
    };

    const getAllGroupsProcess = async () => {
        setLoading(false)
        const id = await AsyncStorage.getItem('id')
        const user = await AsyncStorage.getItem('user')
        await axios.get(`${env.environment}/auth/getall/group/${id}`).then(async (res) => {
            let data = await ACS.decrypt(res.data.response)
            let arr: any = data.data
            for (let i of arr) {
                i.groupName.split('|').map((element: string | any) => {
                    if (element != user) {
                        return (i.groupName = element);
                    }
                });
                i.icon = i.groupName.split('')[0];
            }
            setGroup(arr)
        })
    }

    return (
        <Layout level='2' style={{ height: '100%' }}>
            {!loading && group.length != 0
                ? <Layout level='3' style={styles.container}><Groups group={group} /></Layout>
                : <Layout level='3' style={styles.container}><Groups group={group} /></Layout>}
        </Layout>
    )
}
export default Chat


const styles = StyleSheet.create({
    container: {
        padding: 1,
    },
    item: {
        borderBottomColor: '#000',
        borderTopColor: '#000',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        width: '100%',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '20%',
        height: 50,
        marginRight: 10,
    },
    title: {
        fontSize: 18,
        width: '70%',
        color: '#000'
    },
});