import React, {Component, PureComponent} from 'react';
import {Container, Icon, Text, Button, ListItem, Body} from "native-base"
import {Alert, View, DatePickerAndroid, TouchableOpacity, FlatList} from "react-native"
import Nav from "./../components/Nav"
import axios from "axios"
import { apiKey } from "./../Accessible"
import Loading from "./../components/Loading"
import Network from "./../components/Network"
import NoData from "./../components/NoData"

class Messages extends Component {
  constructor() {
    super()
    this.state = {
      fromdate: "",
      todate: "",
      loading: false,
      error: false,
      messages: []
    }
  }
  smsCredits = () => {
    Alert.alert("", "Loading...", [])
    axios.get("https://api.semaphore.co/api/v4/account?apikey=" + apiKey)
    .then( response => {
      this.notify("You have " + response.data.credit_balance + " sms credits")
    })
    .catch( error => {
      this.notify("Please check your internet connection.")
    })
  }
  notify = message => {
    Alert.alert("Message", message)
  }
  setDate = async type => {
    const { action, year, month, day } = await DatePickerAndroid.open({
      date: new Date()
    })
    if( action !== DatePickerAndroid.dismissedAction) {
      let getDate = year+"-"+this._withZero(parseInt(month+1))+"-"+this._withZero(day)
      this.setState({ [type]: getDate })
    }
  }
  _withZero = val => {
    return val < 10 ? '0' + val : val
  }
  loadSms = () => {
    this.setState({ loading: true })
    const {fromdate, todate} = this.state
    if( fromdate == "" || todate == "" ) {
      this.setState({ loading: false })
      this.notify("Dates are required.")
    } else {
      const api = "https://api.semaphore.co/api/v4/messages?apikey=" + apiKey + "&startDate=" + fromdate + "&endDate=" + todate + "&limit=1000"
      axios.get(api)
      .then( response => {
        if( response.data.endDate ) {
          this.setState({ loading: false, error: false })
          this.notify(response.data.endDate[0])
        } else {
          this.setState({ loading: false, error: false, messages: response.data })
        }
      })
      .catch( error => {
        this.setState({ loading: false, error: true })
      })
    }
  }
  popupMessage = (number, message) => {
    Alert.alert(number, message, [{ text: "Close Message" }])
  }
  render() {
    const { fromdate, todate, messages, loading, error } = this.state
    return (
    <Container>
        <Nav 
          title={"Messages"}
          left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
          right={{ text: "SMS Credits", onPress: () => this.smsCredits() }}
        />
        <View style={{ flexDirection: "row", padding: 15 }}>
          <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => this.setDate("fromdate")} style={style.alignContent}>
            <Icon name={"assignment"} />
            <Text style={{ paddingLeft: 10 }}>{fromdate != "" ? fromdate : "mm-dd-yyyy"}</Text>
          </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.setDate("todate")} style={style.alignContent}>
              <Icon name={"assignment"} />
              <Text style={{ paddingLeft: 10 }}>{todate != "" ? todate : "mm-dd-yyyy"}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.5}}>
            <Button small onPress={() => this.loadSms()}>
              <Icon name={"search"} />
            </Button>
          </View>
        </View>
        {
          loading ? (<Loading text={"Loading"} />) : error ? (<Network />) : 
          (
            <View style={{ flex: 1 }}>
              {
                messages.length ? (
                  <FlatList
                  keyboardShouldPersistTaps={'handled'}
                  removeClippedSubviews={false}
                  data={messages}
                  keyExtractor={item => 'list-item-messages-' + item.message_id}
                  renderItem={({ item }) => (
                    <MessagesComponent 
                    dataSource={item}
                    openMessage={() => this.popupMessage(item.recipient, item.message)}
                    />
                  )}
                  />
                ) : <NoData text={"Empty message, please filter date."} />
              }
              <Button onPress={() => this.props.navigation.navigate("SendMessage", { token: this.props.navigation.state.params.token })} style={{ margin: 15, elevation: 0 }} block>
                <Text>Send SMS</Text>
              </Button>
            </View>
          )
        }
    </Container>
    )
  }
}
class MessagesComponent extends PureComponent {
  render() {
    const { dataSource, openMessage } = this.props
    return (
      <ListItem avatar onPress={openMessage}>
        <Body>
          <Text style={{ fontSize: 14 }}>{dataSource.recipient}</Text>
          <Text note numberOfLines={1} style={{ fontSize: 10 }}>{dataSource.message}</Text>
        </Body>
      </ListItem>
    )
  }
}
const style = {
  alignContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  }
}
export default Messages