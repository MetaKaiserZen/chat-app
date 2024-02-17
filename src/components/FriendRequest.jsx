import { useState, useContext } from 'react';

import
{
    Alert,
    Pressable,
    Image,
    Text
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Type } from '../contexts/Context';

import useHost from '../hooks/useHost';

import axios from 'axios';

const FriendRequest = ({ request, friendRequests, setFriendRequests }) =>
{
    const [friendRequest, setFriendRequest] = useState(false);

    const { id } = useContext(Type);

    const navigation = useNavigation();

    const myPromise = useHost();

    const aceptarFriendRequest = async (id, destinatario) =>
    {
        try
        {
            setFriendRequest(true);

            const request = { id, destinatario }

            const { host } = await myPromise();

            const { data, status } = await axios.post(`${host}/friend-requests/aceptar`, request);

            const { message } = data;

            status === 201 && setFriendRequests(friendRequests.filter((request) => request._id !== destinatario));

            status === 201 && Alert.alert('Mensaje', message,
            [
                {
                    text: 'Aceptar',
                    onPress: () => 
                    (
                        setFriendRequest(false),
                        navigation.navigate('MensajeScreen', { destinatario: destinatario })
                    ),
                    style: 'default'
                }
            ]);
        }
        catch (e)
        {
            console.log(e);

            !e.response && Alert.alert('Error al aceptar la solicitud', 'Se produjo un error inesperado. Vuelve a intentarlo',
            [
                {
                    text: 'Aceptar',
                    onPress: () => setFriendRequest(false),
                    style: 'default'
                }
            ]);

            if (e.response)
            {
                const { data, status } = e.response;

                const { message } = data;

                status === 500 ?
                    Alert.alert('Error al aceptar la solicitud', 'Se produjo un error inesperado. Vuelve a intentarlo',
                    [
                        {
                            text: 'Aceptar',
                            onPress: () => setFriendRequest(false),
                            style: 'default'
                        }
                    ]) :
                    Alert.alert('Mensaje', message
                    [
                        {
                            text: 'Aceptar',
                            onPress: () => setFriendRequest(false),
                            style: 'default'
                        }
                    ]);
            }
        }
    }

    return (
        <Pressable
            style={
            {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10
            }}
        >
            <Image
                source={{ uri: request?.imagen }}
                style={
                {
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    resizeMode: 'cover'
                }}
            />

            <Text
                style={
                {
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginLeft: 10,
                    flex: 1
                }}
            >
                {request?.nombre} {'te envió una solicitud de amistad'}
            </Text>

            <Pressable
                onPress={() => !friendRequest && aceptarFriendRequest(id, request._id)}
                style={
                {
                    backgroundColor: '#0066B2',
                    padding: 10,
                    borderRadius: 5
                }}
            >
                <Text style={{ textAlign: 'center', color: 'white' }}>{'Aceptar'}</Text>
            </Pressable>
        </Pressable>
    );
}

export default FriendRequest;
