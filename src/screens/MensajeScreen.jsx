import
{
    useState,
    useEffect,
    useLayoutEffect,
    useContext,
    useRef
} from 'react';

import
{
    Alert,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Pressable,
    TextInput,
    StyleSheet
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import
{
    Ionicons,
    MaterialIcons,
    Entypo,
} from '@expo/vector-icons';

import EmojiSelector from 'react-native-emoji-selector';

import * as ImagePicker from 'expo-image-picker';

import { Type } from '../contexts/Context';

import useHost from '../hooks/useHost';

import axios from 'axios';

const MensajeScreen = () =>
{
    const [host, setHost] = useState('');
    const [destinatarios, setDestinatarios] = useState([]);
    const [mensajes, setMensajes] = useState([]);
    const [mensajesSeleccionados, setMensajesSeleccionados] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [imagen, setImagen] = useState(null);
    const [emoji, setEmoji] = useState(false);
    const [loading, setLoading] = useState(false);
    const [enviar, setEnviar] = useState(false);
    const [errorDestinatarios, setErrorDestinatarios] = useState(false);
    const [errorMensajes, setErrorMensajes] = useState(false);

    const { id } = useContext(Type);

    const scrollViewRef = useRef(null);

    const navigation = useNavigation();

    const route = useRoute();

    const { destinatario } = route.params;

    const myPromise = useHost();

    const appEnv = process.env.EXPO_PUBLIC_APP_ENV;

    const listarDestinatario = async () =>
    {
        try
        {
            const { host } = await myPromise();

            const { data, status } = await axios.get(`${host}/mensajes/listar/${destinatario}`);

            if (status === 200 && !errorMensajes) { (errorDestinatarios && setErrorDestinatarios(false)); }

            if (status === 200 && !errorMensajes) { setHost(host); setDestinatarios(data); }

            status === 200 && listarMensaje();
        }
        catch (e)
        {
            console.log(e);

            setDestinatarios([]);
            setMensajes([]);
            setErrorDestinatarios(true);

            !errorDestinatarios && !e.response && Alert.alert('Error al consultar los datos', 'Se produjo un error inesperado. Vuelve a intentarlo.', [{ text: 'Aceptar', style: 'default' }]);

            if (!errorDestinatarios && e.response)
            {
                const { data, status } = e.response;

                const { message } = data;

                status === 500 ?
                    Alert.alert('Error al consultar los datos', 'Se produjo un error inesperado. Vuelve a intentarlo.', [{ text: 'Aceptar', style: 'default' }]) :
                    Alert.alert('Mensaje', message);
            }
        }
    }

    const listarMensaje = async () =>
    {
        try
        {
            const { host } = await myPromise();

            const { data, status } = await axios.get(`${host}/mensajes/listar/${id}/${destinatario}`);

            if (status === 200 && errorMensajes)
            {
                setErrorMensajes(false);

                return listarDestinatario();
            }

            status === 200 && scrollToBottom();

            status === 200 && setMensajes(data);
            status === 200 && (!loading && setLoading(true));
        }
        catch (e)
        {
            console.log(e);

            setDestinatarios([]);
            setMensajes([]);
            setErrorMensajes(true);

            !errorMensajes && !e.response && Alert.alert('Error al consultar los mensajes', 'Se produjo un error inesperado. Vuelve a intentarlo.', [{ text: 'Aceptar', style: 'default' }]);

            if (!errorMensajes && e.response)
            {
                const { data, status } = e.response;

                const { message } = data;

                status === 500 ?
                    Alert.alert('Error al consultar los mensajes', 'Se produjo un error inesperado. Vuelve a intentarlo.', [{ text: 'Aceptar', style: 'default' }]) :
                    Alert.alert('Mensaje', message);
            }
        }
    }

    const crearMensaje = async (tipo, imagen) =>
    {
        try
        {
            setMensajesSeleccionados([]);
            setEnviar(true);

            const formData = new FormData();

            formData.append('id', id);
            formData.append('destinatario', destinatario);

            switch (tipo)
            {
                case 'texto':
                    formData.append('mensaje', mensaje);
                    formData.append('tipo', tipo);
                    break;
                case 'imagen':
                    formData.append('imagen',
                    {
                        uri: imagen,
                        name: 'image.jpg',
                        type: 'image/jpeg'
                    });
                    formData.append('tipo', tipo);
                    break;
            }

            const { host } = await myPromise();

            const { status } = await fetch(`${host}/mensajes/crear`,
            {
                method: 'POST',
                body: formData,
                headers:
                {
                    'API-Key': process.env.EXPO_PUBLIC_API_KEY,
                    'API-Secret': process.env.EXPO_PUBLIC_API_SECRET
                }
            })

            if (status === 201)
            {
                setMensaje('');
                setImagen('');
                setEnviar(false);

                listarMensaje();
            }
        }
        catch (e)
        {
            console.log(e);

            setMensaje('');
            setImagen('');
            setEnviar(false);

            !e.response && Alert.alert('Error al enviar el mensaje', 'Se produjo un error inesperado. Vuelve a intentarlo.', [{ text: 'Aceptar', style: 'default' }]);

            if (e.response)
            {
                const { data, status } = e.response;

                const { message } = data;

                status === 500 ?
                    Alert.alert('Error al eliminar el mensaje', 'Se produjo un error inesperado. Vuelve a intentarlo', [{ text: 'Aceptar', style: 'default' }]) :
                    Alert.alert('Mensaje', message);
            }
        }
    }

    const eliminarMensaje = async (mensajesArray) =>
    {
        try
        {
            const request = { mensajesArray }

            const { host } = await myPromise();

            const { status } = await axios.post(`${host}/mensajes/eliminar`, request);

            status === 200 && setMensajesSeleccionados((seleccionados) => seleccionados.filter((id) => !mensajesArray.includes(id)));

            status === 200 && listarMensaje();
        }
        catch (e)
        {
            console.log(e);

            setMensajesSeleccionados([]);

            !e.response && Alert.alert('Error al eliminar los mensajes', 'Se produjo un error inesperado. Vuelve a intentarlo.', [{ text: 'Aceptar', style: 'default' }]);

            if (e.response)
            {
                const { data, status } = e.response;

                const { message } = data;

                status === 500 ?
                    Alert.alert('Error al eliminar los mensajes', 'Se produjo un error inesperado. Vuelve a intentarlo', [{ text: 'Aceptar', style: 'default' }]) :
                    Alert.alert('Mensaje', message);
            }
        }
    }

    const handleContentSizeChange = () =>
    {
        scrollToBottom();
    }

    const handleMensajeSeleccionado = async (mensaje) =>
    {
        const seleccionado = mensajesSeleccionados.includes(mensaje._id);

        seleccionado ?
            setMensajesSeleccionados((seleccionados) => seleccionados.filter((id) => id !== mensaje._id)) :
            setMensajesSeleccionados((seleccionados) => [ ...seleccionados, mensaje._id ]);
    }

    const handleEmoji = () =>
    {
        setEmoji(!emoji);
    }

    const handleImagen = async () =>
    {
        const result = await ImagePicker.launchImageLibraryAsync(
        {
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        !result.canceled && setMensaje(result.assets[0].uri);
        !result.canceled && setImagen(result.assets[0].uri);
    }

    const formatTime = (timestamp) =>
    {
        const options = { hour: 'numeric', minute: 'numeric', timeZone: 'America/Santiago' }

        return new Date(timestamp).toLocaleString('es-Cl', options);
    }

    const scrollToBottom = () =>
    {
        scrollViewRef.current && scrollViewRef.current.scrollToEnd({ animated: false });
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
    }, [errorDestinatarios, errorMensajes]);

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

                    {
                        mensajesSeleccionados.length > 0 ?
                        (
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{mensajesSeleccionados.length}</Text>
                            </View>
                        ) :
                        (
                            <View style={
                                {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginVertical: 10
                                }}
                            >
                                <Image
                                    source={{ uri: destinatarios?.imagen }}
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
                                        marginLeft: 15,
                                        fontSize: 20,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {destinatarios?.nombre}
                                </Text>
                            </View>
                        )
                    }

                </View>
            ),
            headerRight: () => mensajesSeleccionados.length > 0 ?
            (
                <View
                    style={
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10
                    }}
                >
                    <MaterialIcons name="delete" size={32} color="black" onPress={() => eliminarMensaje(mensajesSeleccionados)} />
                </View>
            ) : null
        });
    }, [destinatarios, mensajesSeleccionados]);

    return (
        loading ?
        (
            <KeyboardAvoidingView style={
                {
                    flex: 1,
                    backgroundColor: '#F0F0F0',
                    marginVertical: 10
                }}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onContentSizeChange={handleContentSizeChange}
                >

                    {
                        mensajes.map((mensaje, index) =>
                        {
                            const seleccionado = mensajesSeleccionados.includes(mensaje._id);

                            switch(mensaje.tipo)
                            {
                                case 'texto':
                                    return (
                                        <Pressable
                                            key={index}
                                            onLongPress={() => handleMensajeSeleccionado(mensaje)}
                                            style={
                                            [
                                                mensaje?.usuario?._id === id ? styles.usuario : styles.destinatario,
                                                seleccionado && { width: '100%', backgroundColor: '#F0FFFF' }
                                            ]}
                                        >
                                            <Text style={{ fontSize: 15, textAlign: seleccionado ? 'right' : 'left' }}>{mensaje?.mensaje}</Text>
                                            <Text style={styles.timestamp}>
                                                {formatTime(mensaje?.created_at)}
                                            </Text>
                                        </Pressable>
                                    );
                                case 'imagen':
                                    if (appEnv === 'local')
                                    {
                                        return (
                                            <Pressable
                                                key={index}
                                                onLongPress={() => handleMensajeSeleccionado(mensaje)}
                                                style={
                                                [
                                                    mensaje?.usuario?._id === id ? styles.usuario : styles.destinatario,
                                                    seleccionado && { width: '100%', backgroundColor: '#F0FFFF' }
                                                ]}
                                            >
                                                <View>
                                                    <Image
                                                        source={{ uri: `${host}/public/storage/uploads/${mensaje?.imagen}` }}
                                                        style={{ width: 200, height: 200, borderRadius: 7.5 }}
                                                    />

                                                    <Text
                                                        style={
                                                        {
                                                            ...styles.timestamp,
                                                            position: 'absolute',
                                                            right: 10,
                                                            bottom: 7.5,
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {formatTime(mensaje?.created_at)}
                                                    </Text>
                                                </View>
                                            </Pressable>
                                        );
                                    }
                            }
                        })
                    }

                </ScrollView>

                <View
                    style={
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        borderTopWidth: 1,
                        borderTopColor: '#DDDDDD',
                        marginBottom: emoji ? 0 : 12.5
                    }}
                >
                    <Entypo
                        onPress={handleEmoji}
                        name="emoji-happy"
                        size={25}
                        color="gray"
                        style={{ marginRight: 10 }}
                    />

                    <TextInput
                        value={mensaje}
                        onChangeText={setMensaje}
                        style={
                        {
                            flex: 1,
                            height: 40,
                            borderWidth: 1,
                            backgroundColor: (!errorDestinatarios && !errorMensajes) ? 'transparent' : '#DDDDDD',
                            borderColor: '#DDDDDD',
                            borderRadius: 20,
                            paddingHorizontal: 10
                        }}
                        placeholder="Escribe tu mensaje..."
                    />

                    <View
                        style={
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 7.5,
                            marginHorizontal: 7.5
                        }}
                    >

                        {
                            appEnv === 'local' && <Entypo name="camera" size={25} color="gray" onPress={handleImagen} />
                        }

                    </View>

                    <Pressable
                        onPress={() => (!errorDestinatarios && !errorMensajes) && !enviar && mensaje !== '' && crearMensaje(!imagen ? 'texto' : 'imagen', imagen)}
                        style={
                        {
                            backgroundColor: (!errorDestinatarios && !errorMensajes) ? '#007BFF' : '#DDDDDD',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 25
                        }}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{'Enviar'}</Text>
                    </Pressable>
                </View>

                {
                    emoji &&
                        <EmojiSelector
                            onEmojiSelected={(emoji) =>
                            {
                                setMensaje((previous) => previous + emoji);
                            }}
                            showSearchBar={false}
                            columns="12"
                            style={{ height: 250 }}
                        />
                }

            </KeyboardAvoidingView>
        ) : null
    );
}

export default MensajeScreen;

const styles = StyleSheet.create(
{
    usuario:
    {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        padding: 7.5,
        maxWidth: '50%',
        borderRadius: 7.5,
        marginHorizontal: 12.5,
        marginVertical: 5
    },
    destinatario:
    {
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        padding: 7.5,
        maxWidth: '50%',
        borderRadius: 7.5,
        marginHorizontal: 12.5,
        marginVertical: 5
    },
    timestamp:
    {
        textAlign: 'right',
        fontSize: 12.5,
        color: 'gray',
        marginTop: 5
    }
});
