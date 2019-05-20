import React, {Component} from 'react';
import {AsyncStorage, View, FlatList, Alert} from 'react-native';
import {Container, Item, Input, Icon, Text, ListItem, Left, Right, ActionSheet} from "native-base"
import Nav from "./../../components/Nav"
import axios from "axios"
import {server, timeout} from "./../../Accessible"
import Loading from "./../../components/Loading"
import Network from "./../../components/Network"
import NoData from "./../../components/NoData"
import update from "immutability-helper"
class Subjects extends Component {
  constructor( props ) {
    super( props )
    this.state = {
      students: props.navigation.state.params.students,
      room: props.navigation.state.params.room,
      token: null,
      subjects: [],
      backup: [],
      loading: true,
      error: false
    }
    this.mounted = false
  }

  fetchSubjects = async () => {
    axios.get(server+"api/rooms/subject?id=" + this.state.room.id, this.state.token)
    .then( response => {
      if( this.mounted ) {
        this.setState({ subjects: response.data.response, backup: response.data.response, error: false, loading: false })
      }
    })
    .catch( error => {
      if( this.mounted ) {
        this.setState({ loading: false, error: true })
      }
    })
  }

  startMount = async () => {
      const token = await AsyncStorage.getItem("token")
      if( token ) {
          const json = JSON.parse( token )
          if(this.mounted) {
              this.setState({ token: {headers: {"Authorization": "Bearer " + json.response.token}} })
              this.fetchSubjects()
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
  componentDidUpdate(props) {
    const e = this
    if(props.navigation.state.params != e.props.navigation.state.params) {
      if(e.props.navigation.state.params.saved) {
        const event = e.props.navigation.state.params.event
        const key = e.props.navigation.state.params.key
        const savedParams = e.props.navigation.state.params.saved
        if( event == "insert" ) {
          const newData = [...e.state.subjects, savedParams]
          const backup = [...e.state.backup, savedParams]
          e.setState({ subjects: newData, backup })
        } else {
          const index = this.copyIndex(savedParams.id)
          this.setState((state) => {
            return {
              subjects: update(state.subjects, {
                [key]: {$set: savedParams}
              }),
              backup: update(state.backup, {
                [index]: {$set: savedParams}
              })
            }
          })
        }
      }
    }
  }

  search = txt => {
    let text = txt.toLowerCase()
    let subjects = this.state.backup
    let filteredSubjects = subjects.filter(item => {
      if(item.subjectname.toLowerCase().match(text)) {
        return item;
      }
    })
    this.setState({ subjects: filteredSubjects })
  }
  notify = message => {
    Alert.alert("Message", message)
  }
  executeOption = (optionIndex, item, index) => {
    const { students, room, token } = this.state
    switch(optionIndex) {
      case 0:
      this.props.navigation.navigate("CheckAttendance", { students, room, subject: item, auth: token })
      break;

      case 1:
      this.props.navigation.navigate("Records", { subject: item, auth: token, room })
      break;

      case 2:
      item.roomid = room.id
      this.props.navigation.navigate("SubjectForm", { inputs: item, key: index })
      break;

      case 3:
      Alert.alert("Confirm Delete", "Are you sure you want to remove?", [
        { text: "Confirm", onPress: () => this.remove( item.id, index )},
        { text: "Cancel" }
      ])
      break;
    }
  }
  copyIndex = (id) => {
    return this.state.backup.findIndex(item => item.id == id)
  }
  remove = (id, key) => {
    axios.get(server+"api/rooms/subject?id=" + id, this.state.token)
    .then(response => {
      const refresh = this.state.subjects
      refresh.splice(key, 1)

      const backup = this.state.backup
      backup.splice(this.copyIndex(id), 1)

      this.setState({ subjects: refresh, backup })
      this.notify("Successfully removed.")
    }).
    catch(error => {
      this.notify("Connection Error")
    })
  }
  render() {
    const { loading, subjects, error, room } = this.state
    return (
      <Container>
        <Nav 
          left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
          right={{ icon: "add-circle", onPress: () => this.props.navigation.navigate("SubjectForm", { inputs: { id: 0, subjectname: "", timein: "", timeout: "", roomid: room.id }, key: 0 }) }}
        />

        { loading ? (<Loading text={"Loading"} />) : error ? (<Network />) : (
          <View style={{ flex: 1 }}>
              <View style={{ padding: 13 }}>
                <Item regular style={{ padding: 2 }}>
                  <Input onChangeText={(txt) => this.search(txt)} placeholder={"Choose subject"} />
                  <Icon active name={"search"} />
                </Item>
              </View>
            {
              subjects.length ? (
                <FlatList
                  keyboardShouldPersistTaps={'handled'}
                  removeClippedSubviews={false}
                  data={subjects}
                  keyExtractor={item => 'list-subjects-logs-' + item.id}
                  renderItem={({ item, index }) => (
                    <SubjectsList 
                    dataSource={item}
                    exec={(optionIndex) => this.executeOption(optionIndex, item, index) }
                    />
                  )}
                  />
              ) : (<NoData text={"No subject found."} />)
            }

          </View>
        ) }

      </Container>
    )
  }
}

const options = ["Check Attendance on this subject", "Attendance Records", "Edit subject", "Delete subject", "Cancel"]

const SubjectsList = ( props ) => (
  <ListItem onPress={() => ActionSheet.show(
    {
      options,
      cancelButtonIndex: 4,
      destructiveButtonIndex: 3,
      title: "Choose option"
    },
    index => props.exec( index )
  )}>
      <Left>
        <Text style={{ fontSize: 14 }}>{props.dataSource.subjectname}</Text>
      </Left>
      <Right>
        <Text note style={{ fontSize: 10 }}>{props.dataSource.timein} - {props.dataSource.timeout}</Text>
      </Right>
    </ListItem>
)

export default Subjects