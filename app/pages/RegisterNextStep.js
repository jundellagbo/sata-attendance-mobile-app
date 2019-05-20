import React, {Component} from 'react';
import {Container, Content, Item, Input, Icon, Button, Text, Spinner } from "native-base"
import { StyleSheet, Image, Alert, TouchableOpacity, Dimensions } from "react-native"
import axios from "axios"
import { server } from "./../Accessible"
import update from "immutability-helper"

class RegisterNextStep extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            loadingSubmit: false,
            inputs: props.navigation.state.params.inputs
        }
    }

    componentDidMount() {
        const { inputs } = this.state
        inputs.email = ""
        inputs.username = ""
        inputs.password = ""
        inputs.confirm = ""
        this.setState({ inputs })
    }

    handleChange = (name, txt) => {
        this.setState((state) => {
          return {
            inputs: update(state.inputs, {
              [name]: { $set: txt }
            })
          }
        })
    }

    reset = () => {
        this.setState((state) => {
            return {
                inputs: update(state.inputs, {
                    email: { $set: "" },
                    username: { $set: "" },
                    password: { $set: "" },
                    confirm: { $set: "" }
                })
            }
        })
    }

    notify = message => {
        Alert.alert("Message", message)
    }

    submit = async () => {
        this.setState({ loadingSubmit: true })
        const { inputs } = this.state
        if( inputs.password != inputs.confirm ) {
            this.setState({ loadingSubmit: false })
            this.notify("Please confirm your password.")
        } else {
            axios.post(server + "api/auth/register", inputs)
            .then(response => {
                this.setState({ loadingSubmit: false })
                if( response.data.error ) {
                    const error = response.data.error
                    const message = error[Object.keys(error)[0]][0]
                    this.notify(message)
                } else {
                    Alert.alert("Message", "You are now registered, please wait for the confirmation.", [{ text: "Okay", onPress: () => this.doneSubmit() }], { cancelable: false})
                }
            })
            .catch(error => {
                this.setState({ loadingSubmit: false })
                this.notify("Please check your internet connection.")
            })
        }
    }

    doneSubmit = () => {
        this.reset();
        this.props.navigation.navigate("Register", { saved: true })
    }

    render() {
        const { loadingSubmit, inputs } = this.state
        return (
            <Container>
                <Content contentContainerStyle={style.container}>
                    <Image style={style.image} source={require("./../img/material-ui-logo.png")} />
                    <Text style={{ marginTop: 10, marginBottom: 10, fontSize: 20 }}>Sign up Credentials</Text>
                    <Text style={{ marginBottom: 10 }}>Please enter your credentials.</Text>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Icon name={"email"} />
                        <Input defaultValue={inputs.email} onChangeText={(txt) => this.handleChange("email", txt)} placeholder={"Email"} />
                    </Item>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Icon name={"person"} />
                        <Input defaultValue={inputs.username} onChangeText={(txt) => this.handleChange("username", txt)} placeholder={"username"} />
                    </Item>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll]}>
                        <Icon name={"lock"} />
                        <Input defaultValue={inputs.password} onChangeText={(txt) => this.handleChange("password", txt)} secureTextEntry placeholder={"Password"} />
                    </Item>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll]}>
                        <Icon name={"lock"} />
                        <Input defaultValue={inputs.confirm} onChangeText={(txt) => this.handleChange("confirm", txt)} secureTextEntry placeholder={"Confirm Password"} />
                    </Item>
                    <Button block onPress={() => this.submit()}>
                        {
                            loadingSubmit ? (<Spinner color={"#ffffff"} />) : (<Text>Register</Text>)
                        }
                    </Button>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ marginTop: 20 }}><Text style={{ color: "#4AB0F9" }}>Back to Information</Text></TouchableOpacity>
                </Content>
            </Container>
        )
    }
}

const { height } = Dimensions.get('window')

const style = StyleSheet.create({
    formControll: {
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100
    },
    container: {
        justifyContent: "center", 
        alignItems: "center",
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: height - (height - 70)
    }
})

export default RegisterNextStep