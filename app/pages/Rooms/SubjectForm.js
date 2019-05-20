import React, {Component} from 'react';
import {Alert, AsyncStorage} from 'react-native';
import {Container, Content, Item, Input, Button, Text, Spinner} from "native-base"
import Nav from "../../components/Nav"
import update from "immutability-helper"
import axios from "axios"
import {server} from "../../Accessible"

class SubjectForm extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            inputs: props.navigation.state.params.inputs,
            key: props.navigation.state.params.key,
            loading: false,
            token: null
        }
        this.mounted = false
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

    componentDidMount() {
        this.mounted = true
        if( this.mounted ) {
            this.startMount()
        }
    }

    componentWillUnmount() {
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

    validate = () => {
        const { subjectname, timein, timeout} = this.state.inputs
        let res = ""
        if( subjectname == "" ) {
            res = "The field subjectname is required"
        }
        else if( timein == "" ) {
            res = "The field timein is required"
        }
        else if( timeout == "" ) {
            res = "The field timeout is required"
        }
        return res
    }

    notify = message => {
        Alert.alert("Message", message)
    }

    saveSubject = () => {
        this.setState({ loading: true })
        const { inputs, token, key } = this.state
        const edit = inputs.id != 0 ? true : false

        if( this.validate() != "" ) {
            this.setState({ loading: false })
            this.notify(this.validate())
        } else {
            axios.post(server + "api/rooms/subject/store", inputs, token)
            .then( response => {
                this.setState({ loading: false })
                const saved = this.state.inputs
                if(!edit) {
                    saved.id = response.data.response
                }
                const event = edit ? "edit" : "insert"
                Alert.alert("Message", edit ? "Subject has been saved!" : "New subject has been added.", 
                [{ text: "Okay", 
                    onPress: () => this.props.navigation.navigate("Subjects", { saved, key, event } )
                }] )
            })
            .catch( error => {
                this.setState({ loading: false })
                this.notify("Connection error.")
            })
        }
    }

    render() {
        const { inputs, loading } = this.state
        return (
            <Container>
                <Nav 
                title={inputs.id != 0 ? "Edit Subject" : "New Subject"}
                left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
                />
                <Content padder >
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Input defaultValue={inputs.subjectname} onChangeText={(txt) => this.handleChange("subjectname", txt)} placeholder={"Subject name"} />
                    </Item>

                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Input defaultValue={inputs.timein} onChangeText={(txt) => this.handleChange("timein", txt)} placeholder={"Time in"} />
                    </Item>

                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Input defaultValue={inputs.timeout} onChangeText={(txt) => this.handleChange("timeout", txt)} placeholder={"Time out"} />
                    </Item>


                    <Button style={{ elevation: 0 }} block onPress={() => this.saveSubject()}>
                        {
                            loading ? (<Spinner color={"#ffffff"}/>) : (<Text>Save Subject</Text>)
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


export default SubjectForm