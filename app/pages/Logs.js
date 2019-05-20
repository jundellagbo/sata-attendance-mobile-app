import React, {PureComponent, Component} from 'react';
import {FlatList, Alert, AsyncStorage, DatePickerAndroid, View} from 'react-native';
import { Container, Text, Left, Right, ListItem } from "native-base"
import Nav from "./../components/Nav"
import axios from "axios"
import {server, timeout} from "./../Accessible"
import Loading from "./../components/Loading"
import Network from "./../components/Network"
import NoData from "./../components/NoData"
class Logs extends Component {
  constructor() {
    super()
    this.state = {
      token: null,
      loading: false,
      error: false,
      logs: [],
    }
    this.mounted = false
  }
  startMount = async () => {
      const token = await AsyncStorage.getItem("token")
      if( token ) {
          const json = JSON.parse( token )
          if(this.mounted) {
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
  _fetchLogs = filter => {
    this.setState({ loading: true })
    axios.get(server+"api/logs/filter?filter=" + filter, this.state.token, timeout)
    .then(response => {
      console.log( response )
      this.setState({ loading: false, logs: response.data.response, error: false })
    })
    .catch(error => {
      this.setState({ loading: false, error: true })
    })
  }
  _datepicker = async () => {
    //await axios.get(server+"api/logs/filter", )
    const { action, year, month, day } = await DatePickerAndroid.open({
      date: new Date()
    })

    if( action !== DatePickerAndroid.dismissedAction) {
      let getDate = this._withZero(parseInt(month+1)) + "/" + this._withZero(day) + "/" + year
      this._fetchLogs(getDate)
    }
  }
  _withZero = val => {
    return val < 10 ? '0' + val : val
  }
  render() {
    const { loading, logs, error } = this.state    
    return (
      <Container>
        <Nav 
          title={"Logs"}
          left={{ icon: "assignment", onPress: () => this._datepicker() }}
          right={{ text: "Messages", onPress: () => this.props.navigation.navigate("Messages", { token: this.state.token }) }}
        />
        {
          loading ? (<Loading text={"Loading"} />) : error ? (<Network />) : 
          (
            <View style={{ flex: 1 }}>
              {
                logs.length ? (
                  <FlatList
                  keyboardShouldPersistTaps={'handled'}
                  removeClippedSubviews={false}
                  data={logs}
                  keyExtractor={item => 'list-item-logs-' + item.id}
                  renderItem={({ item }) => (
                    <LogsComponent 
                    dataSource={item}
                    />
                  )}
                  />
                ) : <NoData text={"Empty Logs, please select date."} />
              }
            </View>
          )
        }
      </Container>
    )
  }
}

class LogsComponent extends PureComponent {
  render() {
    const { dataSource } = this.props
    return (
      <ListItem>
        <Left>
          <Text style={{ fontSize: 14 }}>{dataSource.logname}</Text>
        </Left>
        <Right>
          <Text note style={{ fontSize: 10 }}>{dataSource.datelog}</Text>
        </Right>
      </ListItem>
    )
  }
}

export default Logs