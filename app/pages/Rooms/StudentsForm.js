import React from "react"
import {Container, Content, Item, Input, Button, Text, Spinner} from "native-base"
import {Alert, AsyncStorage} from "react-native"
import Nav from "../../components/Nav"
import update from "immutability-helper"
import axios from "axios"
import {server} from "../../Accessible"
class StudentsForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputs: props.navigation.state.params.inputs,
            key: props.navigation.state.params.key,
            roomid: props.navigation.state.params.roomid,
            loading: false,
            token: null
        }
        this.mounted = true
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
    handleChange = (name, txt) => {
        this.setState((state) => {
            return {
                inputs: update(state.inputs, {
                    [name]: { $set: txt }
                })
            }
        })
    }
    notify = (message) => {
        Alert.alert("Message", message)
    }
    saveStudent = () => {
        this.setState({ loading: true })
        // code here
        const { inputs, token, key, roomid } = this.state
        const edit = inputs.id != 0 ? true : false
        inputs.roomid = roomid
        axios.post(server+"api/students/store", inputs, token)
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
                Alert.alert("Message", edit ? "Student has been saved!" : "New student has been added.", 
                [{ text: "Okay", 
                    onPress: () => this.props.navigation.navigate("Students", { saved, key, event } )
                }] )
            }
        })
        .catch(error => {
            this.setState({ loading: false })
            this.notify("Please check your network connection.")
        })
    }
    render() {
        const { loading, inputs } = this.state
        return (
            <Container>
                <Nav 
                title={inputs.id != 0 ? "Edit Student" : "New Student"}
                left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
                />
                <Content padder >
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
                        <Input defaultValue={inputs.address} onChangeText={(txt) => this.handleChange("address", txt)} placeholder={"Address"} />
                    </Item>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Input defaultValue={inputs.contact} onChangeText={(txt) => this.handleChange("contact", txt)} placeholder={"Contact Number"} />
                    </Item>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Input defaultValue={inputs.guardian_name} onChangeText={(txt) => this.handleChange("guardian_name", txt)} placeholder={"Guardian Name"} />
                    </Item>
                    <Item regular style={[{ borderRadius: 5 }, style.formControll ]}>
                        <Input defaultValue={inputs.guardian_contact} onChangeText={(txt) => this.handleChange("guardian_contact", txt)} placeholder={"Guardian Contact Number"} />
                    </Item>
                    <Button style={{ elevation: 0 }} block onPress={() => this.saveStudent()}>
                    {
                        loading ? (<Spinner color={"#ffffff"}/>) : (<Text>Save Student</Text>)
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
export default StudentsForm