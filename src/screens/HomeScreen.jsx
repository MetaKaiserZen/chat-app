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
    Text,
    View
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { jwtDecode } from 'jwt-decode';

import "core-js/stable/atob";

import { Type } from '../contexts/Context';

import Usuario from '../components/Usuario';

import useHost from '../hooks/useHost';

import axios from 'axios';

const HomeScreen = () =>
{
    const [usuarios, setUsuarios] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [error, setError] = useState(false);

    const { setID } = useContext(Type);

    const navigation = useNavigation();

    const myPromise = useHost();

    const listarUsuario = async () =>
    {
        try
        {
            const { id } = await sessionID();

            const { host } = await myPromise();

            const { data, status } = await axios.get(`${host}/usuarios/listar/${id}`);

            const response = await axios.get(`${host}/friend-requests/listar/${id}`);

            status === 200 && response.status === 200 && (error && setError(false));

            status === 200 && setFriendRequests(response.data);
            status === 200 && setUsuarios(data);
        }
        catch (e)
        {
            console.log(e);

            setUsuarios([]);
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

    const handleExit = async () =>
    {
        await AsyncStorage.removeItem('authToken');

        const token = await AsyncStorage.getItem('authToken');

        !token && navigation.replace('LoginScreen');
    }

    sessionID = () =>
    {
        return new Promise(async (resolve) =>
        {
            const token = await AsyncStorage.getItem('authToken');

            const decoded = jwtDecode(token);

            const id = decoded.id;

            setID(id);

            resolve({ id: id });
        });
    }

    useEffect(() =>
    {
        listarUsuario();
    }, []);

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            listarUsuario();
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
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                    {'Chat-App'}
                </Text>
            ),
            headerRight: () =>
            (
                <View
                    style={
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10
                    }}
                >
                    <Ionicons
                        name="chatbox-ellipses-outline"
                        size={32}
                        color="black"
                        onPress={() => navigation.navigate('DestinatarioScreen')}
                    />
                    <MaterialIcons
                        name={friendRequests.length > 0 ? "people" : "people-outline"}
                        size={32}
                        color={friendRequests.length > 0 ? "#82CD47" : "black"}
                        onPress={() => navigation.navigate('FriendRequestScreen')}
                    />
                    <Ionicons
                        name="exit-outline"
                        size={32}
                        color="black"
                        onPress={handleExit}
                    />
                </View>
            )
        });
    }, [usuarios]);

    return (
        <View>
            <View>

                {
                    usuarios.map((usuario, index) =>
                    (
                        <Usuario key={index} usuario={usuario} />
                    ))
                }

            </View>
        </View>
    );
}

export default HomeScreen;
