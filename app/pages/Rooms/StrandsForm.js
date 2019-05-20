import React, {Component} from 'react';
import {Container, Content, Item, Input, Button, Text, Spinner} from "native-base"
import {Alert, AsyncStorage} from "react-native"
import Nav from "../../components/Nav"
import update from "immutability-helper"
import axios from "axios"
import {server} from "../../Accessible"
class StrandsForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputs: props.navigation.state.params.inputs,
            key: props.navigation.state.params.key,
            token: "",
            loading: false
        }
        this.mounted = false
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
    startMount = async () => {
        const token = await AsyncStorage.getItem("token")
        if( token ) {
            if( this.mounted ) {
                const json = JSON.parse( token )
                this.setState({ token: {headers: {"Authorization": "Bearer " + json.response.token}} })
            }
        }
    }
    notify = ( message ) => {
        Alert.alert("Message", message)
    }
    saveRoom = () => {
        this.setState({ loading: true })
        const { inputs, token, key } = this.state
        const edit = inputs.id != 0 ? true : false
        axios.post(server + "api/rooms/strands/store", inputs, token)
        .then(response => {
            this.setState({ loading: false })
            if( response.data.error ) {
                const error = response.data.error
                const message = error[Object.keys(error)[0]][0]
                this.notify(message)
            } else {
                const saved = inputs
                if(!edit) {
                    saved.id = response.data.response
                }
                const event = edit ? "edit" : "insert"
                Alert.alert("Message", edit ? "Strand has been saved!" : "New Strand has been added.", 
                [{ text: "Okay", 
                    onPress: () => this.props.navigation.navigate("Strands", { saved, key, event } )
                }] )
            }
        })
        .catch(error => {
            this.setState({ loading: false })
            this.notify("Please check your network connection.")
        })
    }
    componentDidMount() {
        this.mounted = true
        if( this.mounted ) {
            this.startMount()
        }
    }
    componentWillUnmount() {
        this.mounted = false
    }
    render() {
        const { loading, inputs } = this.state
        return (
            <Container>
                <Nav 
                title={inputs.id != 0 ? "Edit Strand" : "New Strand"}
                left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
                />
                <Content padder >
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Input defaultValue={inputs.strands} onChangeText={(txt) => this.handleChange("strands", txt)} placeholder={"Enter Strand Name"} />
                    </Item>
                    <Button style={{ elevation: 0 }} block onPress={() => this.saveRoom()}>
                        {
                            loading ? (<Spinner color={"#ffffff"}/>) : (<Text>Save Strand</Text>)
                        }
                    </Button>
                </Content>
            </Container>
        )
    }
}

const style = {
    formControll: {
        marginBottom: 20,
    }
}

export default StrandsForm