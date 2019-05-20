import React, {Component} from 'react';
import { Text, Container, Picker, Form, Item, Icon, Button, Input, ListItem, Body, CheckBox } from "native-base"
import { View, FlatList } from "react-native"
import Loading from "./../components/Loading"
import Network from "./../components/Network"
import NoData from "./../components/NoData"
import Nav from "./../components/Nav"
import axios from "axios"
import { server } from "./../Accessible"
import update from "immutability-helper"

class Recipient extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: "default",
      token: props.navigation.state.params.token,
      loading: false,
      error: false,
      tags: props.navigation.state.params.tags,
      students: [],
      backup: [],
      strands: [],
      isChecked: true
    }
    this.mounted = false
  }
  fetchMe = (id, checker) => {
    this.setState({ loading: true })
    axios.get(server+"api/attendance/sms/selections?id=" + id, this.state.token)
    .then( response => {
      if( this.mounted ) {
        const students = response.data.students
        students.length ? students.map(( row ) => {
            row.checked = checker
            return row
        }) : []
        const defaultStrands = [{id: "all", roomname: "Select All Students"}]
        this.setState({ students, backup: students, strands: defaultStrands.concat(response.data.rooms), loading: false, error: false })
        this.tagSetup()
      }
    })
    .catch( error => {
      if( this.mounted ) {
        this.setState({ error: true, loading: false })
      }
    })
  }
  tagSetup = () => {
    const { tags, students } = this.state
    if( tags.length && students.length ) {
      tags.map(( row ) => {
        if( this.mounted ) {
          this.setState(( state ) => {
            return {
              students: update(state.students, {
                [state.students.findIndex(( index ) => index.id == row.id)]: { checked: { $set: true } }
              }),
              backup: update(state.backup, {
                [this.copyIndex(row.id)]: { checked: { $set: true } }
              })
            }
          })
        }
      })
    }
  }
  componentDidMount() {
    this.mounted = true
    this.fetchMe("all", false)
    
  }
  componentWillUnmount() {
    this.mounted = false
  }
  selectRecipient = ( item, index ) => {
      this.setState((state) => {
          return {
              students: update(state.students, {
                  [index]: { checked: { $set: !item.checked } }
              }),
              backup: update(state.backup, {
                [this.copyIndex(item.id)]: { checked: { $set: !item.checked } }
              })
          }
      })
  }
  copyIndex = id => {
    return this.state.backup.findIndex(( row ) => row.id == id)
  }
  pickerChange = val => {
    this.setState({ selected: val })
    this.fetchMe( val, true )
  }
  search = txt => {
    let text = txt.toLowerCase()
    let students = this.state.backup
    let filteredStudents = students.filter(item => {
      if(item.lastname.toLowerCase().match(text) || item.firstname.toLowerCase().match(text)) {
        return item;
      }
    })
    this.setState({ students: filteredStudents })
  }

  setupCheck = val => {
    const { students, backup } = this.state
      const _students = students.length ? students.map(( row ) => {
          row.checked = val
          return row
      }) : []

      const _backup = backup.length ? backup.map(( row ) => {
        row.checked = val
        return row
    }) : []

    this.setState({ students: _students, backup: _backup, isChecked: val })
  }

  _unchecking = () => {
      this.setupCheck( false )
  }

  _checking = () => {
    this.setupCheck( true )
  }

  getrecipient = () => {
    const { backup } = this.state
    let getBackup = backup.filter(( row ) => {
      if( row.checked ) {
        return row
      }
    })
    return getBackup
  }

  render() {
    const { error, loading, students, selected, strands, isChecked } = this.state
    return (
        <Container>
          <Nav 
            title={"Recipients"}
            left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
          />
          <View style={{ flex: 1 }}>
              { loading ? (<Loading text={"Loading..."}/>) : error ? (<Network />) : (
                    <View style={{ flex: 1 }}>
                    <Item regular style={{ marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                      <Form style={{ width: "100%" }}>
                        <Picker
                          note
                          mode="dropdown"
                          style={{ width: "100%" }}
                          selectedValue={selected}
                          onValueChange={(val) => this.pickerChange(val)}
                        >
                          { strands.length ? strands.map(( row ) => (
                            <Picker.Item key={row.id} label={row.roomname} value={row.id} />
                          )) : null }
                        </Picker>
                      </Form>
                    </Item>
                    <Item regular style={{ marginLeft: 15, marginTop: 15, marginRight: 15, marginBottom: 15 }}>
                      <Input onChangeText={(txt) => this.search(txt)} placeholder={"Search Student"} />
                      <Icon name={"search"} />
                    </Item>
                    {
                      students.length ? (
                        <FlatList
                        keyboardShouldPersistTaps={'handled'}
                        removeClippedSubviews={false}
                        data={students}
                        keyExtractor={item => 'list-item-students-' + item.id}
                        renderItem={({ item, index }) => (
                          <Students 
                          dataSource={item}
                          onPress={() => this.selectRecipient(item, index)}
                          />
                        )}
                        />
                      ) : (<NoData text={"There is no student available."} />)
                    }
                    <View style={{ flexDirection: "row" }}>
                      <View style={ style.buttonWrap }>
                        <Button block onPress={() => this.props.navigation.navigate("SendMessage", { recipient: this.getrecipient() })}><Text>Set Recipient</Text></Button>
                      </View>
                      <View style={ style.buttonWrap }>
                        { isChecked ? 
                          (<Button block onPress={() => this._unchecking()}><Text>Uncheck</Text></Button>) 
                          : 
                          (<Button block onPress={() => this._checking()}><Text>Check</Text></Button>) }
                      </View>
                    </View>
                    </View>
              ) }
          </View>
        </Container>
    )
  }
}
const style = {
  buttonWrap: {
    flex: 1,
    margin: 10
  }
}
const Students = ( props ) => (
    <ListItem onPress={props.onPress}>
        <CheckBox checked={props.dataSource.checked} onPress={props.onPress}/>
        <Body>
            <Text>{ props.dataSource.lastname }, { props.dataSource.firstname } { props.dataSource.middlename.charAt(0) }</Text>
        </Body>
    </ListItem>
)
export default Recipient