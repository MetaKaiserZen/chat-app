import
{
    useState,
    useEffect,
    useContext
} from 'react';

import
{
    Pressable,
    Image,
    View,
    Text
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Type } from '../contexts/Context';

import useHost from '../hooks/useHost';

import axios from 'axios';

const Destinatario = ({ destinatario }) =>
{
    const [mensajes, setMensajes] = useState([]);
    const [ultimoMensaje, setUltimoMensaje] = useState([]);
    const [loading, setLoading] = useState(false);

    const { id } = useContext(Type);

    const navigation = useNavigation();

    const myPromise = useHost();

    const listarMensaje = async () =>
    {
        try
        {
            const { host } = await myPromise();

            const { data, status } = await axios.get(`${host}/mensajes/listar/${id}/${destinatario._id}`);

            if (status === 200)
            {
                setMensajes(data);

                if (mensajes.length)
                {
                    const mensaje = mensajes.filter((mensaje) => mensaje.tipo === 'texto');

                    const length = mensaje.length;

                    ultimoMensaje != mensaje[length - 1] && setUltimoMensaje(mensaje[length - 1]);
                }
            }

            status === 200 && (!loading && setLoading(true));
        }
        catch (e)
        {
            console.log(e);

            setMensajes([]);
            setUltimoMensaje([]);
        }
    }

    const formatTime = (timestamp) =>
    {
        const options = { hour: 'numeric', minute: 'numeric', timeZone: 'America/Santiago' }

        if (timestamp) { return new Date(timestamp).toLocaleString('es-Cl', options) };
    }

    useEffect(() =>
    {
        listarMensaje();
    }, [mensajes]);

    useEffect(() =>
    {
        const interval = setInterval(() =>
        {
            listarMensaje();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        loading ?
        (
            <Pressable
                onPress={() => navigation.navigate('MensajeScreen', { destinatario: destinatario._id })}
                style={
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 0.75,
                    borderColor: '#D0D0D0',
                    padding: 10
                }}
            >
                <Image
                    source={{ uri: destinatario?.imagen }}
                    style={
                    {
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        resizeMode: 'cover'
                    }}
                />

                <View style={{ marginLeft: 15, flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{destinatario?.nombre}</Text>

                    {
                        ultimoMensaje &&
                        (
                            <Text style={{ fontSize: 15, marginTop: 5, color: 'gray' }}>
                                {ultimoMensaje?.mensaje}
                            </Text>
                        )
                    }

                </View>

                <View>
                    <Text style={{ fontSize: 15, color: '#585858' }}>
                        {ultimoMensaje && formatTime(ultimoMensaje?.created_at)}
                    </Text>
                </View>
            </Pressable>
        ) : null
    );
}

export default Destinatario;
