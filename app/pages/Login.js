import React, {Component} from 'react';
import {Container, Content, Item, Input, Icon, Button, Text, Spinner } from "native-base"
import { StyleSheet, Image, Alert, AsyncStorage, TouchableOpacity } from "react-native"
import axios from "axios"
import { timeout, server } from "./../Accessible"

class Login extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            loadingSubmit: false,
            username: "",
            password: ""
        }
    }

    handleChange = (name, txt) => {
        this.setState({ [name]: txt })
    }

    submit = async () => {
        const e = this
        e.setState({ loadingSubmit: true })
        const { username, password } = e.state
        axios.post( server + "api/auth/login", { username, password }, timeout)
        .then( response => {
            e.setState({ loadingSubmit: false })
            if( response.data.response == "Unauthorised") {
                const message = response.data.count != 0 ? "Please wait for confirmation." : "Invalid Login, please try again"
                Alert.alert("Message", message)
            } else {
                AsyncStorage.setItem("token", JSON.stringify(response.data))
                e.props.navigation.navigate("App")
            }
        })
        .catch( error => {
            Alert.alert("Message", "Error Login, please check your internet connection.")
            e.setState({ loadingSubmit: false })
        })
    }

    render() {
        const { loadingSubmit } = this.state
        return (
            <Container>
                <Content contentContainerStyle={style.container}>
                    <Image style={style.image} source={require("./../img/material-ui-logo.png")} />
                    <Text style={{ marginTop: 10, marginBottom: 10, fontSize: 20 }}>Sign in</Text>
                    <Text style={{ marginBottom: 10 }}>Please enter your login credentials.</Text>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Icon name={"person"} />
                        <Input onChangeText={(txt) => this.handleChange("username", txt)} placeholder={"Username/email"} />
                    </Item>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll]}>
                        <Icon name={"lock"} />
                        <Input onChangeText={(txt) => this.handleChange("password", txt)} secureTextEntry placeholder={"Password"} />
                    </Item>
                    <Button block onPress={() => this.submit()} style={{ elevation: 0 }}>
                        {
                            loadingSubmit ? (<Spinner color={"#ffffff"} />) : (<Text>Login</Text>)
                        }
                    </Button>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Register")} style={{ marginTop: 20 }}><Text style={{ color: "#4AB0F9" }}>Signup</Text></TouchableOpacity>
                </Content>
            </Container>
        )
    }
}

const style = StyleSheet.create({
    formControll: {
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100
    },
    container: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        paddingLeft: 50,
        paddingRight: 50
    }
})

export default Login