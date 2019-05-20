import React from "react"
import {Icon, StyleProvider, Root} from "native-base"
import material from "./../native-base-theme/variables/material"
import getTheme from "./../native-base-theme/components"
import { Dimensions } from "react-native"
import { createAppContainer, createSwitchNavigator, createStackNavigator, createMaterialTopTabNavigator } from "react-navigation"
// pages
import Tracks from "./pages/Tracks"
import Strands from "./pages/Strands"
import Levels from "./pages/Levels"
import Rooms from "./pages/Rooms"

import Account from "./pages/Account"
import Login from "./pages/Login"
import Register from "./pages/Register"
import RegisterNextStep from "./pages/RegisterNextStep"
import LoadingScreen from "./pages/LoadingScreen"
import Logs from "./pages/Logs"
import Logout from "./pages/Logout"
import Messages from "./pages/Messages"
import SendMessage from "./pages/SendMessage"
import Recipient from "./pages/Recipient"
import HelpDesk from "./pages/HelpDesk"
import Summary from "./pages/Summary"
// settings
import Students from "./pages/Rooms/Students"
import TracksForm from "./pages/Rooms/TracksForm"
import StrandsForm from "./pages/Rooms/StrandsForm"
import LevelForm from "./pages/Rooms/LevelForm"
import RoomForm from "./pages/Rooms/RoomForm"

import StudentsForm from "./pages/Rooms/StudentsForm"
import CheckAttendance from "./pages/Rooms/CheckAttendance"
import Subjects from "./pages/Rooms/Subjects"
import Records from "./pages/Records"
import ShowRecords from "./pages/ShowRecords"
import SubjectForm from "./pages/Rooms/SubjectForm"
// accounts
import ChangePassword from "./pages/Accounts/ChangePassword"
// helpdesk
import HelpDeskContent from "./pages/HelpDesk/HelpDeskContent"
class App extends React.Component {
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Root>
                    <AppContainer />
                </Root>
            </StyleProvider>
        )
    }
}

const _Auth = createStackNavigator({
    Login: {
        screen: Login
    },
    Register: {
        screen: Register
    },
    RegisterNextStep: {
        screen: RegisterNextStep
    }
},
{
    initialRouteName: "Login",
    headerMode: "none",
    navigationOptions: {
        header: null
    }
})


const _Tracks = createStackNavigator({
    Tracks: {
        screen: Tracks
    },
    TracksForm: {
        screen: TracksForm
    },
    Strands: {
        screen: Strands
    },
    StrandsForm: {
        screen: StrandsForm
    },
    Levels: {
        screen: Levels
    },
    LevelForm: {
        screen: LevelForm
    },
    Rooms: {
        screen: Rooms
    },
    RoomForm: {
        screen: RoomForm
    },
    Students: {
        screen: Students
    },
    Summary: {
        screen: Summary
    },
    StudentsForm: {
        screen: StudentsForm
    },
    Subjects: {
        screen: Subjects
    },
    SubjectForm: {
        screen: SubjectForm
    },
    Records: {
        screen: Records
    },
    ShowRecords: {
        screen: ShowRecords
    },
    CheckAttendance: {
        screen: CheckAttendance
    },
    HelpDesk: {
        screen: HelpDesk
    },
    HelpDeskContent: {
        screen: HelpDeskContent
    }
},
{
    initialRouteName: "Tracks",
    headerMode: "none",
    navigationOptions: {
        header: null,
        title: "Tracks",
        tabBarIcon: ({ tintColor, focused }) => (
            <Icon name={"home"} style={{ color: tintColor }} />
        )
    }
})

const _Account = createStackNavigator({
    Account: {
        screen: Account
    },
    ChangePassword: {
        screen: ChangePassword
    }
},
{
    initialRouteName: "Account",
    headerMode: "none",
    navigationOptions: {
        header: null,
        title: "Account",
        tabBarIcon: ({ tintColor, focused }) => (
            <Icon name={"account-circle"} style={{ color: tintColor }} />
        )
    }
})

const _Logs = createStackNavigator({
    Logs: {
        screen: Logs,
    },
    Messages: {
        screen: Messages
    },
    SendMessage: {
        screen: SendMessage
    },
    Recipient: {
        screen: Recipient
    }
},
{
    initialRouteName: "Logs",
    headerMode: "none",
    navigationOptions: {
        header: null,
        title: "Logs",
        tabBarIcon: ({ tintColor, focused }) => (
            <Icon name={"drafts"} style={{ color: tintColor }} />
        )
    }
})


const _App = createMaterialTopTabNavigator({
    Tracks: _Tracks,
    Account: _Account,
    Logs: _Logs,
    Logout: {
        screen: Logout,
        navigationOptions: navOption("Logout", "power-settings-new")
    }
},
{
    initialRouteName: "Tracks",
    tabBarPosition: "bottom",
    swipeEnabled: false,
    animationEnabled: true,
    lazy: true,
    initialLayout: initialLayout,
    tabBarOptions: {
        showIcon: true,
        showLabel: true,
        activeTintColor: '#00B0FF',
        inactiveTintColor: "grey",
        labelStyle: {
            fontSize: 10,
            marginTop: 7
        },
        iconStyle: {
            fontSize: 5,
            width: 30,
            height: 20
        },
        style: {
            backgroundColor: '#ffffff',
            height: 60,
            paddingBottom: 5,
            paddingTop: 5
        },
        indicatorStyle: {
            borderTopWidth: 2,
            borderTopColor: "#00B0FF"
        }
    }
})

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
  };

function navOption( title, icon ) {
    return {
        title: title,
        tabBarIcon: ({ tintColor, focused }) => (
        <Icon name={icon} style={{ color: tintColor }} />
        ),
    }
}

const AppContainer = createAppContainer(createSwitchNavigator(
    {
        Loading: LoadingScreen,
        Auth: _Auth,
        App: _App,
    }
))

export default App