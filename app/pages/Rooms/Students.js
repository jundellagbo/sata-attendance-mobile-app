import React, {Component} from 'react';
import {View, AsyncStorage, FlatList, Alert} from 'react-native';
import {Container, Item, Input, Icon, Button, ListItem, Text, Left, Right, ActionSheet, Spinner} from "native-base"
import Nav from "./../../components/Nav"
import { secondary, server, timeout } from "./../../Accessible"
import axios from "axios"
import Loading from "./../../components/Loading"
import Network from "./../../components/Network"
import NoData from "./../../components/NoData"
import update from "immutability-helper"
class Students extends Component {
    constructor(props) {
        super(props)
        this.state = {
            room: props.navigation.state.params.room,
            loading: true,
            students: [],
            backup: [],
            error: false,
            token: null,
            loadingsms: false,
            user: null
        }
        this.mounted = true
    }
    mutate() {
        return {
            id: 0,
            firstname: "",
            middlename: "",
            lastname: "",
            address: "",
            contact: "",
            guardian_name: "",
            guardian_contact: ""
        }
    }
    startMount = async () => {
        const token = await AsyncStorage.getItem("token")
        if( token ) {
            const json = JSON.parse( token )
            if(this.mounted) {
                this.setState({ token: {headers: {"Authorization": "Bearer " + json.response.token}}, user: json.user })
                this.fetchStudent()
            }
        }
    }
    fetchStudent = async () => {
        await axios.get(server + "api/students?id=" + this.state.room.id, this.state.token, timeout)
        .then(response => {
            if( this.mounted ) {
                this.setState({ loading: false, students: response.data.students, backup: response.data.students, error: false })
            }
        })
        .catch(error => {
            if( this.mounted ) {
                this.setState({ loading: false, error: true })
            }
        })
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
                    const newData = [...e.state.students, savedParams]
                    const backupData = [...e.state.backup, savedParams]
                    e.setState({ students: newData, backup: backupData })
                } 
                else {
                    const index = this.copyIndex(savedParams.id)
                    this.setState((state) => {
                    return {
                            students: update(state.students, {
                                [key]: {$set:savedParams}
                            }),
                            backup: update(state.backup, {
                                [index]: {$set:savedParams}
                            }),
                        }
                    })
                }
            }
        }
    }
    notify = (message) => {
        Alert.alert("Message", message)
    }
    remove = (id, key) => {
        axios.get(server + "api/students/remove?id=" + id, this.state.token, timeout)
            .then(response => {
            this.notify("Successfully removed.")
            const refresh = [...this.state.students]
            refresh.splice(key, 1)

            const backup = [...this.state.backup]
            backup.splice(this.copyIndex(id), 1)

            this.setState({ students: refresh, backup })
        })
        .catch(error => {
            this.notify("Please check your network connection.")
        })
    }
    executeOption = (option, item, index) => {
        switch(option)
        {
            case 0:
            // Edit Form
            this.props.navigation.navigate("StudentsForm", { inputs: item, key: index, roomid: this.state.room.id })
            break;

            case 1:
            // Delete Student
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

    search = txt => {
        let text = txt.toLowerCase()
        let students = this.state.backup
        let filteredStudents = students.filter(item => {
        if(item.firstname.toLowerCase().match(text) || item.middlename.toLowerCase().match(text) || item.lastname.toLowerCase().match(text)) {
            return item;
        }
        })
        this.setState({ students: filteredStudents })
    }

    smsCheck = () => {
        this.setState({ loadingsms: true })
        const { room, token } = this.state
        axios.get(server+"api/attendance/sms/confirm?roomid=" + room.id, token )
        .then( response => {
            this.setState({ loadingsms: false })
            if( response.data.response == 0 ) {
                this.notify("SMS is not available right now, please check attendance.")
            } else {
                const message = "There are " + response.data.response + " records found in attendance. \n\nYou have " + response.data.semaphore.credit_balance + " sms credits available."
                Alert.alert("Message", message, [
                    { text: "Confirm and send SMS", onPress: () => this.smsConfirm() },
                    { text: "Cancel" }
                ])
            }
        })
        .catch( error => {
            this.notify("Connection Error")
            this.setState({ loadingsms: true })
        })
    }

    smsConfirm = () => {
        const { room, token } = this.state
        Alert.alert("", "Sending...", [])
        axios.get(server+"api/attendance/sms/send?roomid=" + room.id, token)
        .then( response => {
            this.notify("SMS has been sent.")
        })
        .catch( error => {
            this.notify("Connection Error.")
        })
    }

    render() {
        const { students, loading, error, room, auth, loadingsms, token, user } = this.state
        return (
            <Container>
                <Nav 
                title={"Class Records"}
                left={{ icon: "arrow-back", onPress: () => this.props.navigation.goBack() }}
                right={{ icon: "info", onPress: () => this.props.navigation.navigate("Summary", { room: room, token: token }) }}
                />
                {
                    loading ? (<Loading text={"Loading"} />) : 
                    (
                        error ? (<Network />)
                        :
                        (
                            <View style={{ flex: 1 }}>
                            <View style={{ padding: 13 }}>
                                <Item regular style={{ padding: 2 }}>
                                    <Input onChangeText={(txt) => this.search(txt)} placeholder={"Search student"} />
                                    <Icon active name={"search"} />
                                </Item>
                            </View>
                            <View style={{ paddingLeft: 13, paddingRight: 13, paddingBottom: 5 }}>
                            <Button style={[style.btn, { backgroundColor: secondary }]} block onPress={() => this.smsCheck()}>
                            {
                                loadingsms ? (<Spinner color={"#ffffff"} />) : (<Text>Send SMS</Text>)
                            }
                            </Button>
                            </View>
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
                                    <StudentsList 
                                    dataSource={item} 
                                    exec={(optionIndex) => this.executeOption(optionIndex, item, index) }
                                    isAdmin={user.role == 1 ? true : false}
                                    />
                                    )}
                                    />
                                ) :
                                (
                                    <NoData text={"No Students record."} />
                                )
                            }
                            <View style={{ flexDirection: "row" }}>
                                {
                                    user.role == 1 && (
                                        <View style={style.buttonWrap}>
                                            <Button style={style.btn} block onPress={() => this.props.navigation.navigate("StudentsForm", { inputs: this.mutate(), key: 0, roomid: room.id })}><Text style={{ color: "#ffffff" }}>New Student</Text></Button>
                                        </View>
                                    )
                                }
                                {
                                    students.length ?
                                    (
                                        <View style={style.buttonWrap}>
                                            <Button onPress={() => this.props.navigation.navigate("Subjects", { students, room, auth })} style={style.btn} secondary block><Text style={{ color: "#ffffff" }}>Check Attendance</Text></Button>
                                        </View>
                                    ) : null
                                }
                            </View>
                            </View>
                        )
                    )
                }
            </Container>
        )
    }
}
const style = {
    buttonWrap: {
        flex: 1,
        padding: 10
    },

    subHead: {
        padding: 13
    },

    btn: { elevation: 0 },

    textCenter: {
        textAlign: "center",
        marginBottom: 5
    },
    containerModal: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center"
    },
    full: {
        flex: 1
    }
}

const options = ["Edit", "Delete", "Cancel"]

const StudentsList = ( props ) => (
    <ListItem
    onPress={() => props.isAdmin ? ActionSheet.show(
        {
            options,
            cancelButtonIndex: 2,
            destructiveButtonIndex: 1,
            title: "Student Settings"
        },
        index => props.exec( index )
        ) : Alert.alert("Message", "You can't manage students settings.")}
    >
        <Left>
        <Text>{props.dataSource.lastname}, {props.dataSource.firstname} {props.dataSource.middlename.charAt(0)}.</Text>
        </Left>
        <Right>
        <Icon name={"chevron-right"} />
        </Right>
    </ListItem>
)

export default Students