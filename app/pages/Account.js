import React, {Component} from 'react';
import {AsyncStorage, Alert, TouchableOpacity} from 'react-native';
import {Text, Container, Content, Item, Input, Icon, Button, Spinner} from "native-base"
import Nav from "./../components/Nav"
import update from "immutability-helper"
import axios from "axios"
import {server} from "./../Accessible" 
class Accounts extends Component {
  constructor() {
    super()
    this.state = {
      token: null,
      input: {},
      loading: false
    }
    this.mounted = false
  }
  startMount = async () => {
    const token = await AsyncStorage.getItem("token")
    if( token ) {
      const json = JSON.parse( token )
      if(this.mounted) {
        this.setState({ token: {headers: {"Authorization": "Bearer " + json.response.token}}, input: json.user })
      }
    }
  }
  componentDidMount() {
    this.mounted = true
    if( this.mounted ) {
      this.startMount()
    }
  }
  handleChange = (key, txt) => {
    this.setState((state) => {
      return {
        input: update(state.input, {
          [key]: {$set: txt}
        })
      }
    })
  }
  notify = message => {
    Alert.alert("Message", message)
  }
  submit = () => {
    const { input, token } = this.state
    this.setState({ loading: true })
    axios.post(server + "api/users/edit", input, token)
    .then(response => {
      if( response.data.error ) {
          const error = response.data.error
          const message = error[Object.keys(error)[0]][0]
          this.notify(message)
      } else {
          const token = AsyncStorage.getItem("token")
          token.then(response => {
            const json = JSON.parse(response)
            json.user = input
            AsyncStorage.setItem("token", JSON.stringify(json))
            this.notify("Account has been saved.")
          })
          .catch(error => {
            this.notify("Invalid Token, please logout")
          })
      }
      this.setState({ loading: false })
    })
    .catch(error => {
      this.setState({ loading: false })
      this.notify("Please check your internet connection.")
    })
  }
  render() {
    const { input, loading } = this.state
    return (
      <Container>
        <Nav 
        title={"My Account"}
        left={{ icon: "power-settings-new", onPress: () => this.props.navigation.navigate("Logout") }}
        right={{ icon: "lock", onPress: () => this.props.navigation.navigate("ChangePassword", { id: input.id, token: this.state.token }) }}
        />
        <Content padder>
          <Item regular style={style.formControll}>
              <Input defaultValue={input.firstname} onChangeText={(txt) => this.handleChange("firstname", txt)} placeholder={"Firstname"} />
          </Item>
          <Item regular style={style.formControll}>
              <Input defaultValue={input.middlename} onChangeText={(txt) => this.handleChange("middlename", txt)} placeholder={"Middlename"} />
          </Item>
          <Item regular style={style.formControll}>
              <Input defaultValue={input.lastname} onChangeText={(txt) => this.handleChange("lastname", txt)} placeholder={"Lastname"} />
          </Item>
          <Item regular style={style.formControll}>
              <Input defaultValue={input.contact} onChangeText={(txt) => this.handleChange("contact", txt)} placeholder={"Contact Number"} />
          </Item>
          <Item regular style={[style.formControll, style.disabled]}>
              <Input disabled defaultValue={input.username} onChangeText={(txt) => this.handleChange("username", txt)} placeholder={"Username"} />
              <TouchableOpacity onPress={() => this.notify(input.username)}>
                <Icon name={"assignment-ind"} />
              </TouchableOpacity>
          </Item>
          <Item regular style={[style.formControll, style.disabled]}>
              <Input disabled defaultValue={input.email} onChangeText={(txt) => this.handleChange("email", txt)} placeholder={"Email"} />
              <TouchableOpacity onPress={() => this.notify(input.email)}>
                <Icon name={"assignment-ind"} />
              </TouchableOpacity>
          </Item>
          <Button block style={{ elevation: 0 }} color={"primary"} variant={"contained"} onPress={() => this.submit()}>
            {
              loading ? (<Spinner color={"#ffffff"} />) : (<Text>Save Data</Text>)
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
      borderRadius: 5
  },
  disabled: {
    backgroundColor: "#dedede"
  }
}
export default Accounts