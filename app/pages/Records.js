import React, {Component} from 'react';
import {Container, Icon, Text, Button, ListItem, Left, Right} from "native-base"
import {Alert, View, DatePickerAndroid, TouchableOpacity, FlatList} from "react-native"
import Nav from "./../components/Nav"
import axios from "axios"
import Loading from "./../components/Loading"
import Network from "./../components/Network"
import NoData from "./../components/NoData"
import { server } from "./../Accessible"

class Records extends Component {
  constructor( props ) {
    super( props )
    this.state = {
      fromdate: "",
      todate: "",
      loading: false,
      error: false,
      students: [],
      records: [],
      subject: props.navigation.state.params.subject,
      room: props.navigation.state.params.room,
      token: props.navigation.state.params.auth
    }
    this.mounted = false
  }
  componentDidMount() {
    this.mounted = true
  }
  componentWillUnmount() {
      this.mounted = false
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
  filterRecords = () => {
    this.setState({ loading: true })
    const { room, subject, token, fromdate, todate } = this.state
    axios.get(server+"api/attendance/records?roomid=" + room.id + "&subjectid=" + subject.id + "&from=" + fromdate + "&to=" + todate, token)
    .then( response => {
        this.setState({ loading: false, error: false, students: response.data.students, records: response.data.response })
    })
    .catch( error => {
        this.setState({ loading: false, error: true })
    })
  }
  render() {
    const { fromdate, todate, loading, error, room, subject, students, records } = this.state
    return (
    <Container>
        <Nav 
          title={"Record's"}
          left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
          right={{ icon: "info", onPress: () =>  Alert.alert("Attendance Record", "Strand Name: " + room.roomname + "\n\nSubject: " + subject.subjectname + "\n\n" + "Time: " + subject.timein + "-" + subject.timeout)}}
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
            <Button small onPress={() => this.filterRecords()}>
              <Icon name={"search"} />
            </Button>
          </View>
        </View>
        { loading ? (<Loading />) : error ? (<Network />) : (
            students.length ? (
                <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    removeClippedSubviews={false}
                    data={students}
                    keyExtractor={item => 'list-item-students-' + item.id}
                    renderItem={({ item }) => (
                        <ListingRecord 
                        studentItem={item}
                        onPress={() => this.props.navigation.navigate("ShowRecords", { room, item, records, subject, date: { fromdate, todate } })}
                        />
                    )}
                />
            ) : (<NoData text={"Please filter records."} />)
        ) }
    </Container>
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
const ListingRecord = ( props ) => (
    <ListItem onPress={props.onPress}>
        <Left>
            <Text>{props.studentItem.lastname}, {props.studentItem.firstname} {props.studentItem.middlename}.</Text>
        </Left>
        <Right>
            <Icon name={"chevron-right"}/>
        </Right>
    </ListItem>
)
export default Records