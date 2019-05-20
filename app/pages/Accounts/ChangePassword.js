import React, {Component} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import {Container, Content, Item, Input, Icon, Button, Text, H3} from "native-base"
import Nav from "./../../components/Nav"
import axios from "axios"
import {server} from "./../../Accessible"
class ChangePassword extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            newPass: "",
            confirm: "",
            showNew: false,
            showConfirm: false,
            id: props.navigation.state.params.id,
            token: props.navigation.state.params.token
        }
    }
    handleChange = (name, txt) => {
        this.setState({ [name]: txt })
    }
    notify = message => {
        Alert.alert("Message", message)
    }
    clear = () => {
        this.setState({ newPass: "", confirm: "" })
    }
    submit = () => {
        const { newPass, confirm } = this.state
        if( newPass != "" ) {

            if( confirm == newPass ) {
                //
                axios.post(server + "api/users/password/change", { id: this.state.id, password: this.state.newPass }, this.state.token)
                .then(response => {
                    Alert.alert("Message", "Password has been saved, Do you want to logout?", [
                        { text: "Logout", onPress: () => this.props.navigation.navigate("Logout") },
                        { text: "Not Now!" }
                    ])
                    this.clear()
                }).
                catch(error => {
                    this.notify("Please check your network connection.")
                })
            } else {
                // error
                this.notify("Please confirm your new password.")
            }

        } else {
            // error
            this.notify("Please enter your new password.")
        }
    }
    render() {
        const {newPass, confirm, showNew, showConfirm} = this.state
        return (
        <Container>
            <Nav
                left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
                />
                <Content padder>
                    <H3 style={{ marginTop: 15, marginBottom: 15, fontSize: 18 }}>Change Password</H3>
                    <Item regular style={style.formControll}>
                        <Input secureTextEntry={!showNew} defaultValue={newPass} onChangeText={(txt) => this.handleChange("newPass", txt)} placeholder={"New Password"} />
                        <TouchableOpacity onPress={() => this.setState({ showNew: !showNew })}>
                            {
                                !showNew ? (<Icon name={"visibility"} />) : (<Icon name={"visibility-off"} />)
                            }
                        </TouchableOpacity>
                    </Item>
                    <Item regular style={style.formControll}>
                        <Input secureTextEntry={!showConfirm} defaultValue={confirm} onChangeText={(txt) => this.handleChange("confirm", txt)} placeholder={"Confirm New Password"} />
                        <TouchableOpacity onPress={() => this.setState({ showConfirm: !showConfirm })}>
                            {
                                !showConfirm ? (<Icon name={"visibility"} />) : (<Icon name={"visibility-off"} />)
                            }
                        </TouchableOpacity>
                    </Item>
                    <Button onPress={() => this.submit()}>
                        <Text>Save Password</Text>
                    </Button>
                </Content>
        </Container>
        )
    }
}
const style = {
    formControll: {
        marginBottom: 20,
        borderRadius: 5
    }
  }
export default ChangePassword