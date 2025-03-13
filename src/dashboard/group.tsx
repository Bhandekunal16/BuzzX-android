import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Layout, Text } from '@ui-kitten/components';
import axios from 'axios';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ToastAndroid, View, StyleSheet } from 'react-native';
import moment from 'moment';
import useEventService from '../service/event';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../env/environment';
import { decryption } from '../service/decryption';

interface Message {
    id: string;
    user: string;
    data: string;
    createdOn: string;
}

const ChatScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userTyping, setUserTyping] = useState<string[]>([]);
    const [hostId, setHostId] = useState<string>('');

    const env = new environment();
    const ACS = new decryption();
    const destroy$ = useRef(new Subject<void>()).current;

    const { getServerSentEvent, close } = useEventService(`${env.environment}/event/stream`);

    const jsonBuilder = (data: any) => {
        console.log(data)
        try {
            return JSON.parse(data);
        } catch {
            console.error('Invalid JSON');
            return {};
        }
    };

    const showToast = (message: string) => {
        ToastAndroid.show(message, ToastAndroid.TOP);
    };

    const fetchGroupData = async () => {
        const [group, id] = await Promise.all([
            AsyncStorage.getItem('group'),
            AsyncStorage.getItem('id'),
        ]);

        const groupInfo = group ? JSON.parse(group) : {};
        setHostId(id || '');

        showToast(groupInfo.groupName || 'Unknown Group');
        navigation.setOptions({ title: groupInfo.groupName || 'Chat' });

        const messageData = await getMessageData(groupInfo.unix);
        const decryptedMessages = await ACS.decrypt(messageData.data.response);

        setMessages(decryptedMessages.data || []);
    };

    const getMessageData = async (groupId: string) => {
        return axios.get(`${env.environment}/event/get/groupId/${groupId}`);
    };

    const handleStreamEvent = (event: any) => {
        const parsedData = event.data ? jsonBuilder(event.data) : jsonBuilder(JSON.stringify({ message: 'notification' }))

        switch (event.type) {
            case 'loading':
                setUserTyping((prev) => [...prev, parsedData.message]);
                break;

            case 'delete':
                fetchGroupData();
                break;

            case 'message':
                fetchGroupData();
                break;

            default:
                console.log('Unknown event type:', event.type);
        }
    };

    const startStream = useCallback(() => {
        const eventStream$ = getServerSentEvent();

        eventStream$.pipe(takeUntil(destroy$)).subscribe({
            next: handleStreamEvent,
            error: (error) => console.error('Event Stream Error:', error),
        });
    }, []);

    useEffect(() => {
        fetchGroupData();
        startStream();

        return () => {
            destroy$.next();
            destroy$.complete();
            close();
        };
    }, []);

    return (
        <Layout level="3" style={styles.messageParent}>
            <Text>{userTyping.join(', ')}</Text>
            {messages.map((msg, index) => (
                <View key={index} style={hostId === msg.id ? styles.myChat : styles.singleChat}>
                    <Text style={hostId === msg.id ? styles.myChatText : styles.singleChatText}>
                        {msg.user}: {msg.data}
                    </Text>
                    <Text style={hostId === msg.id ? styles.myChatText : styles.singleChatText}>
                        {moment(msg.createdOn).format('D/M/YYYY h:mm:ss')}
                    </Text>
                </View>
            ))}
        </Layout>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    myChat: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 12,
        borderRadius: 8,
        borderTopRightRadius: 0,
        backgroundColor: '#25684b',
        maxWidth: 300,
        marginBottom: '1%',
        alignSelf: 'flex-end',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        color: '#fff',
    },
    singleChat: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 12,
        borderRadius: 8,
        borderTopLeftRadius: 0,
        backgroundColor: '#f9f9f9',
        maxWidth: 300,
        marginBottom: '1%',
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    myChatText: {
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
    },
    singleChatText: {
        color: '#000',
        fontFamily: 'Inter, sans-serif',
    },
    messageParent: {
        width: '100%',
        height: '60%',
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingBottom: '10%',
        paddingTop: '5%',
        marginBottom: '5%',
    },
});
