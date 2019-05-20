import React from "react"
import {Container, Header, Item, Icon, Button, Text, Input, ListItem, Left, Right, Card, CardItem} from "native-base"
import {View, FlatList, Modal, TouchableOpacity, TimePickerAndroid, Alert} from "react-native"
import NoData from "./../../components/NoData"
import update from "immutability-helper"
import { server } from "../../Accessible";
import axios from "axios"
class CheckAttendance extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            students: [],
            backup: [],
            room: props.navigation.state.params.room,
            subject: props.navigation.state.params.subject,
            auth: props.navigation.state.params.auth,
            modal: false,
            key: 0,
            time: ""
        }
        this.mounted = false
    }
    componentDidMount() {
        this.mounted = true
        if( this.mounted ) {
            let data = this.props.navigation.state.params.students
            const get = data.map(( row ) => {
                row.late = ""
                row.present = false
                return row
            })
            this.setState({ students: get, backup: get })
        }
    }
    componentWillUnmount() {
        this.mounted = false
    }
    search = txt => {
        let text = txt.toLowerCase()
        let students = this.state.backup
        let filteredStudents = students.filter(item => {
            if(item.firstname.toLowerCase().match(text) || item.lastname.toLowerCase().match(text) || item.middlename.toLowerCase().match(text)
            ) {
                return item;
            }
        })
        this.setState({ students: filteredStudents }) 
    }
    closeModal = () => {
        this.setState({ modal: false })
    }
    setup = index => {
        this.setState({ key: index, modal: true })
    }
    copyIndex = (id) => {
        return this.state.backup.findIndex(item => item.id == id)
    }

    execSetup = async (val) => {
        const { key } = this.state
        const keyBackup = this.copyIndex(this.state.students[key].id)
        switch(val)
        {
            case "present":
            this.setState(( state ) => {
                return {
                    students: update(state.students, {
                        [key]: { 
                            [val]: { $set: true },
                            late: { $set: "" } 
                        }
                    }),
                    backup: update(state.backup, {
                        [keyBackup]: { 
                            [val]: { $set: true },
                            late: { $set: "" } 
                        }
                    }),
                    modal: false
                }
            })
            break;

            case "absent":
            this.setState(( state ) => {
                return {
                    students: update(state.students, {
                        [key]: { 
                            present: { $set: false },
                            late: { $set: "" } 
                        }
                    }),
                    backup: update(state.backup, {
                        [keyBackup]: { 
                            present: { $set: false },
                            late: { $set: "" } 
                        }
                    }),
                    modal: false
                }
            })
            break;

            case "late":
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: 12,
                minute: 0,
                is24Hour: false
            });
            if( action !== TimePickerAndroid.dismissedAction ) {
                let _hour = (hour % 12) || 12;
                const get_hour = _hour < 10 ? '0' + _hour : _hour
                let _minute = minute < 10 ? '0' + minute : minute
                let AM_PM = hour < 12 || hour === 0 ? "AM" : "PM"
                const getTime = get_hour + ":" + _minute + " " + AM_PM
                this.setState((state) => {
                    return {
                        students: update(state.students, {
                            [key]: { 
                                present: { $set: false },
                                late: { $set: getTime } 
                            }
                        }),
                        backup: update(state.backup, {
                            [keyBackup]: { 
                                present: { $set: false },
                                late: { $set: getTime } 
                            }
                        }),
                        modal: false,
                        time: ""
                    }
                })
            }
            break;
        }
    }
    
    confirmSubmit = () => {
        const { backup, room, subject, auth } = this.state
        axios.post(server+"api/attendance/submit", { records: JSON.stringify(backup), room: JSON.stringify(room), subject: JSON.stringify(subject), roomid: room.id, subjectid: subject.id }, auth)
        .then( response => {
            this.reset()
            Alert.alert("Message", "Added to attendance record", [
                { text: "Go to tracks", onPress: () => this.props.navigation.navigate("Tracks")},
                { text: "Done" }
            ])
        })
        .catch( error => {
            this.notify("Connection Error")
        })
    }
    reset = () => {
        const refresh = this.state.backup.map(( row ) => {
            row.late = ""
            row.present = false
            return row
        })
        this.setState({ students: refresh, backup: refresh })
    }
    submit = () => {
        Alert.alert("Confirmation", "You are about to send an attendance record, please confirm.", [
            { text: "Confirm", onPress: () => this.confirmSubmit() },
            { text: "Cancel" }
        ])
    }
    notify = message => {
        Alert.alert("Message", message)
    }
    render() {
        const { students, modal } = this.state
        let _index = 0
        students.map(( row ) => {
            if(row.late != "" || row.present) {
                _index++
            }
            return _index
        })
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon name="chevron-left" />
                        </TouchableOpacity>
                        <Input onChangeText={(txt) => this.search(txt)} placeholder="Search Student" />
                        <Icon name="search" />
                    </Item>
                </Header>
                {
                    students.length ? (
                        <FlatList
                        keyboardShouldPersistTaps={'handled'}
                        removeClippedSubviews={false}
                        data={students.sort((a,b) => {
                            if(a.lastname.toLowerCase() < b.lastname.toLowerCase()) return -1;
                            if(a.lastname.toLowerCase() < b.lastname.toLowerCase()) return 1;
                            return 0
                        })}
                        keyExtractor={item => 'list-item-students-' + item.id}
                        renderItem={({ item, index }) => (
                            <StudentsList dataSource={item} index={index} onPress={() => this.setup(index)} />
                        )} />
                            
                    ) : (<NoData text={"No Students record."} />)
                }
                {
                    _index ? (
                        <View style={{ padding : 15 }}>
                            <Button onPress={() => this.submit()} block><Text>Submit Attendance</Text></Button>
                        </View>
                    ) : null
                }
                <Modal
                animationType={"slide"}
                transparent={true}
                visible={modal}
                onRequestClose={() => this.closeModal()}
                >
                    <View style={style.containerModal}>
                        <Card style={{ width: "90%" }}>
                            <CardItem header>
                                <Left>
                                    <Text>Select Options</Text>
                                </Left>
                                <Right>
                                    <TouchableOpacity style={{ float: "right" }} onPress={() => this.closeModal()}>
                                        <Icon name={"close"} />
                                    </TouchableOpacity>
                                </Right>
                            </CardItem>
                            <CardItem>
                                <View style={{ flex: 1, padding: 3 }}>
                                    <Button onPress={() => this.execSetup("present")} small block>
                                        <Text style={{ fontSize: 10 }}>Present</Text>
                                    </Button>
                                </View>
                                <View style={{ flex: 1, padding: 3 }}>
                                    <Button onPress={() => this.execSetup("late")} small block>
                                        <Text style={{ fontSize: 10 }}>Late</Text>
                                    </Button>
                                </View>
                                <View style={{ flex: 1, padding: 3 }}>
                                    <Button onPress={() => this.execSetup("absent")} small block>
                                        <Text style={{ fontSize: 10 }}>Absent</Text>
                                    </Button>
                                </View>
                            </CardItem>
                        </Card>
                    </View>
                </Modal>

            </Container>
        )
    }
}

const style = {
    containerModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
}

const StudentsList = ( props ) => (
    <ListItem
    onPress={props.onPress}
    >
        <Left>
        <Text>{props.dataSource.lastname} {props.dataSource.firstname} {props.dataSource.middlename.charAt(0)}.</Text>
        </Left>
        <Right>
        <Text style={{ fontSize: 12, color: "#ff4081" }}>
        {
            props.dataSource.late != "" ?
            <Text style={{ fontSize: 12, color: "#ff4081" }}>{"Late " + props.dataSource.late}</Text>:
            props.dataSource.present ?
            <Text style={{ fontSize: 12, color: "#ff4081" }}>Present</Text>:
            <Text style={{ fontSize: 12, color: "#ff4081" }}>-</Text>
        }
        </Text>
        </Right>
    </ListItem>
)

export default CheckAttendance