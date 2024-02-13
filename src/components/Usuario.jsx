import
{
    useState,
    useEffect,
    useContext
} from 'react';

import
{
    Alert,
    Pressable,
    View,
    Image,
    Text
} from 'react-native';

import { Type } from '../contexts/Context';

import useHost from '../hooks/useHost';

import axios from 'axios';

const Usuario = ({ usuario }) =>
{
    const [destinatarios, setDestinatarios] = useState([]);
    const [loadingDestinatarios, setLoadingDestinatarios] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [loadingFriendRequests, setLoadingFriendRequests] = useState(false);

    const { id } = useContext(Type);

    const myPromise = useHost();

    const listarDestinatario = async () =>
    {
        try
        {
            const { host } = await myPromise();

            const { data, status } = await axios.get(`${host}/usuarios/destinatarios/listar/${id}`);

            status === 200 && setDestinatarios(data);
            status === 200 && (!loadingDestinatarios && setLoadingDestinatarios(true));
        }
        catch (e)
        {
            console.log(e);

            setDestinatarios([]);
        }
    }

    const listarFriendRequest = async () =>
    {
        try
        {
            const { host } = await myPromise();

            const { data, status } = await axios.get(`${host}/usuarios/friend-requests/listar/${id}`);

            status === 200 && setFriendRequests(data);
            status === 200 && (!loadingFriendRequests && setLoadingFriendRequests(true));
        }
        catch (e)
        {
            console.log(e);

            setFriendRequests([]);
        }
    }

    const crearFriendRequest = async (id, destinatario) =>
    {
        try
        {
            const request = { id, destinatario }

            const { host } = await myPromise();

            const { data, status } = await axios.post(`${host}/usuarios/friend-requests/crear`, request);

            const { message } = data;

            status === 201 && listarFriendRequest();

            status === 201 && Alert.alert('Mensaje', message, [{ text: 'Aceptar', style: 'default' }]);
        }
        catch (e)
        {
            console.log(e);

            !e.response && Alert.alert('Error al enviar la solicitud', 'Se produjo un error inesperado. Vuelve a intentarlo', [{ text: 'Aceptar', style: 'default' }]);

            if (e.response)
            {
                const { data, status } = e.response;

                const { message } = data;

                status === 500 ?
                    Alert.alert('Error al enviar la solicitud', 'Se produjo un error inesperado. Vuelve a intentarlo', [{ text: 'Aceptar', style: 'default' }]) :
                    Alert.alert('Mensaje', message);
            }
        }
    }

    useEffect(() =>
    {
        listarDestinatario();
        listarFriendRequest();
    }, []);

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            listarDestinatario();
            listarFriendRequest();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        loadingDestinatarios && loadingFriendRequests ?
        (
            <Pressable
                style={
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 10,
                    marginVertical: 10
                }}
            >
                <View>
                    <Image
                        source={{ uri: usuario.imagen }}
                        style={
                        {
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            resizeMode: 'cover'
                        }}
                    />
                </View>

                <View style={{ marginLeft: 15, flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{usuario?.nombre}</Text>
                    <Text style={{ fontSize: 15, marginTop: 5, color: 'gray' }}>{usuario?.email}</Text>
                </View>

                {
                    destinatarios.includes(usuario._id) ?
                    (
                        <Pressable
                            style={
                            {
                                backgroundColor: '#82CD47',
                                padding: 10,
                                borderRadius: 5,
                                width: 100
                            }}
                        >
                            <Text
                                style={
                                {
                                    textAlign: 'center',
                                    color: 'white',
                                    fontSize: 15
                                }}
                            >
                                {'Amigos'}
                            </Text>
                        </Pressable>
                    ) : friendRequests.some((destinatario) => destinatario._id === usuario._id) ?
                    (
                        <Pressable
                            style={
                            {
                                backgroundColor: 'gray',
                                padding: 10,
                                borderRadius: 5,
                                width: 100
                            }}
                        >
                            <Text
                                style={
                                {
                                    textAlign: 'center',
                                    color: 'white',
                                    fontSize: 15
                                }}
                            >
                                {'Esperando'}
                            </Text>
                        </Pressable>
                    ) :
                    (
                        <Pressable
                            onPress={() => crearFriendRequest(id, usuario._id)}
                            style={
                            {
                                backgroundColor: '#567189',
                                padding: 10,
                                borderRadius: 5,
                                width: 100
                            }}
                        >
                            <Text
                                style={
                                {
                                    textAlign: 'center',
                                    color: 'white',
                                    fontSize: 15
                                }}
                            >
                                {'Agregar'}
                            </Text>
                        </Pressable>
                    )
                }

            </Pressable>
        ) : null
    );
}

export default Usuario;
