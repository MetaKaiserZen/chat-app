import { useState } from 'react';

import
{
    Alert,
    View,
    KeyboardAvoidingView,
    Text,
    TextInput,
    Pressable,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import useHost from '../hooks/useHost';

import axios from 'axios';

const RegisterScreen = () =>
{
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imagen, setImagen] = useState('');

    const navigation = useNavigation();

    const myPromise = useHost();

    const handleRegister = async () =>
    {
        try
        {
            const usuario =
            {
                nombre: nombre,
                email: email,
                password: password,
                imagen, imagen
            }

            const { host } = await myPromise();

            const { data, status } = await axios.post(`${host}/register`, usuario);

            const { message } = data;

            if (status === 201)
            {
                setNombre('');
                setEmail('');
                setPassword('');
                setImagen('');

                Alert.alert('Mensaje', message,
                [
                    {
                        text: 'Volver',
                        onPress: () => navigation.navigate('LoginScreen'),
                        style: 'default'
                    }
                ]);
            }
        }
        catch (e)
        {
            console.log(e);

            !e.response && Alert.alert('Error al enviar la solicitud', 'Se produjo un error inesperado. Vuelve a intentarlo.', [{ text: 'Aceptar', style: 'default' }]);

            if (e.response)
            {
                const { data, status } = e.response;

                const { message } = data;

                status === 500 ?
                    Alert.alert('Error al enviar la solicitud', 'Se produjo un error inesperado. Vuelve a intentarlo.', [{ text: 'Aceptar', style: 'default' }]) :
                    Alert.alert('Mensaje', message);
            }
        }
    };

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
                        {'Register'}
                    </Text>

                    <Text
                        style={
                        {
                            fontSize: 17.5,
                            fontWeight: 'bold',
                            marginTop: 15
                        }}
                    >
                        {'Register to Your Account'}
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
                            {'Name'}
                        </Text>

                        <TextInput
                            value={nombre}
                            onChangeText={setNombre}
                            placeholderTextColor="black"
                            placeholder="Enter Your Name"
                            style={
                            {
                                fontSize: nombre ? 17.5 : 17.5,
                                borderBottomColor: 'gray',
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300
                            }}
                        />
                    </View>

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

                    <View>
                        <Text
                            style={
                            {
                                fontSize: 17.5,
                                fontWeight: 'bold',
                                color: 'gray'
                            }}
                        >
                            {'Image'}
                        </Text>

                        <TextInput
                            value={imagen}
                            onChangeText={setImagen}
                            placeholderTextColor="black"
                            placeholder="Enter Your Image"
                            style={
                            {
                                fontSize: imagen ? 17.5 : 17.5,
                                borderBottomColor: 'gray',
                                borderBottomWidth: 1,
                                marginVertical: 10,
                                width: 300
                            }}
                        />
                    </View>
                </View>

                <Pressable
                    onPress={handleRegister}
                    style={
                    {
                        width: 200,
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
                        {'Register'}
                    </Text>
                </Pressable>

                <Pressable
                    onPress={(() => navigation.goBack())}
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
                        {'Already have an account? Sign In'}
                    </Text>
                </Pressable>
            </KeyboardAvoidingView>
        </View>
    );
}

export default RegisterScreen;
