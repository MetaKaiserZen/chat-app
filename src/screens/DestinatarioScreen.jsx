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
    Text,
    ScrollView,
    Pressable
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import { Type } from '../contexts/Context';

import Destinatario from '../components/Destinatario';

import useHost from '../hooks/useHost';

import axios from 'axios';

const DestinatarioScreen = () =>
{
    const [destinatarios, setDestinatarios] = useState([]);
    const [error, setError] = useState(false);

    const { id } = useContext(Type);

    const navigation = useNavigation();

    const myPromise = useHost();

    const listarDestinatario = async () =>
    {
        try
        {
            const { host } = await myPromise();

            const { data, status } = await axios.get(`${host}/destinatarios/listar/${id}`);

            status === 200 && (error && setError(false));
            status === 200 && setDestinatarios(data);
        }
        catch (e)
        {
            console.log(e);

            setDestinatarios([]);
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
        listarDestinatario();
    }, []);

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            listarDestinatario();
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
                            {'Chats'}
                        </Text>
                    </View>
                </View>
            )
        });
    }, [destinatarios]);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable>

                {
                    destinatarios.map((destinatario, index) =>
                    (
                        <Destinatario key={index} destinatario={destinatario}/>
                    ))
                }

            </Pressable>
        </ScrollView>
    );
}

export default DestinatarioScreen;
