import React, {Component} from 'react';
import {Container, Text, ListItem, Left, Right, Card, CardItem, Body} from "native-base"
import {Alert, View, FlatList} from "react-native"
import Nav from "./../components/Nav"
import NoData from "./../components/NoData"

class ShowRecords extends Component {
  constructor( props ) {
    super( props )
    this.state = {
        item: props.navigation.state.params.item,
        subject: props.navigation.state.params.subject,
        room: props.navigation.state.params.room,
        records: props.navigation.state.params.records,
        date: props.navigation.state.params.date
    }
    this.mounted = false
  }
  componentDidMount() {
    this.mounted = true
  }
  componentWillUnmount() {
      this.mounted = false
  }
  statusExtractor = ( data ) => {
    const { item } = this.state
    const json = JSON.parse( data )
    const index = json.findIndex(( row ) => row.id == item.id )
    let ret = ""
    if( !json[index] ) {
        ret = "-"
    } else {
        if( json[index].present ) {
            ret = "Present"
        } else if ( json[index].late != "" ) {
            ret = json[index].late
        } else {
            ret = "Absent"
        }
    }
    return ret
}
  render() {
      const { item, subject, room, records, date } = this.state
    return (
    <Container>
        <Nav 
          title={"Record's"}
          left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
          right={{ icon: "info", onPress: () =>  Alert.alert("Attendance Record", "Strand Name: " + room.roomname + "\n\nSubject: " + subject.subjectname + "\n\n" + "Time: " + subject.timein + "-" + subject.timeout)}}
        />
        <View style={{ margin: 15 }}>
            <Card>
                <CardItem header bordered>
                    <Text>{item.lastname}, {item.firstname} {item.middlename}.</Text>
                </CardItem>
                <CardItem>
                    <Body>
                        <Text>Filtered By: {date.fromdate} - {date.todate}</Text>
                    </Body>
                </CardItem>
            </Card>
        </View>
        {
            records.length ? (
                <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    removeClippedSubviews={false}
                    data={records}
                    keyExtractor={item => 'list-item-records-' + item.id}
                    renderItem={({ item }) => (
                        <Records 
                        dataSource={item}
                        status={this.statusExtractor(item.records)}
                        />
                    )}
                />
            ) : (<NoData text={"There is no records available based on filter."}/>)
        }
    </Container>
    )
  }
}
const Records = ( props ) => (
    <ListItem>
        <Left>
        <Text note>{ props.dataSource.date_recorded }</Text>
        </Left>
        <Right>
        <Text note>{ props.status }</Text>
        </Right>
    </ListItem>
)
export default ShowRecords