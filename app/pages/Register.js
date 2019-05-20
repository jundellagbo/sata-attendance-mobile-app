import React, {Component} from 'react';
import {Container, Content, Item, Input, Button, Text, Spinner } from "native-base"
import { StyleSheet, Image, Alert, TouchableOpacity, Dimensions } from "react-native"
import update from "immutability-helper"

class Register extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            loadingSubmit: false,
            inputs: {
              firstname: "",
              middlename: "",
              lastname: "",
              contact: ""
            }
        }
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

    componentDidUpdate(props) {
      if( props.navigation.state.params != this.props.navigation.state.params ) {
        if( this.props.navigation.state.params.saved ) {
          this.setState({ inputs: { firstname: "", middlename: "", lastname: "", contact: "" } })
        }
      }
    }

    validate = () => {
      const { inputs } = this.state
      let response = ""
      if( inputs.firstname == "" ) {
        response = "The firstname field is required"
      }
      else if( inputs.middlename == "" ) {
        response = "The middlename field is required"
      }
      else if( inputs.lastname == "" ) {
        response = "The lastname field is required"
      }
      else if( inputs.contact == "" ) {
        response = "The contact field is required"
      }
      return response
    }

    notify = message => {
      Alert.alert("Message", message)
    }

    submit = async () => {
      const { inputs } = this.state
      this.setState({ loadingSubmit: true })
      setTimeout(() => {
        if( this.validate() != "" ) {
          this.notify( this.validate() )
        } else {
          this.props.navigation.navigate("RegisterNextStep", {inputs})
        }
        this.setState({ loadingSubmit: false })
      }, 500)
    }

    render() {
        const { loadingSubmit, inputs } = this.state
        return (
            <Container>
                <Content contentContainerStyle={style.container}>
                    <Image style={style.image} source={require("./../img/material-ui-logo.png")} />
                    <Text style={{ marginTop: 10, marginBottom: 10, fontSize: 20 }}>Sign up Information</Text>
                    <Text style={{ marginBottom: 10 }}>Please enter your information.</Text>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Input defaultValue={inputs.firstname} onChangeText={(txt) => this.handleChange("firstname", txt)} placeholder={"Firstname"} />
                    </Item>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Input defaultValue={inputs.middlename} onChangeText={(txt) => this.handleChange("middlename", txt)} placeholder={"Middlename"} />
                    </Item>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Input defaultValue={inputs.lastname} onChangeText={(txt) => this.handleChange("lastname", txt)} placeholder={"Lastname"} />
                    </Item>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Input defaultValue={inputs.contact} onChangeText={(txt) => this.handleChange("contact", txt)} placeholder={"Contact number"} />
                    </Item>
                    <Button block onPress={() => this.submit()}>
                        {
                            loadingSubmit ? (<Spinner color={"#ffffff"} />) : (<Text>Setup Credentials</Text>)
                        }
                    </Button>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")} style={{ marginTop: 20 }}><Text style={{ color: "#4AB0F9" }}>Back to Login</Text></TouchableOpacity>
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

export default Register