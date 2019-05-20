import React, {Component} from 'react';
import { Text, Container, Item, Textarea, Button, Badge, Content, Spinner } from "native-base"
import { View, TouchableOpacity, Alert } from "react-native"
import Nav from "./../components/Nav"
import axios from "axios"
import { server, secondary } from "./../Accessible"

class SendMessage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: props.navigation.state.params.token,
      loading: false,
      error: false,
      tags: [],
      message: "",
      loadingSubmit: false
    }
    this.mounted = false
  }
  componentDidMount() {
    this.mounted = true
  }
  componentWillUnmount() {
    this.mounted = false
  }
  componentDidUpdate( props ) {
    if( this.props.navigation.state.params.recipient ) {
      if( props.navigation.state.params.recipient != this.props.navigation.state.params.recipient ) {
        this.setState({ tags: this.props.navigation.state.params.recipient })
      }
    }
  }
  removeTag = index => {
    const tags = this.state.tags
    tags.splice(index, 1)
    this.setState({ tags })
  }
  notify = message => {
    Alert.alert("Message", message)
  }
  validate = () => {
    const { message, tags } = this.state
    let ret = ""
    if( message == "" ) {
      ret = "Message is required"
    } else if ( !tags.length ) {
      ret = "Please select recipient"
    }
    return ret;
  }
  sendSMS = () => {
    this.setState({ loadingSubmit: true })
    const { tags, message } = this.state
    if( this.validate() != "" ) {
      this.setState({ loadingSubmit: false })
      this.notify( this.validate() )
    } else {
      let recipients = ""
      tags.map(( row ) => {
        recipients += row.guardian_contact + ","
      })
      this.submitSMS( recipients, message )
    }
  }
  resetField = () => {
    this.setState({ tags: [], message: "", loadingSubmit: false })
  }
  submitSMS = ( numbers, message) => {
    axios.post(server + "api/attendance/sms/send/updates", {number: numbers, message}, this.state.token)
    .then( response => {
      this.notify("Message has been sent!")
      this.resetField()
    })
    .catch( error => {
      this.notif("Please check your internet connection.")
      this.setState({ loadingSubmit: false })
    })
  }
  render() {
    const { error } = this.state
    const { tags, token, message, loadingSubmit } = this.state
    return (
        <Container>
          <Nav 
            title={"Send Message"}
            left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
          />
          <Content padder>

            { error && (
              <View style={{ backgroundColor: "#ff6f60", padding: 15, marginBottom: 10 }}>
                <Text style={{ color: "#ffffff" }}>No Internet Connection.</Text>
              </View>
            ) }

            <View style={{ marginTop: 10, marginBottom: 10, flexDirection: 'row', alignSelf: "flex-start", flexWrap: "wrap" }}>
                { tags.length ? tags.map(( row, index ) => (
                  <Badge primary key={row.id} style={style.badge}>
                    <TouchableOpacity onPress={() => this.removeTag( index )}>
                      <Text>{row.lastname}, {row.firstname} {row.middlename.charAt(0)}.</Text>
                    </TouchableOpacity>
                  </Badge>
                )) : (<Text style={{ marginRight: 10 }}>Please add recipient.</Text>) }

                <Badge style={[style.badge, { backgroundColor: secondary }]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Recipient", { tags, token })}>
                  <Text>New Recipient</Text>
                </TouchableOpacity>
                </Badge>
            </View>

            <Item regular>
              <Textarea value={message} onChangeText={(txt) => this.setState({ message: txt }) } placeholder={"Enter Message"} style={{ width: "100%" }} rowSpan={5} />
            </Item>
            <Button onPress={() => this.sendSMS()} block style={{ marginTop: 10 }}>
            { loadingSubmit ? (<Spinner color={"#ffffff"} />) : (<Text>Send</Text>) }
            </Button>
          </Content>
        </Container>
    )
  }
}
const style = {
  badge: {
    marginRight: 5,
    marginBottom: 5
  }
}
export default SendMessage