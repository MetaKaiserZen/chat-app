import { useState, useEffect } from 'react';

import
{
    Alert,
    View,
    KeyboardAvoidingView,
    Text,
    TextInput,
    Pressable
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import useHost from '../hooks/useHost';

import axios from 'axios';

const LoginScreen = () =>
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(false);

    const navigation = useNavigation();

    const myPromise = useHost();

    const appEnv = process.env.EXPO_PUBLIC_APP_ENV;
    const deployHost = process.env.EXPO_PUBLIC_DEPLOY_HOST;
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    const apiSecret = process.env.EXPO_PUBLIC_API_SECRET;

    const handleLogin = async () =>
    {
        try
        {
            setLogin(true);

            const usuario = { email, password }

            const { host } = await myPromise();

            const { data, status } = await axios.post(`${host}/login`, usuario);

            const { message, token } = data;

            if (status === 200)
            {
                AsyncStorage.setItem('authToken', token);

                setEmail('');
                setPassword('');

                Alert.alert('Mensaje', message,
                [
                    {
                        text: 'Aceptar',
                        onPress: () =>
                        (
                            setLogin(false),
                            navigation.navigate('HomeScreen')
                        ),
                        style: 'default'
                    }
                ]);
            }
        }
        catch (e)
        {
            console.log(e);

            setEmail('');
            setPassword('');

            !e.response && Alert.alert('Error de inicio de sesión', 'Se produjo un error inesperado. Intenta iniciar sesión de nuevo.',
            [
                {
                    text: 'Aceptar',
                    onPress: () => setLogin(false),
                    style: 'default'
                }
            ]);

            if (e.response)
            {
                const { data, status } = e.response;

                const { message } = data;

                status === 500 ?
                    Alert.alert('Error de inicio de sesión', 'Se produjo un error inesperado. Intenta iniciar sesión de nuevo.',
                    [
                        {
                            text: 'Aceptar',
                            onPress: () => setLogin(false),
                            style: 'default'
                        }
                    ]) :
                    Alert.alert('Mensaje', message,
                    [
                        {
                            text: 'Aceptar',
                            onPress: () => setLogin(false),
                            style: 'default'
                        }
                    ]);
            }
        }
    };

    const loginStatus = async () =>
    {
        try
        {
            if (appEnv === undefined || !deployHost || !apiKey || !apiSecret)
            {
                return Alert.alert('Error de la aplicación', 'La aplicación no se pudo iniciar correctamente.',
                [
                    {
                        text: 'Aceptar',
                        style: 'default'
                    }
                ]);
            }

            const token = await AsyncStorage.getItem('authToken');

            token && navigation.replace('HomeScreen');
        }
        catch (error)
        {
            console.log('Error', error)
        }
    }

    useEffect(() =>
    {
        loginStatus();
    }, []);

    return (
        <View
            style={
            {
                flex: 1,
                backgroundColor: 'white',
                padding: 10,
                alignItems: 'center'
            }}
        >
            <KeyboardAvoidingView>
                <View
                    style={
                    {
                        marginTop: 100,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text
                        style={
                        {
                            color: '#4A55A2',
                            fontSize: 17.5,
                            fontWeight: 'bold'
                        }}
                    >
                        {'Sign In'}
                    </Text>

                    <Text
                        style={
                        {
                            fontSize: 17.5,
                            fontWeight: 'bold',
                            marginTop: 15
                        }}
                    >
                        {'Sign In to Your Account'}
                    </Text>
                </View>

                <View style={{ marginTop: 50 }}>
                    <View>
                        <Text
                            style={
                            {
                                fontSize: 17.5,
                                fontWeight: 'bold',
                                color: 'gray'
                            }}
                        >
                            {'Email'}
                        </Text>

                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholderTextColor="black"
                            placeholder="Enter Your Email"
                            style={
                            {
                                fontSize: email ? 17.5 : 17.5,
                                borderBottomColor: 'gray',
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300
                            }}
                        />
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <Text
                            style={
                            {
                                fontSize: 17.5,
                                fontWeight: 'bold',
                                color: 'gray'
                            }}
                        >
                            {'Password'}
                        </Text>

                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholderTextColor="black"
                            placeholder="******"
                            secureTextEntry={true}
                            style={
                            {
                                fontSize: password ? 17.5 : 17.5,
                                borderBottomColor: 'gray',
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300
                            }}
                        />
                    </View>
                </View>

                <Pressable
                    onPress={() => !login && handleLogin()}
                    style={
                    {
                        width: 150,
                        backgroundColor: '#4A55A2',
                        padding: 15,
                        marginTop: 50,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderRadius: 5
                    }}
                >
                    <Text
                        style={
                        {
                            color: 'white',
                            fontSize: 17.5,
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}
                    >
                        {'Login'}
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => navigation.navigate('RegisterScreen')}
                    style={{ marginTop: 15 }}
                >
                    <Text
                        style={
                        {
                            textAlign: 'center',
                            color: 'gray',
                            fontSize: 15
                        }}
                    >
                        {"Don't have an account? Sign Up"}
                    </Text>
                </Pressable>
            </KeyboardAvoidingView>
        </View>
    );
}

export default LoginScreen;
