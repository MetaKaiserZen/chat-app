import
{
    useState,
    useEffect,
    useLayoutEffect,
    useContext
} from 'react';

import
{
    Alert,
    View,
    Text
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import { Type } from '../contexts/Context';

import FriendRequest from '../components/FriendRequest';

import useHost from '../hooks/useHost';

import axios from 'axios';

const FriendRequestScreen = () =>
{
    const [friendRequests, setFriendRequests] = useState([]);
    const [error, setError] = useState(false);

    const { id } = useContext(Type);

    const navigation = useNavigation();

    const myPromise = useHost();

    const listarFriendRequests = async () =>
    {
        try
        {
            const { host } = await myPromise();

            const { data, status } = await axios.get(`${host}/friend-requests/listar/${id}`);

            status === 200 && (error && setError(false));
            status === 200 && setFriendRequests(data);
        }
        catch (e)
        {
            console.log(e);

            setFriendRequests([]);
            setError(true);

            !error && !e.response && Alert.alert('Error al consultar los datos', 'Se produjo un error inesperado. Vuelve a intentarlo.', [{ text: 'Aceptar', style: 'default' }]);

            if (!error && e.response)
            {
                const { data, status } = e.response;

                const { message } = data;

                status === 500 ?
                    Alert.alert('Error al consultar los datos', 'Se produjo un error inesperado. Vuelve a intentarlo.', [{ text: 'Aceptar', style: 'default' }]) :
                    Alert.alert('Mensaje', message);
            }
        }
    }

    useEffect(() =>
    {
        listarFriendRequests();
    }, []);

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            listarFriendRequests();
        }, 5000);

        return () => clearInterval(interval);
    }, [error]);

    useLayoutEffect(() =>
    {
        navigation.setOptions(
        {
            headerTitle: '',
            headerLeft: () =>
            (
                <View
                    style={
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10
                    }}
                >
                    <Ionicons name="arrow-back" size={32} color="black" onPress={() => navigation.goBack()} />

                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            {'Solicitudes de amistad'}
                        </Text>
                    </View>
                </View>
            )
        });
    }, [friendRequests]);

    return (
        <View style={{ padding: 10, marginHorizontal: 10 }}>

            {
                friendRequests.map((request, index) =>
                (
                    <FriendRequest
                        key={index}
                        request={request}
                        friendRequests={friendRequests}
                        setFriendRequests={setFriendRequests}
                    />
                ))
            }

        </View>
    );
}

export default FriendRequestScreen;
